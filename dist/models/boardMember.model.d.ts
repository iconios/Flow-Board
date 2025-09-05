import mongoose from "mongoose";
declare const Board_Member: mongoose.Model<
  {
    created_at: Date;
    role: "admin" | "member";
    user_id?: mongoose.Types.ObjectId;
    board_id?: mongoose.Types.ObjectId;
  },
  {},
  {},
  {},
  mongoose.Document<
    unknown,
    {},
    {
      created_at: Date;
      role: "admin" | "member";
      user_id?: mongoose.Types.ObjectId;
      board_id?: mongoose.Types.ObjectId;
    }
  > & {
    created_at: Date;
    role: "admin" | "member";
    user_id?: mongoose.Types.ObjectId;
    board_id?: mongoose.Types.ObjectId;
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
      role: "admin" | "member";
      user_id?: mongoose.Types.ObjectId;
      board_id?: mongoose.Types.ObjectId;
    },
    mongoose.Document<
      unknown,
      {},
      mongoose.FlatRecord<{
        created_at: Date;
        role: "admin" | "member";
        user_id?: mongoose.Types.ObjectId;
        board_id?: mongoose.Types.ObjectId;
      }>
    > &
      mongoose.FlatRecord<{
        created_at: Date;
        role: "admin" | "member";
        user_id?: mongoose.Types.ObjectId;
        board_id?: mongoose.Types.ObjectId;
      }> & {
        _id: mongoose.Types.ObjectId;
      }
  >
>;
export default Board_Member;
//# sourceMappingURL=boardMember.model.d.ts.map
