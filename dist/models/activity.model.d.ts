import mongoose from "mongoose";
declare const Activity: mongoose.Model<{
    object: "List" | "Board" | "Task" | "Comment" | "Checklist";
    createdAt: globalThis.Date;
    userId: mongoose.Types.ObjectId;
    activityType: "move" | "edit" | "create" | "delete";
    objectId: mongoose.Types.ObjectId;
}, {}, {}, {}, mongoose.Document<unknown, {}, {
    object: "List" | "Board" | "Task" | "Comment" | "Checklist";
    createdAt: globalThis.Date;
    userId: mongoose.Types.ObjectId;
    activityType: "move" | "edit" | "create" | "delete";
    objectId: mongoose.Types.ObjectId;
}> & {
    object: "List" | "Board" | "Task" | "Comment" | "Checklist";
    createdAt: globalThis.Date;
    userId: mongoose.Types.ObjectId;
    activityType: "move" | "edit" | "create" | "delete";
    objectId: mongoose.Types.ObjectId;
} & {
    _id: mongoose.Types.ObjectId;
}, mongoose.Schema<any, mongoose.Model<any, any, any, any, any, any>, {}, {}, {}, {}, mongoose.DefaultSchemaOptions, {
    object: "List" | "Board" | "Task" | "Comment" | "Checklist";
    createdAt: globalThis.Date;
    userId: mongoose.Types.ObjectId;
    activityType: "move" | "edit" | "create" | "delete";
    objectId: mongoose.Types.ObjectId;
}, mongoose.Document<unknown, {}, mongoose.FlatRecord<{
    object: "List" | "Board" | "Task" | "Comment" | "Checklist";
    createdAt: globalThis.Date;
    userId: mongoose.Types.ObjectId;
    activityType: "move" | "edit" | "create" | "delete";
    objectId: mongoose.Types.ObjectId;
}>> & mongoose.FlatRecord<{
    object: "List" | "Board" | "Task" | "Comment" | "Checklist";
    createdAt: globalThis.Date;
    userId: mongoose.Types.ObjectId;
    activityType: "move" | "edit" | "create" | "delete";
    objectId: mongoose.Types.ObjectId;
}> & {
    _id: mongoose.Types.ObjectId;
}>>;
export default Activity;
//# sourceMappingURL=activity.model.d.ts.map