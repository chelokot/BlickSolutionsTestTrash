import app from "./app";
import env from "./config/env";
import { connectDatabase } from "./db/connect";

async function startServer(): Promise<void> {
  await connectDatabase();
  app.listen(env.port, () => {
    console.log(`Server running on port ${env.port}`);
  });
}

startServer().catch((err) => {
  console.error(err);
  process.exit(1);
});
