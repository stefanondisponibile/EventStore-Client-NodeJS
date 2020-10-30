import { createTestNode } from "../utils";

import {
  ESDBConnection,
  EventStoreConnection,
  createContinuousProjection,
  disableProjection,
  getProjectionStatistics,
  enableProjection,
  ABORTED,
  RUNNING,
  UnknownError,
} from "../..";

describe("enableProjection", () => {
  const node = createTestNode();
  let connection!: ESDBConnection;

  const projection = `
  fromAll()
    .when({
      $init: function (state, ev) {
        return {
          last: ev,
        };
      },
    });
  `;

  beforeAll(async () => {
    await node.up();
    connection = EventStoreConnection.builder()
      .sslRootCertificate(node.certPath)
      .singleNodeConnection(node.uri);
  });

  afterAll(async () => {
    await node.down();
  });

  test("enables the projection", async () => {
    const PROJECTION_NAME = "projection_to_enable";

    await createContinuousProjection(PROJECTION_NAME, projection)
      .authenticated("admin", "changeit")
      .execute(connection);

    await disableProjection(PROJECTION_NAME)
      .writeCheckpoint()
      .authenticated("admin", "changeit")
      .execute(connection);

    const beforeDetails = await getProjectionStatistics(PROJECTION_NAME)
      .authenticated("admin", "changeit")
      .execute(connection);

    expect(beforeDetails).toBeDefined();
    expect(beforeDetails.projectionStatus).toBe(ABORTED);

    await enableProjection(PROJECTION_NAME)
      .authenticated("admin", "changeit")
      .execute(connection);

    const afterDetails = await getProjectionStatistics(PROJECTION_NAME)
      .authenticated("admin", "changeit")
      .execute(connection);

    expect(afterDetails).toBeDefined();
    expect(afterDetails.projectionStatus).toBe(RUNNING);
  });

  test("projection doesnt exist", async () => {
    const PROJECTION_NAME = "doesnt exist";

    await expect(
      enableProjection(PROJECTION_NAME)
        .authenticated("admin", "changeit")
        .execute(connection)
    ).rejects.toThrowError(UnknownError); // https://github.com/EventStore/EventStore/issues/2732
  });
});
