import { Hono } from "hono";
import {
  cancelEmailHandler,
  listEmailsHandler,
  retrieveEmailHandler,
  rescheduleEmailHandler,
  sendEmailHandler,
} from "../controllers/email_controller.ts";

const emailRoutes = new Hono();
const emails = new Hono();

emails.post("/send", sendEmailHandler);
emails.get("/", listEmailsHandler);
emails.get("/:id", retrieveEmailHandler);
emails.post("/:id/cancel", cancelEmailHandler);
emails.patch("/:id", rescheduleEmailHandler);

emailRoutes.route("/emails", emails);

export { emailRoutes };
