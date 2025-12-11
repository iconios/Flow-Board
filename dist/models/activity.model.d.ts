import mongoose from "mongoose";
declare const Activity: mongoose.Model<
  {
    object: "Board" | "Task";
    createdAt: globalThis.Date;
    userId: mongoose.Types.ObjectId;
    activityType: "delete" | "move" | "edit" | "create";
    objectId: mongoose.Types.ObjectId;
  },
  {},
  {},
  {},
  mongoose.Document<
    unknown,
    {},
    {
      object: "Board" | "Task";
      createdAt: globalThis.Date;
      userId: mongoose.Types.ObjectId;
      activityType: "delete" | "move" | "edit" | "create";
      objectId: mongoose.Types.ObjectId;
    }
  > & {
    object: "Board" | "Task";
    createdAt: globalThis.Date;
    userId: mongoose.Types.ObjectId;
    activityType: "delete" | "move" | "edit" | "create";
    objectId: mongoose.Types.ObjectId;
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
      object: "Board" | "Task";
      createdAt: globalThis.Date;
      userId: mongoose.Types.ObjectId;
      activityType: "delete" | "move" | "edit" | "create";
      objectId: mongoose.Types.ObjectId;
    },
    mongoose.Document<
      unknown,
      {},
      mongoose.FlatRecord<{
        object: "Board" | "Task";
        createdAt: globalThis.Date;
        userId: mongoose.Types.ObjectId;
        activityType: "delete" | "move" | "edit" | "create";
        objectId: mongoose.Types.ObjectId;
      }>
    > &
      mongoose.FlatRecord<{
        object: "Board" | "Task";
        createdAt: globalThis.Date;
        userId: mongoose.Types.ObjectId;
        activityType: "delete" | "move" | "edit" | "create";
        objectId: mongoose.Types.ObjectId;
      }> & {
        _id: mongoose.Types.ObjectId;
      }
  >
>;
export default Activity;
//# sourceMappingURL=activity.model.d.ts.map
