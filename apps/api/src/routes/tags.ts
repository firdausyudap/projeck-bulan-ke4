import { Router } from "express";
import * as tagController from "../controllers/tagController";
import { validate } from "../middleware/validate";
import { tagSchema } from "../validators/otherValidators";
import { authenticate, requireAdmin } from "../middleware/auth";

const router = Router();

router.get("/", tagController.listTags);
router.post("/", authenticate, requireAdmin, validate(tagSchema), tagController.createTag);
router.delete("/:id", authenticate, requireAdmin, tagController.deleteTag);

export default router;
