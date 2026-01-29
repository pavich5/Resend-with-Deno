import { Hono } from "hono";
import { cors } from "hono/cors";
import { emailRoutes } from "./routes/email_routes.ts";

const app = new Hono();

app.use("*", cors());
app.get("/", (context) => context.json({ status: "ok" }));
app.route("/api", emailRoutes);

export { app };
