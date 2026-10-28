import { Router } from "express";
import * as inscriptionController from "../controllers/inscriptionController";
import { validate } from "../middleware/validate";
import { inscriptionSchema, inscriptionQuerySchema } from "../validators/inscriptionValidators";
import { authenticate, requireAdmin, optionalAuth } from "../middleware/auth";

const router = Router();

router.get("/", optionalAuth, validate(inscriptionQuerySchema, "query"), inscriptionController.listInscriptions);
router.get("/:id", optionalAuth, inscriptionController.getInscription);
router.post("/", authenticate, requireAdmin, validate(inscriptionSchema), inscriptionController.createInscription);
router.patch("/:id", authenticate, requireAdmin, validate(inscriptionSchema.partial()), inscriptionController.updateInscription);
router.delete("/:id", authenticate, requireAdmin, inscriptionController.deleteInscription);

export default router;
