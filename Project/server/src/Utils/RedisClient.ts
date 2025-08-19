import Redis from "ioredis";
import config from "../config/dotenv.ts";

const HOST = config.REDIS_HOST;
const PORT = config.REDIS_PORT || 6379;


const redisClient = new Redis({
       port : PORT,
        host : HOST
    });

    redisClient.on("connect", () => {
          console.log("🔌 Connected to Redis");
    });

    redisClient.on("error", (err) => {
  console.error("Redis Error:", err);
});

export default redisClient;