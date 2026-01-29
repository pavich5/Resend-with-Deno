import { app } from "./src/server.ts";
import { PORT } from "./src/config/env.ts";

Deno.serve({ port: PORT }, app.fetch);
