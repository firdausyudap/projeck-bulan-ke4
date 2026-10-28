import { Router } from "express";
import * as categoryController from "../controllers/categoryController";
import { validate } from "../middleware/validate";
import { categorySchema } from "../validators/otherValidators";
import { authenticate, requireAdmin } from "../middleware/auth";

const router = Router();

router.get("/", categoryController.listCategories);
router.get("/:id", categoryController.getCategory);
router.post("/", authenticate, requireAdmin, validate(categorySchema), categoryController.createCategory);
router.patch("/:id", authenticate, requireAdmin, validate(categorySchema.partial()), categoryController.updateCategory);
router.delete("/:id", authenticate, requireAdmin, categoryController.deleteCategory);

export default router;
