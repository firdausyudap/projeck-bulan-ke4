import { Router } from "express";
import * as kingController from "../controllers/kingController";
import { validate } from "../middleware/validate";
import { kingSchema, kingQuerySchema } from "../validators/kingValidators";
import { authenticate, requireAdmin, optionalAuth } from "../middleware/auth";

const router = Router();

router.get("/", optionalAuth, validate(kingQuerySchema, "query"), kingController.listKings);
router.get("/:id", optionalAuth, kingController.getKing);
router.post("/", authenticate, requireAdmin, validate(kingSchema), kingController.createKing);
router.patch("/:id", authenticate, requireAdmin, validate(kingSchema.partial()), kingController.updateKing);
router.delete("/:id", authenticate, requireAdmin, kingController.deleteKing);

export default router;
