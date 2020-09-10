import { CallOptions } from "grpc";

import { StreamsClient } from "../../../generated/streams_grpc_pb";
import { ReadReq } from "../../../generated/streams_pb";
import { Empty, StreamIdentifier } from "../../../generated/shared_pb";
import UUIDOption = ReadReq.Options.UUIDOption;
import SubscriptionOptions = ReadReq.Options.SubscriptionOptions;

import {
  StreamEnd,
  StreamExact,
  StreamRevision,
  StreamStart,
  SubscriptionHandler,
  ESDBConnection,
} from "../../types";
import { Command } from "../Command";
import { handleOneWaySubscription } from "./utils";

export class SubscribeToStream extends Command {
  private _stream: string;
  private _revision: StreamRevision;
  private _resolveLinkTos: boolean;
  // TODO: handle no handler
  private _handler!: SubscriptionHandler;

  constructor(stream: string) {
    super();
    this._stream = stream;
    this._revision = StreamEnd;
    this._resolveLinkTos = false;
  }

  /**
   * Starts the read at the given event revision.
   * @param revision
   */
  fromRevision(revision: number): SubscribeToStream {
    this._revision = StreamExact(revision);
    return this;
  }

  /**
   * Starts the read from the beginning of the stream. Default behavior.
   */
  fromStart(): SubscribeToStream {
    this._revision = StreamStart;
    return this;
  }

  /**
   * Starts the read from the end of the stream.
   */
  fromEnd(): SubscribeToStream {
    this._revision = StreamEnd;
    return this;
  }

  /**
   * The best way to explain link resolution is when using system projections. When reading the stream `$streams` (which
   * contains all streams), each event is actually a link pointing to the first event of a stream. By enabling link
   * resolution feature, the server will also return the event targeted by the link.
   */
  resolveLink(): SubscribeToStream {
    this._resolveLinkTos = true;
    return this;
  }

  /**
   * Disables link resolution. See {@link resolveLink}. Default behavior.
   */
  doNotResolveLink(): SubscribeToStream {
    this._resolveLinkTos = false;
    return this;
  }

  /**
   * Sets the handler for the subscription
   * @param handler Set of callbacks used during the subscription lifecycle.
   */
  handler(handler: SubscriptionHandler): SubscribeToStream {
    this._handler = handler;
    return this;
  }

  /**
   * Starts the subscription immediately.
   */

  async execute(connection: ESDBConnection): Promise<void> {
    const req = new ReadReq();
    const options = new ReadReq.Options();
    const identifier = new StreamIdentifier();
    identifier.setStreamname(Buffer.from(this._stream).toString("base64"));

    const uuidOption = new UUIDOption();
    uuidOption.setString(new Empty());

    const streamOptions = new ReadReq.Options.StreamOptions();
    streamOptions.setStreamIdentifier(identifier);

    switch (this._revision.__typename) {
      case "exact": {
        streamOptions.setRevision(this._revision.revision);
        break;
      }

      case "start": {
        streamOptions.setStart(new Empty());
        break;
      }

      default: {
        streamOptions.setEnd(new Empty());
        break;
      }
    }

    options.setStream(streamOptions);
    options.setResolveLinks(this._resolveLinkTos);
    options.setSubscription(new SubscriptionOptions());
    options.setUuidOption(uuidOption);
    options.setNoFilter(new Empty());

    req.setOptions(options);

    const callOptions: CallOptions = {
      deadline: Infinity,
    };

    const client = await connection._client(StreamsClient);
    const stream = client.read(req, this.metadata, callOptions);
    handleOneWaySubscription(stream, this._handler);
  }
}