import type { Socket } from "socket.io";
import { type TaskMoveInputType } from "./types/task.type.js";
declare const TaskMoveUtility: (
  socket: Socket,
  payload: TaskMoveInputType,
) => Promise<void>;
export default TaskMoveUtility;
//# sourceMappingURL=task.move.utility.d.ts.map
