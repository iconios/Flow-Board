import mongoose from "mongoose";
declare const Comment: mongoose.Model<
  {
    created_at: Date;
    updated_at: Date;
    user_id: mongoose.Types.ObjectId;
    content: string;
    task_id?: mongoose.Types.ObjectId;
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
      user_id: mongoose.Types.ObjectId;
      content: string;
      task_id?: mongoose.Types.ObjectId;
    }
  > & {
    created_at: Date;
    updated_at: Date;
    user_id: mongoose.Types.ObjectId;
    content: string;
    task_id?: mongoose.Types.ObjectId;
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
      user_id: mongoose.Types.ObjectId;
      content: string;
      task_id?: mongoose.Types.ObjectId;
    },
    mongoose.Document<
      unknown,
      {},
      mongoose.FlatRecord<{
        created_at: Date;
        updated_at: Date;
        user_id: mongoose.Types.ObjectId;
        content: string;
        task_id?: mongoose.Types.ObjectId;
      }>
    > &
      mongoose.FlatRecord<{
        created_at: Date;
        updated_at: Date;
        user_id: mongoose.Types.ObjectId;
        content: string;
        task_id?: mongoose.Types.ObjectId;
      }> & {
        _id: mongoose.Types.ObjectId;
      }
  >
>;
export default Comment;
//# sourceMappingURL=comment.model.d.ts.map
