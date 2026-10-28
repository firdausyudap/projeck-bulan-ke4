import app from "./app";
import { env } from "./config/env";

const PORT = env.port;

app.listen(PORT, () => {
  console.log(`🚀 API server running on http://localhost:${PORT}`);
  console.log(`📊 Environment: ${env.nodeEnv}`);
});
