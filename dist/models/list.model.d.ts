import mongoose from "mongoose";
declare const List: mongoose.Model<{
    title: string;
    userId: mongoose.Types.ObjectId;
    position: number;
    tasks: mongoose.Types.ObjectId[];
    status: "active" | "archive";
    boardId: mongoose.Types.ObjectId;
}, {}, {}, {}, mongoose.Document<unknown, {}, {
    title: string;
    userId: mongoose.Types.ObjectId;
    position: number;
    tasks: mongoose.Types.ObjectId[];
    status: "active" | "archive";
    boardId: mongoose.Types.ObjectId;
}> & {
    title: string;
    userId: mongoose.Types.ObjectId;
    position: number;
    tasks: mongoose.Types.ObjectId[];
    status: "active" | "archive";
    boardId: mongoose.Types.ObjectId;
} & {
    _id: mongoose.Types.ObjectId;
}, mongoose.Schema<any, mongoose.Model<any, any, any, any, any, any>, {}, {}, {}, {}, {
    timestamps: {
        createdAt: string;
        updatedAt: string;
    };
}, {
    title: string;
    userId: mongoose.Types.ObjectId;
    position: number;
    tasks: mongoose.Types.ObjectId[];
    status: "active" | "archive";
    boardId: mongoose.Types.ObjectId;
}, mongoose.Document<unknown, {}, mongoose.FlatRecord<{
    title: string;
    userId: mongoose.Types.ObjectId;
    position: number;
    tasks: mongoose.Types.ObjectId[];
    status: "active" | "archive";
    boardId: mongoose.Types.ObjectId;
}>> & mongoose.FlatRecord<{
    title: string;
    userId: mongoose.Types.ObjectId;
    position: number;
    tasks: mongoose.Types.ObjectId[];
    status: "active" | "archive";
    boardId: mongoose.Types.ObjectId;
}> & {
    _id: mongoose.Types.ObjectId;
}>>;
export default List;
//# sourceMappingURL=list.model.d.ts.map