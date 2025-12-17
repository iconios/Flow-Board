import { Worker } from "bullmq";
import { redisConnectionOptions } from "./redis.connection.js";
import type { CreateActivityInputType } from "../types/activity.type.js";
import CreateActivityService from "../services/activity/create.activity.service.js";

export const activityWorker = new Worker(
  "activityQueue",
  async (job) => {
    const { userId, ...activityData } = job.data;
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
