import mongoose from "mongoose";
declare const Task: mongoose.Model<
  {
    priority: "high" | "low" | "medium" | "critical";
    title: string;
    listId?: mongoose.Types.ObjectId;
    position?: number;
    description?: string;
    dueDate?: Date;
  },
  {},
  {},
  {},
  mongoose.Document<
    unknown,
    {},
    {
      priority: "high" | "low" | "medium" | "critical";
      title: string;
      listId?: mongoose.Types.ObjectId;
      position?: number;
      description?: string;
      dueDate?: Date;
    }
  > & {
    priority: "high" | "low" | "medium" | "critical";
    title: string;
    listId?: mongoose.Types.ObjectId;
    position?: number;
    description?: string;
    dueDate?: Date;
  } & {
    _id: mongoose.Types.ObjectId;
  },
  mongoose.Schema<
    any,
    mongoose.Model<any, any, any, any, any, any>,
    {},
    {},
    {},
    {},
    {
      timestamps: {
        createdAt: string;
        updatedAt: string;
      };
    },
    {
      priority: "high" | "low" | "medium" | "critical";
      title: string;
      listId?: mongoose.Types.ObjectId;
      position?: number;
      description?: string;
      dueDate?: Date;
    },
    mongoose.Document<
      unknown,
      {},
      mongoose.FlatRecord<{
        priority: "high" | "low" | "medium" | "critical";
        title: string;
        listId?: mongoose.Types.ObjectId;
        position?: number;
        description?: string;
        dueDate?: Date;
      }>
    > &
      mongoose.FlatRecord<{
        priority: "high" | "low" | "medium" | "critical";
        title: string;
        listId?: mongoose.Types.ObjectId;
        position?: number;
        description?: string;
        dueDate?: Date;
      }> & {
        _id: mongoose.Types.ObjectId;
      }
  >
>;
export default Task;
//# sourceMappingURL=task.model.d.ts.map
