import {
  createTicket,
  getAllTickets,
  getTicketById,
  updateTicket,
  deleteTicket,
  getTicketsByStatus,
} from "../services/ticketService.js";

export const createTicketController = async (req, res) => {
  try {
    const newTicket = await createTicket(req.body);
    res.status(201).json(newTicket);
  } catch (error) {
    res.status(500).json({ error: "Error creating ticket" });
  }
};

export const getAllTicketsController = async (req, res) => {
  try {
    const tickets = await getAllTickets();
    res.json(tickets);
  } catch (error) {
    res.status(500).json({ error: "Error fetching tickets" });
  }
};

export const getTicketByIdController = async (req, res) => {
  try {
    const ticket = await getTicketById(req.params.id);
    if (!ticket) return res.status(404).json({ error: "Ticket not found" });
    res.json(ticket);
  } catch (error) {
    res.status(500).json({ error: "Error fetching ticket" });
  }
};

export const updateTicketController = async (req, res) => {
  try {
    const updatedTicket = await updateTicket(req.params.id, req.body);
    res.json(updatedTicket);
  } catch (error) {
    res.status(500).json({ error: "Error updating ticket" });
  }
};

export const deleteTicketController = async (req, res) => {
  try {
    await deleteTicket(req.params.id);
    res.json({ message: "Ticket deleted successfully" });
  } catch (error) {
    res.status(500).json({ error: "Error deleting ticket" });
  }
};

export const getTicketsByStatusController = async (req, res) => {
  try {
    const { status } = req.query;
    if (!status) {
      return res
        .status(400)
        .json({ error: "Status query parameter is required" });
    }
    const tickets = await getTicketsByStatus(status);
    res.json(tickets);
  } catch (error) {
    res.status(500).json({ error: "Error fetching tickets by status" });
  }
};
