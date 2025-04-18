import { Router } from "express";
import { signupController, signinController } from "../controllers/index.js";

const router: Router = Router();

router.route("/signup").post(signupController);
router.route("/signin").post(signinController);

export default router;
