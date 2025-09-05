import mongoose from "mongoose";
declare const Board: mongoose.Model<
  {
    created_at: Date;
    lists: mongoose.Types.ObjectId[];
    updated_at?: Date;
    user_id?: mongoose.Types.ObjectId;
    title?: string;
    bg_color?: string;
  },
  {},
  {},
  {},
  mongoose.Document<
    unknown,
    {},
    {
      created_at: Date;
      lists: mongoose.Types.ObjectId[];
      updated_at?: Date;
      user_id?: mongoose.Types.ObjectId;
      title?: string;
      bg_color?: string;
    }
  > & {
    created_at: Date;
    lists: mongoose.Types.ObjectId[];
    updated_at?: Date;
    user_id?: mongoose.Types.ObjectId;
    title?: string;
    bg_color?: string;
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
      lists: mongoose.Types.ObjectId[];
      updated_at?: Date;
      user_id?: mongoose.Types.ObjectId;
      title?: string;
      bg_color?: string;
    },
    mongoose.Document<
      unknown,
      {},
      mongoose.FlatRecord<{
        created_at: Date;
        lists: mongoose.Types.ObjectId[];
        updated_at?: Date;
        user_id?: mongoose.Types.ObjectId;
        title?: string;
        bg_color?: string;
      }>
    > &
      mongoose.FlatRecord<{
        created_at: Date;
        lists: mongoose.Types.ObjectId[];
        updated_at?: Date;
        user_id?: mongoose.Types.ObjectId;
        title?: string;
        bg_color?: string;
      }> & {
        _id: mongoose.Types.ObjectId;
      }
  >
>;
export default Board;
//# sourceMappingURL=board.model.d.ts.map
