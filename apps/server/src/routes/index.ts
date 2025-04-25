import { Router } from "express";
import {
  signupController,
  signinController,
  verifyController,
  refreshController,
  submitController,
} from "../controllers/index.js";

const router: Router = Router();

router.route("/signup").post(signupController);
router.route("/signin").post(signinController);
router.route("/verify").get(verifyController);
router.route("/refresh").get(refreshController);
router.route("/submitcode").post(submitController);

export default router;
