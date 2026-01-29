import type { Context } from "hono";

export type ParseBodyResult<T> =
  | { ok: true; value: T }
  | { ok: false; error: string };

const validateJsonBody = <T>(body: unknown): ParseBodyResult<T> => {
  if (body === null || typeof body !== "object" || Array.isArray(body)) {
    return { ok: false, error: "Invalid JSON body" };
  }
  return { ok: true, value: body as T };
};

const parseJsonBody = async <T>(
  context: Context,
): Promise<ParseBodyResult<T>> => {
  try {
    const body = await context.req.json();
    return validateJsonBody<T>(body);
  } catch {
    return { ok: false, error: "Invalid JSON body" };
  }
};

export { parseJsonBody, validateJsonBody };
