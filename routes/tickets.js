import express from "express";
import db from "../databases/db.js";
import { varifyToken } from "../middleware/auth.js";
import { createTicket, getTicket } from "../controllers/tickets.js";
import { ROUTE_CONSTS } from "../constants.js";

const router = express.Router();

router.post(
  ROUTE_CONSTS.ROUTES.TICKET.CREATE_TICKETS,
  varifyToken,
  createTicket
);

router.get(ROUTE_CONSTS.ROUTES.TICKET.GET_TICKET, varifyToken, getTicket);

export default router;
