import express from express;
import { editeProfile } from "../controllers/user.controller.js";

const router = express.Router();

router.post("/:id", editeProfile);

export default router;
