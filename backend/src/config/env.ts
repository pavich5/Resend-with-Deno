const RESEND_API_KEY = Deno.env.get("RESEND_API_KEY") ?? "";
if (!RESEND_API_KEY) {
  throw new Error("RESEND_API_KEY is not set");
}

const PORT_RAW = Deno.env.get("PORT") ?? "8000";
const PORT = Number(PORT_RAW);
if (!Number.isFinite(PORT) || PORT <= 0) {
  throw new Error("PORT must be a positive number");
}

export { PORT, RESEND_API_KEY };
