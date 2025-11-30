import mongoose from "mongoose";
declare const Task: mongoose.Model<{
    title: string;
    priority: "low" | "medium" | "high" | "critical";
    listId?: mongoose.Types.ObjectId;
    position?: number;
    description?: string;
    dueDate?: Date;
}, {}, {}, {}, mongoose.Document<unknown, {}, {
    title: string;
    priority: "low" | "medium" | "high" | "critical";
    listId?: mongoose.Types.ObjectId;
    position?: number;
    description?: string;
    dueDate?: Date;
}> & {
    title: string;
    priority: "low" | "medium" | "high" | "critical";
    listId?: mongoose.Types.ObjectId;
    position?: number;
    description?: string;
    dueDate?: Date;
} & {
    _id: mongoose.Types.ObjectId;
}, mongoose.Schema<any, mongoose.Model<any, any, any, any, any, any>, {}, {}, {}, {}, {
    timestamps: {
        createdAt: string;
        updatedAt: string;
    };
}, {
    title: string;
    priority: "low" | "medium" | "high" | "critical";
    listId?: mongoose.Types.ObjectId;
    position?: number;
    description?: string;
    dueDate?: Date;
}, mongoose.Document<unknown, {}, mongoose.FlatRecord<{
    title: string;
    priority: "low" | "medium" | "high" | "critical";
    listId?: mongoose.Types.ObjectId;
    position?: number;
    description?: string;
    dueDate?: Date;
}>> & mongoose.FlatRecord<{
    title: string;
    priority: "low" | "medium" | "high" | "critical";
    listId?: mongoose.Types.ObjectId;
    position?: number;
    description?: string;
    dueDate?: Date;
}> & {
    _id: mongoose.Types.ObjectId;
}>>;
export default Task;
//# sourceMappingURL=task.model.d.ts.map