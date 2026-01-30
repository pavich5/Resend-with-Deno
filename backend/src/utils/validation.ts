import { z } from "zod";
import {
  type ListEmailsQuery,
  SendEmailRequestBody,
} from "../services/email_service.ts";

type SendEmailValidationResult =
  | { ok: true; value: SendEmailRequestBody }
  | { ok: false; errors: string[] };

type IdValidationResult = { ok: true } | { ok: false; errors: string[] };

type RescheduleValidationResult =
  | { ok: true; value: { scheduledAt: string } }
  | { ok: false; errors: string[] };

type ListEmailsQueryValidationResult =
  | { ok: true; value: ListEmailsQuery }
  | { ok: false; errors: string[] };

const sendEmailSchema = z.object({
  to: z
    .string({
      required_error: "Invalid or missing 'to'",
      invalid_type_error: "Invalid or missing 'to'",
    })
    .trim()
    .min(1, "Invalid or missing 'to'"),
  subject: z
    .string({
      required_error: "Invalid or missing 'subject'",
      invalid_type_error: "Invalid or missing 'subject'",
    })
    .trim()
    .min(1, "Invalid or missing 'subject'"),
  template_id: z
    .string({
      required_error: "Invalid or missing 'template_id'",
      invalid_type_error: "Invalid or missing 'template_id'",
    })
    .trim()
    .min(1, "Invalid or missing 'template_id'"),
  variables: z.record(z.union([z.string(), z.number()])).optional(),
  scheduledAt: z
    .string({
      invalid_type_error: "Invalid 'scheduledAt'",
    })
    .trim()
    .min(1, "Invalid 'scheduledAt'")
    .optional(),
  from: z
    .string({
      required_error: "Invalid or missing 'from'",
      invalid_type_error: "Invalid or missing 'from'",
    })
    .trim()
    .min(1, "Invalid or missing 'from'")
    .email("Invalid or missing 'from'"),
});

type SendEmailRequestPayload = z.infer<typeof sendEmailSchema>;

const rescheduleEmailSchema = z.object({
  scheduledAt: z
    .string({
      required_error: "Invalid or missing 'scheduledAt'",
      invalid_type_error: "Invalid or missing 'scheduledAt'",
    })
    .trim()
    .min(1, "Invalid or missing 'scheduledAt'"),
});

const parseNumberParam = (value: unknown) => {
  if (value === undefined || value === null) {
    return undefined;
  }
  if (typeof value === "string") {
    const trimmed = value.trim();
    if (trimmed.length === 0) {
      return "__invalid__";
    }
    const parsed = Number(trimmed);
    return Number.isFinite(parsed) ? parsed : "__invalid__";
  }
  return value;
};

const listEmailsSchema = z.object({
  limit: z
    .preprocess(
      parseNumberParam,
      z
        .number({
          invalid_type_error: "Invalid 'limit'",
        })
        .int("Invalid 'limit'")
        .min(1, "Invalid 'limit'")
        .max(100, "Invalid 'limit'"),
    )
    .optional(),
  take: z
    .preprocess(
      parseNumberParam,
      z
        .number({
          invalid_type_error: "Invalid 'take'",
        })
        .int("Invalid 'take'")
        .min(1, "Invalid 'take'")
        .max(100, "Invalid 'take'"),
    )
    .optional(),
  skip: z
    .preprocess(
      parseNumberParam,
      z
        .number({
          invalid_type_error: "Invalid 'skip'",
        })
        .int("Invalid 'skip'")
        .min(0, "Invalid 'skip'")
        .max(100, "Invalid 'skip'"),
    )
    .optional(),
});

const emailIdSchema = z
  .string({
    required_error: "Invalid or missing 'id'",
    invalid_type_error: "Invalid or missing 'id'",
  })
  .trim()
  .min(1, "Invalid or missing 'id'");

const validateSendEmailRequest = (
  payload: SendEmailRequestPayload,
): SendEmailValidationResult => {
  const result = sendEmailSchema.safeParse(payload);
  if (result.success) {
    const { template_id, ...rest } = result.data;
    return { ok: true, value: { ...rest, templateId: template_id } };
  }

  const errors = Array.from(
    new Set(result.error.errors.map((issue) => issue.message)),
  );
  for (const errorMessage of errors) {
    console.warn(`Validation error: ${errorMessage}`);
  }

  return { ok: false, errors };
};

const validateEmailId = (id: unknown): IdValidationResult => {
  const result = emailIdSchema.safeParse(id);
  if (result.success) {
    return { ok: true };
  }

  const errors = Array.from(
    new Set(result.error.errors.map((issue) => issue.message)),
  );
  for (const errorMessage of errors) {
    console.warn(`Validation error: ${errorMessage}`);
  }

  return { ok: false, errors };
};

const validateRescheduleEmailRequest = (
  payload: unknown,
): RescheduleValidationResult => {
  const result = rescheduleEmailSchema.safeParse(payload);
  if (result.success) {
    return { ok: true, value: { scheduledAt: result.data.scheduledAt } };
  }

  const errors = Array.from(
    new Set(result.error.errors.map((issue) => issue.message)),
  );
  for (const errorMessage of errors) {
    console.warn(`Validation error: ${errorMessage}`);
  }

  return { ok: false, errors };
};

const validateListEmailsQuery = (
  query: unknown,
): ListEmailsQueryValidationResult => {
  const result = listEmailsSchema.safeParse(query);
  if (result.success) {
    return {
      ok: true,
      value: {
        limit: result.data.limit,
        skip: result.data.skip,
        take: result.data.take,
      },
    };
  }

  const errors = Array.from(
    new Set(result.error.errors.map((issue) => issue.message)),
  );
  for (const errorMessage of errors) {
    console.warn(`Validation error: ${errorMessage}`);
  }

  return { ok: false, errors };
};

export {
  type SendEmailRequestPayload,
  validateEmailId,
  validateListEmailsQuery,
  validateRescheduleEmailRequest,
  validateSendEmailRequest,
};
