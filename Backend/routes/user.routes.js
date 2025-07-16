import { deleteUserById } from "../models/user.model.js";
import express from express;
import { editeProfile } from "../controllers/user.controller.js";

const router = express.Router();

router.get("/:id", getUserById);
router.post("/:id", editeProfile);
router.post("/:id", deleteUserById);
export default router;
