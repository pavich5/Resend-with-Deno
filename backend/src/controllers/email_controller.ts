import type { Context } from "hono";
import {
  cancelEmail,
  listEmails,
  retrieveEmail,
  rescheduleEmail,
  sendEmail,
  type SendEmailRequestBody,
} from "../services/email_service.ts";
import { parseJsonBody } from "../utils/request.ts";
import {
  validateEmailId,
  validateListEmailsQuery,
  validateRescheduleEmailRequest,
  validateSendEmailRequest,
} from "../utils/validation.ts";

export async function sendEmailHandler(context: Context) {
  const parsedBody = await parseJsonBody<SendEmailRequestBody>(context);
  if (!parsedBody.ok) {
    return context.json({ error: parsedBody.error }, 400);
  }

  const payload = parsedBody.value;
  const validationResult = validateSendEmailRequest(payload);

  if (!validationResult.ok) {
    return context.json({ errors: validationResult.errors }, 400);
  }

  const sendResult = await sendEmail(payload);

  if (!sendResult.ok) {
    return context.json({ error: sendResult.error }, 502);
  }

  return context.json({ id: sendResult.id }, 200);
}

export async function retrieveEmailHandler(context: Context) {
  const id = context.req.param("id");
  const validationResult = validateEmailId(id);
  if (!validationResult.ok) {
    return context.json({ errors: validationResult.errors }, 400);
  }

  const retrieveResult = await retrieveEmail(id);
  if (!retrieveResult.ok) {
    return context.json({ error: retrieveResult.error }, 502);
  }

  return context.json(retrieveResult.email, 200);
}

export async function listEmailsHandler(context: Context) {
  const query = {
    limit: context.req.query("limit"),
    skip: context.req.query("skip"),
    take: context.req.query("take"),
  };

  const validationResult = validateListEmailsQuery(query);
  if (!validationResult.ok) {
    return context.json({ errors: validationResult.errors }, 400);
  }

  const listResult = await listEmails(validationResult.value);
  if (!listResult.ok) {
    return context.json({ error: listResult.error }, 502);
  }

  return context.json(listResult.emails, 200);
}

export async function cancelEmailHandler(context: Context) {
  const id = context.req.param("id");
  const validationResult = validateEmailId(id);
  if (!validationResult.ok) {
    return context.json({ errors: validationResult.errors }, 400);
  }

  const cancelResult = await cancelEmail(id);
  if (!cancelResult.ok) {
    return context.json({ error: cancelResult.error }, 502);
  }

  return context.json(cancelResult.email, 200);
}

export async function rescheduleEmailHandler(context: Context) {
  const id = context.req.param("id");
  const idValidation = validateEmailId(id);
  if (!idValidation.ok) {
    return context.json({ errors: idValidation.errors }, 400);
  }

  const parsedBody = await parseJsonBody<{ scheduledAt: string }>(context);
  if (!parsedBody.ok) {
    return context.json({ error: parsedBody.error }, 400);
  }

  const validationResult = validateRescheduleEmailRequest(parsedBody.value);
  if (!validationResult.ok) {
    return context.json({ errors: validationResult.errors }, 400);
  }

  const rescheduleResult = await rescheduleEmail(
    id,
    validationResult.value?.scheduledAt,
  );
  if (!rescheduleResult.ok) {
    return context.json({ error: rescheduleResult.error }, 502);
  }

  return context.json(rescheduleResult.email, 200);
}
