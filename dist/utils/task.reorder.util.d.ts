import type { Socket } from "socket.io";
import { type TaskReorderInputType } from "../types/task.type.js";
declare const TaskReorderUtility: (
  socket: Socket,
  payload: TaskReorderInputType,
) => Promise<void>;
export default TaskReorderUtility;
//# sourceMappingURL=task.reorder.util.d.ts.map
