import {
  Channel,
  ChannelCredentials,
  Client as GRPCClient,
  ClientOptions as GRPCClientOptions,
  credentials as grpcCredentials,
  Metadata,
} from "@grpc/grpc-js";

import type {
  NodePreference,
  GRPCClientConstructor,
  EndPoint,
  Credentials,
  BaseOptions,
} from "../types";
import { debug } from "../utils";
import { discoverEndpoint } from "./discovery";
import { parseConnectionString } from "./parseConnectionString";

export interface DNSClusterOptions {
  domain: string;
  nodePreference?: NodePreference;
}

export interface GossipClusterOptions {
  endpoints: EndPoint[];
  nodePreference?: NodePreference;
}

export interface SingleNodeOptions {
  endpoint: EndPoint | string;
}

export type ConnectionTypeOptions =
  | DNSClusterOptions
  | GossipClusterOptions
  | SingleNodeOptions;

interface ChannelCredentialOptions {
  insecure?: boolean;
  rootCertificate?: Buffer;
  privateKey?: Buffer;
  certChain?: Buffer;
  verifyOptions?: Parameters<typeof ChannelCredentials.createSsl>[3];
}

export class Client {
  #connectionSettings: ConnectionTypeOptions;
  #channelCredentials: ChannelCredentials;
  #defaultCredentials?: Credentials;

  #channel?: Channel;
  #grpcClients: Map<GRPCClientConstructor<GRPCClient>, GRPCClient> = new Map();

  /**
   * Returns a connection from a connection string.
   * @param connectionString
   */
  static connectionString(
    connectionString: TemplateStringsArray | string,
    ...parts: string[]
  ): Client {
    const string: string = Array.isArray(connectionString)
      ? connectionString.reduce<string>(
          (acc, chunk, i) => `${acc}${chunk}${parts[i] ?? ""}`,
          ""
        )
      : (connectionString as string);

    debug.connection(`Using connection string: ${string}`);

    const options = parseConnectionString(string);

    const channelCredentials: ChannelCredentialOptions = {
      insecure: !options.tls,
    };

    if (options.dnsDiscover) {
      const { address } = options.hosts[0];

      if (options.hosts.length > 1) {
        debug.connection(
          `More than one address provided for discovery. Using first: ${address}.`
        );
      }

      return new Client(
        {
          domain: address,
          nodePreference: options.nodePreference,
        },
        channelCredentials,
        options.defaultCredentials
      );
    }

    if (options.hosts.length > 1) {
      return new Client(
        {
          endpoints: options.hosts,
          nodePreference: options.nodePreference,
        },
        channelCredentials,
        options.defaultCredentials
      );
    }

    return new Client(
      {
        endpoint: options.hosts[0],
      },
      channelCredentials,
      options.defaultCredentials
    );
  }

  constructor(
    connectionSettings: DNSClusterOptions,
    channelCredentials?: ChannelCredentialOptions,
    defaultUserCredentials?: Credentials
  );
  constructor(
    connectionSettings: GossipClusterOptions,
    channelCredentials?: ChannelCredentialOptions,
    defaultUserCredentials?: Credentials
  );
  constructor(
    connectionSettings: SingleNodeOptions,
    channelCredentials?: ChannelCredentialOptions,
    defaultUserCredentials?: Credentials
  );
  constructor(
    connectionSettings: ConnectionTypeOptions,
    channelCredentials: ChannelCredentialOptions = { insecure: false },
    defaultUserCredentials?: Credentials
  ) {
    this.#connectionSettings = connectionSettings;
    this.#defaultCredentials = defaultUserCredentials;

    if (channelCredentials.insecure) {
      debug.connection("Using insecure channel");
      this.#channelCredentials = grpcCredentials.createInsecure();
    } else {
      debug.connection(
        "Using secure channel with credentials %O",
        channelCredentials
      );
      this.#channelCredentials = grpcCredentials.createSsl(
        channelCredentials.rootCertificate,
        channelCredentials.privateKey,
        channelCredentials.certChain,
        channelCredentials.verifyOptions
      );
    }
  }

  /**
   * internal access to grpc client.
   */
  protected getGRPCClient = async <T extends GRPCClient>(
    Client: GRPCClientConstructor<T>,
    debugName: string
  ): Promise<T> => {
    if (this.#grpcClients.has(Client)) {
      debug.connection("Using existing grpc client for %s", debugName);
      return this.#grpcClients.get(Client) as T;
    }

    debug.connection("Createing client for %s", debugName);

    const channelOverride: GRPCClientOptions["channelOverride"] = await this.getChannel();

    const client = new Client(
      null as never,
      null as never,
      {
        channelOverride,
      } as GRPCClientOptions
    );

    this.#grpcClients.set(Client, client);

    return client;
  };

  private getChannel = async () => {
    if (this.#channel) {
      debug.connection("Using existing connection");
      return this.#channel;
    }

    const uri = await this.resolveUri();

    debug.connection(
      `Connecting to http${
        this.#channelCredentials._isSecure() ? "" : "s"
      }://%s`,
      uri
    );

    this.#channel = new Channel(uri, this.#channelCredentials, {});

    return this.#channel;
  };

  private resolveUri = async (): Promise<string> => {
    if ("endpoint" in this.#connectionSettings) {
      const { endpoint } = this.#connectionSettings;
      return typeof endpoint === "string"
        ? endpoint
        : `${endpoint.address}:${endpoint.port}`;
    }

    const { address, port } = await discoverEndpoint(
      this.#connectionSettings,
      this.#channelCredentials
    );

    return `${address}:${port}`;
  };

  protected metadata = ({
    credentials = this.#defaultCredentials,
    requiresLeader,
  }: BaseOptions): Metadata => {
    const metadata = new Metadata();

    if (credentials) {
      const auth = Buffer.from(
        `${credentials.username}:${credentials.password}`
      ).toString("base64");
      metadata.add("authorization", `Basic ${auth}`);
    }

    if (requiresLeader) {
      metadata.add("requires-leader", "true");
    }

    return metadata;
  };
}
