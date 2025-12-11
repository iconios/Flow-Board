import mongoose from "mongoose";
declare const Board: mongoose.Model<
  {
    title: string;
    bg_color: string;
    user_id: mongoose.Types.ObjectId;
    lists: mongoose.Types.ObjectId[];
  },
  {},
  {},
  {},
  mongoose.Document<
    unknown,
    {},
    {
      title: string;
      bg_color: string;
      user_id: mongoose.Types.ObjectId;
      lists: mongoose.Types.ObjectId[];
    }
  > & {
    title: string;
    bg_color: string;
    user_id: mongoose.Types.ObjectId;
    lists: mongoose.Types.ObjectId[];
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
      title: string;
      bg_color: string;
      user_id: mongoose.Types.ObjectId;
      lists: mongoose.Types.ObjectId[];
    },
    mongoose.Document<
      unknown,
      {},
      mongoose.FlatRecord<{
        title: string;
        bg_color: string;
        user_id: mongoose.Types.ObjectId;
        lists: mongoose.Types.ObjectId[];
      }>
    > &
      mongoose.FlatRecord<{
        title: string;
        bg_color: string;
        user_id: mongoose.Types.ObjectId;
        lists: mongoose.Types.ObjectId[];
      }> & {
        _id: mongoose.Types.ObjectId;
      }
  >
>;
export default Board;
//# sourceMappingURL=board.model.d.ts.map
