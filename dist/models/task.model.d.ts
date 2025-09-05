import mongoose from "mongoose";
declare const Task: mongoose.Model<
  {
    created_at: Date;
    updated_at: Date;
    priority: "high" | "low" | "medium" | "critical";
    title: string;
    comments: mongoose.Types.ObjectId[];
    activity_logs: mongoose.Types.ObjectId[];
    collaborators: mongoose.Types.ObjectId[];
    description?: string;
    position?: number;
    due_date?: Date;
    list_id?: mongoose.Types.ObjectId;
  },
  {},
  {},
  {},
  mongoose.Document<
    unknown,
    {},
    {
      created_at: Date;
      updated_at: Date;
      priority: "high" | "low" | "medium" | "critical";
      title: string;
      comments: mongoose.Types.ObjectId[];
      activity_logs: mongoose.Types.ObjectId[];
      collaborators: mongoose.Types.ObjectId[];
      description?: string;
      position?: number;
      due_date?: Date;
      list_id?: mongoose.Types.ObjectId;
    }
  > & {
    created_at: Date;
    updated_at: Date;
    priority: "high" | "low" | "medium" | "critical";
    title: string;
    comments: mongoose.Types.ObjectId[];
    activity_logs: mongoose.Types.ObjectId[];
    collaborators: mongoose.Types.ObjectId[];
    description?: string;
    position?: number;
    due_date?: Date;
    list_id?: mongoose.Types.ObjectId;
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
    mongoose.DefaultSchemaOptions,
    {
      created_at: Date;
      updated_at: Date;
      priority: "high" | "low" | "medium" | "critical";
      title: string;
      comments: mongoose.Types.ObjectId[];
      activity_logs: mongoose.Types.ObjectId[];
      collaborators: mongoose.Types.ObjectId[];
      description?: string;
      position?: number;
      due_date?: Date;
      list_id?: mongoose.Types.ObjectId;
    },
    mongoose.Document<
      unknown,
      {},
      mongoose.FlatRecord<{
        created_at: Date;
        updated_at: Date;
        priority: "high" | "low" | "medium" | "critical";
        title: string;
        comments: mongoose.Types.ObjectId[];
        activity_logs: mongoose.Types.ObjectId[];
        collaborators: mongoose.Types.ObjectId[];
        description?: string;
        position?: number;
        due_date?: Date;
        list_id?: mongoose.Types.ObjectId;
      }>
    > &
      mongoose.FlatRecord<{
        created_at: Date;
        updated_at: Date;
        priority: "high" | "low" | "medium" | "critical";
        title: string;
        comments: mongoose.Types.ObjectId[];
        activity_logs: mongoose.Types.ObjectId[];
        collaborators: mongoose.Types.ObjectId[];
        description?: string;
        position?: number;
        due_date?: Date;
        list_id?: mongoose.Types.ObjectId;
      }> & {
        _id: mongoose.Types.ObjectId;
      }
  >
>;
export default Task;
//# sourceMappingURL=task.model.d.ts.map
