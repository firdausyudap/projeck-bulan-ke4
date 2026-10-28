import { Router } from "express";
import * as articleController from "../controllers/articleController";
import { validate } from "../middleware/validate";
import { articleSchema, articleQuerySchema } from "../validators/articleValidators";
import { authenticate, requireAdmin, optionalAuth } from "../middleware/auth";

const router = Router();

router.get("/", optionalAuth, validate(articleQuerySchema, "query"), articleController.listArticles);
router.get("/:id", optionalAuth, articleController.getArticle);
router.post("/", authenticate, requireAdmin, validate(articleSchema), articleController.createArticle);
router.patch("/:id", authenticate, requireAdmin, validate(articleSchema.partial()), articleController.updateArticle);
router.delete("/:id", authenticate, requireAdmin, articleController.deleteArticle);

export default router;
