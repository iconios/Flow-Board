import mongoose from "mongoose";
declare const Comment: mongoose.Model<
  {
    createdAt: Date;
    updatedAt: Date;
    taskId: mongoose.Types.ObjectId;
    userId: mongoose.Types.ObjectId;
    content: string;
  },
  {},
  {},
  {},
  mongoose.Document<
    unknown,
    {},
    {
      createdAt: Date;
      updatedAt: Date;
      taskId: mongoose.Types.ObjectId;
      userId: mongoose.Types.ObjectId;
      content: string;
    }
  > & {
    createdAt: Date;
    updatedAt: Date;
    taskId: mongoose.Types.ObjectId;
    userId: mongoose.Types.ObjectId;
    content: string;
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
      createdAt: Date;
      updatedAt: Date;
      taskId: mongoose.Types.ObjectId;
      userId: mongoose.Types.ObjectId;
      content: string;
    },
    mongoose.Document<
      unknown,
      {},
      mongoose.FlatRecord<{
        createdAt: Date;
        updatedAt: Date;
        taskId: mongoose.Types.ObjectId;
        userId: mongoose.Types.ObjectId;
        content: string;
      }>
    > &
      mongoose.FlatRecord<{
        createdAt: Date;
        updatedAt: Date;
        taskId: mongoose.Types.ObjectId;
        userId: mongoose.Types.ObjectId;
        content: string;
      }> & {
        _id: mongoose.Types.ObjectId;
      }
  >
>;
export default Comment;
//# sourceMappingURL=comment.model.d.ts.map
