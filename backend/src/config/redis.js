import { createClient } from "redis";

export const client = createClient({
    username: process.env.REDIS_USERNAME,
    password: process.env.REDIS_PASSWORD,
    socket: {
        host: process.env.REDIS_HOST,
        port: process.env.REDIS_PORT
    }
});

export const connectRedisServer = async () => {
  try {
    await client.connect();
    console.log("Redis Server Connected successfully");
  } catch (error) {
    throw new Error(`Redis Server Error: ${error}`)
  }
};
