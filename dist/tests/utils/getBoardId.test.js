import GetBoardId from "../../utils/get.boardId.util.js";
import { describe, expect, test } from "@jest/globals";
describe("Get Board ID", async () => {
  test("Get Board ID from List ID", async () => {
    const list = {
      listId: "68c6e5dc93d4123f2a6e22c0",
    };
    expect(await GetBoardId(list)).toHaveProperty("message", "Board found");
  });
});
//# sourceMappingURL=getBoardId.test.js.map
