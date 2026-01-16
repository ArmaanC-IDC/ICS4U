import { Router } from "express";
import { getAll, getOne, create, update, remove, getByFilter } from "../controllers/users.controller.js";

const router = Router();

// router.get("/", getAll);
router.get("/:userId", getOne);
router.post("/", create);
router.put("/:userId", update);
router.delete("/:userId", remove);
router.get("/", getByFilter)

export default router;
