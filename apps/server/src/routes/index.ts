import { Router } from "express";
import {
  refreshController,
  signupController,
  signinController,
  verifyController,
  submitController,
  healthController,
} from "../controllers/index.js";

const router: Router = Router();

router.route("/submitcode").post(submitController);
router.route("/refresh").get(refreshController);
router.route("/signup").post(signupController);
router.route("/signin").post(signinController);
router.route("/verify").get(verifyController);
router.route("/health").get(healthController);

export default router;
