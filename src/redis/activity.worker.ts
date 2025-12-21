import { Worker } from "bullmq";
import { redisConnectionOptions } from "./redis.connection.js";
import type { CreateActivityInputType } from "../types/activity.type.js";
import CreateActivityService from "../services/activity/create.activity.service.js";
import dbConnect from "../dbConnection.js";

console.log("Activity worker process started");

await dbConnect().catch((err) => {
  console.error("Failed to connect to DB in activity worker:", err);
  process.exit(1);
});

export const activityWorker = new Worker(
  "activityQueue",
  async (job) => {
    const { userId, ...activityData } = job.data;
    console.log(
      `Processing activity job for user: ${userId}, activity type: ${activityData.activityType}`,
    );
    return await CreateActivityService(
      userId,
      activityData as CreateActivityInputType,
    );
  },
  {
    connection: redisConnectionOptions,
    concurrency: 5,
  },
);

activityWorker.on("completed", (job) => {
  console.log(`Activity job with ID ${job.id} has been completed.`);
});

activityWorker.on("failed", (job, err) => {
  console.error(
    `Activity job with ID ${job?.id} has failed. Error: ${err.message}`,
  );
});

activityWorker.on("error", (err) => {
  console.error("Worker fatal error:", err);
});
