import { Router } from "express";
import * as mediaController from "../controllers/mediaController";
import { validate } from "../middleware/validate";
import { mediaSchema, mediaQuerySchema } from "../validators/otherValidators";
import { authenticate, requireAdmin, optionalAuth } from "../middleware/auth";

const router = Router();

router.get("/", optionalAuth, validate(mediaQuerySchema, "query"), mediaController.listMedia);
router.get("/:id", optionalAuth, mediaController.getMedia);
router.post("/", authenticate, requireAdmin, validate(mediaSchema), mediaController.createMedia);
router.patch("/:id", authenticate, requireAdmin, validate(mediaSchema.partial()), mediaController.updateMedia);
router.delete("/:id", authenticate, requireAdmin, mediaController.deleteMedia);

export default router;
