import dotenv from "dotenv";
import { z } from "zod";

dotenv.config();

const envSchema = z.object({
  PORT: z.coerce.number().int().positive().default(3001),
  MONGODB_URI: z.string().min(1),
  CLIENT_ORIGIN: z.string().url().default("http://localhost:5173"),
});

const parsedEnv = envSchema.parse(process.env);

const env = {
  port: parsedEnv.PORT,
  mongodbUri: parsedEnv.MONGODB_URI,
  clientOrigin: parsedEnv.CLIENT_ORIGIN,
};

export default env;
