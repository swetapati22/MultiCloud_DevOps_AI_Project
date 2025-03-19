import express from "express";
import {
  createTicketController,
  getAllTicketsController,
  getTicketByIdController,
  updateTicketController,
  deleteTicketController,
  getTicketsByStatusController,
} from "../controllers/ticketController.js";

const router = express.Router();

router.post("/", createTicketController);
router.get("/", getAllTicketsController);
router.get("/status", getTicketsByStatusController);
router.get("/:id", getTicketByIdController);
router.put("/:id", updateTicketController);
router.delete("/:id", deleteTicketController);

export default router;
