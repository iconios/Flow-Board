import * as dotenv from "dotenv";
dotenv.config();

const username = process.env.REDIS_USERNAME;;
const password = encodeURIComponent(process.env.REDIS_PASSWORD!);

export const redisConnectionOptions = 
  process.env.NODE_ENV === "production" ? {
  url: `rediss://${username}:${password}@${process.env.REDIS_HOST!}:${process.env.REDIS_PORT!}`,
  } : {
  host: "127.0.0.1",
  port: 6379
};
