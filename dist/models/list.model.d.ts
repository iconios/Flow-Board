import mongoose from "mongoose";
declare const List: mongoose.Model<
  {
    title: string;
    boardId: mongoose.Types.ObjectId;
    userId: mongoose.Types.ObjectId;
    position: number;
    tasks: mongoose.Types.ObjectId[];
    status: "active" | "archive";
  },
  {},
  {},
  {},
  mongoose.Document<
    unknown,
    {},
    {
      title: string;
      boardId: mongoose.Types.ObjectId;
      userId: mongoose.Types.ObjectId;
      position: number;
      tasks: mongoose.Types.ObjectId[];
      status: "active" | "archive";
    }
  > & {
    title: string;
    boardId: mongoose.Types.ObjectId;
    userId: mongoose.Types.ObjectId;
    position: number;
    tasks: mongoose.Types.ObjectId[];
    status: "active" | "archive";
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
      boardId: mongoose.Types.ObjectId;
      userId: mongoose.Types.ObjectId;
      position: number;
      tasks: mongoose.Types.ObjectId[];
      status: "active" | "archive";
    },
    mongoose.Document<
      unknown,
      {},
      mongoose.FlatRecord<{
        title: string;
        boardId: mongoose.Types.ObjectId;
        userId: mongoose.Types.ObjectId;
        position: number;
        tasks: mongoose.Types.ObjectId[];
        status: "active" | "archive";
      }>
    > &
      mongoose.FlatRecord<{
        title: string;
        boardId: mongoose.Types.ObjectId;
        userId: mongoose.Types.ObjectId;
        position: number;
        tasks: mongoose.Types.ObjectId[];
        status: "active" | "archive";
      }> & {
        _id: mongoose.Types.ObjectId;
      }
  >
>;
export default List;
//# sourceMappingURL=list.model.d.ts.map
