import express from "express"
const router = express.Router();
import route from "../controller/user"

const { register, login, logout }=route

router.post("/register", register);
router.post("/login", login);
router.get("/logout", logout);

export default router;
