import { createClient } from "redis";
import dotenv from "dotenv";

dotenv.config();

const client = createClient({
  username: process.env.REDIS_USERNAME || "default",
  password: process.env.REDIS_PASSWORD!,
  socket: {
    host: process.env.REDIS_HOST!,
    port: Number(process.env.REDIS_PORT!), // TLS port (12991)
    tls: true,
  },
});

client.on("error", (err) => {
  console.error("Redis Client Error", err);
});

(async () => {
  await client.connect();
  await client.set("ping", "pong");
  const value = await client.get("ping");
  console.log("Redis test value:", value);
  await client.disconnect();
})();
