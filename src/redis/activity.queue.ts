import { Queue } from "bullmq";
import {redisConnectionOptions} from "./redis.connection.js";

export const activityQueue = new Queue("activityQueue", {
  connection: redisConnectionOptions,
});
