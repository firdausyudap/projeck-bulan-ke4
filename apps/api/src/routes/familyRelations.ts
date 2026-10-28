import { Router } from "express";
import * as familyRelationController from "../controllers/familyRelationController";
import { validate } from "../middleware/validate";
import { familyRelationSchema } from "../validators/otherValidators";
import { authenticate, requireAdmin } from "../middleware/auth";

const router = Router();

router.get("/", familyRelationController.listFamilyRelations);
router.post("/", authenticate, requireAdmin, validate(familyRelationSchema), familyRelationController.createFamilyRelation);
router.patch("/:id", authenticate, requireAdmin, validate(familyRelationSchema.partial()), familyRelationController.updateFamilyRelation);
router.delete("/:id", authenticate, requireAdmin, familyRelationController.deleteFamilyRelation);

export default router;
