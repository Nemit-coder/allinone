import { Router } from "express";
import verifyJwt from "../middlewares/auth.middleware.ts";
import {
  getOrCreateConversation,
  getMyConversations,
  getMessages,
} from "../controllers/chat.controller.ts";

const chatRouter = Router();

chatRouter.post("/conversation", verifyJwt, getOrCreateConversation);
chatRouter.get("/conversations", verifyJwt, getMyConversations);
chatRouter.get("/messages/:conversationId", verifyJwt, getMessages);

export default chatRouter;