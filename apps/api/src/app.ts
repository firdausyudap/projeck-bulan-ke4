import express from "express";
import cors from "cors";
import helmet from "helmet";
import cookieParser from "cookie-parser";
import { errorHandler, notFoundHandler } from "./middleware/errorHandler";
import { env } from "./config/env";

// Routes
import authRoutes from "./routes/auth";
import articleRoutes from "./routes/articles";
import kingRoutes from "./routes/kings";
import inscriptionRoutes from "./routes/inscriptions";
import familyRelationRoutes from "./routes/familyRelations";
import categoryRoutes from "./routes/categories";
import tagRoutes from "./routes/tags";
import mediaRoutes from "./routes/media";

const app = express();

// Security middleware
app.use(helmet());
app.use(
  cors({
    origin: env.corsOrigin,
    credentials: true,
  })
);

// Body parsing
app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

// Health check
app.get("/health", (req, res) => {
  res.json({ status: "ok", timestamp: new Date().toISOString() });
});

// API routes
const apiRouter = express.Router();
apiRouter.use("/auth", authRoutes);
apiRouter.use("/articles", articleRoutes);
apiRouter.use("/kings", kingRoutes);
apiRouter.use("/inscriptions", inscriptionRoutes);
apiRouter.use("/family-relations", familyRelationRoutes);
apiRouter.use("/categories", categoryRoutes);
apiRouter.use("/tags", tagRoutes);
apiRouter.use("/media", mediaRoutes);

app.use("/api/v1", apiRouter);

// 404 handler
app.use(notFoundHandler);

// Error handler
app.use(errorHandler);

export default app;
