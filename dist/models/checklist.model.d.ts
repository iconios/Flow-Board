import mongoose from "mongoose";
declare const Checklist: mongoose.Model<{
    createdAt: Date;
    updatedAt: Date;
    taskId: mongoose.Types.ObjectId;
    userId: mongoose.Types.ObjectId;
    boardId: mongoose.Types.ObjectId;
    content: string;
    checked: boolean;
}, {}, {}, {}, mongoose.Document<unknown, {}, {
    createdAt: Date;
    updatedAt: Date;
    taskId: mongoose.Types.ObjectId;
    userId: mongoose.Types.ObjectId;
    boardId: mongoose.Types.ObjectId;
    content: string;
    checked: boolean;
}> & {
    createdAt: Date;
    updatedAt: Date;
    taskId: mongoose.Types.ObjectId;
    userId: mongoose.Types.ObjectId;
    boardId: mongoose.Types.ObjectId;
    content: string;
    checked: boolean;
} & {
    _id: mongoose.Types.ObjectId;
}, mongoose.Schema<any, mongoose.Model<any, any, any, any, any, any>, {}, {}, {}, {}, mongoose.DefaultSchemaOptions, {
    createdAt: Date;
    updatedAt: Date;
    taskId: mongoose.Types.ObjectId;
    userId: mongoose.Types.ObjectId;
    boardId: mongoose.Types.ObjectId;
    content: string;
    checked: boolean;
}, mongoose.Document<unknown, {}, mongoose.FlatRecord<{
    createdAt: Date;
    updatedAt: Date;
    taskId: mongoose.Types.ObjectId;
    userId: mongoose.Types.ObjectId;
    boardId: mongoose.Types.ObjectId;
    content: string;
    checked: boolean;
}>> & mongoose.FlatRecord<{
    createdAt: Date;
    updatedAt: Date;
    taskId: mongoose.Types.ObjectId;
    userId: mongoose.Types.ObjectId;
    boardId: mongoose.Types.ObjectId;
    content: string;
    checked: boolean;
}> & {
    _id: mongoose.Types.ObjectId;
}>>;
export default Checklist;
//# sourceMappingURL=checklist.model.d.ts.map