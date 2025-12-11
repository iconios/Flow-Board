import { type ClientSession } from "mongoose";
import type { BoardDeleteOutputType } from "../../types/board.type.js";
declare const DeleteBoardService: (
  boardId: string,
  userId: string,
  clientSession?: ClientSession,
) => Promise<BoardDeleteOutputType>;
export default DeleteBoardService;
//# sourceMappingURL=delete.board.service.d.ts.map
