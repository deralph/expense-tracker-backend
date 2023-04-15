import express from "express"
const router = express.Router();
import route from "../controller/user"

const { register, login, logout,Delete }=route

router.post("/register", register);
router.post("/login", login);
router.get("/logout", logout);
router.delete("/delete/:userId", Delete);

export default router;
