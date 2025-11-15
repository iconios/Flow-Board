import { Types } from "mongoose";
declare const ReadTaskService: (
  user: string,
  list: string,
) => Promise<
  | {
      success: boolean;
      message: string;
      tasks?: never;
    }
  | {
      success: boolean;
      message: string;
      tasks: {
        id: string;
        title: string;
        description: string;
        priority: "high" | "low" | "medium" | "critical";
        position: number;
        dueDate: string | Date;
        listId: Types.ObjectId | undefined;
      }[];
    }
>;
export default ReadTaskService;
//# sourceMappingURL=read.task.service.d.ts.map
