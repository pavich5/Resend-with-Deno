import { Resend } from "resend";
import { RESEND_API_KEY } from "../config/env.ts";

export type SendEmailRequestBody = {
  from: string;
  to: string;
  subject: string;
  templateId: string;
  variables?: Record<string, string | number>;
  scheduledAt?: string;
};

export type ListEmailsQuery = {
  limit?: number;
  skip?: number;
  take?: number;
};

export type SendEmailResult =
  | { ok: true; id: string }
  | { ok: false; error: string };

type ResendClient = InstanceType<typeof Resend>;
type GetEmailResponse = Awaited<ReturnType<ResendClient["emails"]["get"]>>;
type GetEmailSuccess = NonNullable<GetEmailResponse["data"]>;
type CancelEmailResponse = Awaited<
  ReturnType<ResendClient["emails"]["cancel"]>
>;
type CancelEmailSuccess = NonNullable<CancelEmailResponse["data"]>;
type UpdateEmailResponse = Awaited<
  ReturnType<ResendClient["emails"]["update"]>
>;
type UpdateEmailSuccess = NonNullable<UpdateEmailResponse["data"]>;
type ListEmailsResponse = Awaited<ReturnType<ResendClient["emails"]["list"]>>;
type ListEmailsSuccess = NonNullable<ListEmailsResponse["data"]>;
type ListEmailsOptions = Parameters<ResendClient["emails"]["list"]>[0];

export type RetrieveEmailResult =
  | { ok: true; email: GetEmailSuccess }
  | { ok: false; error: string };

export type CancelEmailResult =
  | { ok: true; email: CancelEmailSuccess }
  | { ok: false; error: string };

export type RescheduleEmailResult =
  | { ok: true; email: UpdateEmailSuccess }
  | { ok: false; error: string };

export type ListEmailsResult =
  | { ok: true; emails: ListEmailsSuccess }
  | { ok: false; error: string };

const resend = new Resend(RESEND_API_KEY);

export async function sendEmail(
  payload: SendEmailRequestBody,
): Promise<SendEmailResult> {
  try {
    const { templateId, variables, ...rest } = payload;
    const template = variables
      ? { id: templateId, variables }
      : { id: templateId };
    const { data, error } = await resend.emails.send({
      ...rest,
      template,
    });

    if (error) {
      return { ok: false, error: error.message ?? "Resend error" };
    }

    if (!data?.id) {
      return { ok: false, error: "Resend response missing id" };
    }

    return { ok: true, id: data.id };
  } catch (err) {
    const message = err instanceof Error ? err.message : "Unknown error";
    return { ok: false, error: message };
  }
}

export async function retrieveEmail(id: string): Promise<RetrieveEmailResult> {
  try {
    const { data, error } = await resend.emails.get(id);

    if (error) {
      return { ok: false, error: error.message ?? "Resend error" };
    }

    if (!data) {
      return { ok: false, error: "Resend response missing data" };
    }

    return { ok: true, email: data };
  } catch (err) {
    const message = err instanceof Error ? err.message : "Unknown error";
    return { ok: false, error: message };
  }
}

export async function cancelEmail(id: string): Promise<CancelEmailResult> {
  try {
    const { data, error } = await resend.emails.cancel(id);

    if (error) {
      return { ok: false, error: error.message ?? "Resend error" };
    }

    if (!data) {
      return { ok: false, error: "Resend response missing data" };
    }

    return { ok: true, email: data };
  } catch (err) {
    const message = err instanceof Error ? err.message : "Unknown error";
    return { ok: false, error: message };
  }
}

export async function rescheduleEmail(
  id: string,
  scheduledAt: string,
): Promise<RescheduleEmailResult> {
  try {
    const { data, error } = await resend.emails.update({
      id,
      scheduledAt,
    });

    if (error) {
      return { ok: false, error: error.message ?? "Resend error" };
    }

    if (!data) {
      return { ok: false, error: "Resend response missing data" };
    }

    return { ok: true, email: data };
  } catch (err) {
    const message = err instanceof Error ? err.message : "Unknown error";
    return { ok: false, error: message };
  }
}

export async function listEmails(
  query: ListEmailsQuery,
): Promise<ListEmailsResult> {
  try {
    const skip = query.skip ?? 0;
    const take = query.take ?? query.limit;

    let requestedLimit = take;
    if (skip > 0) {
      requestedLimit = (take ?? 20) + skip;
    }
    if (requestedLimit !== undefined) {
      requestedLimit = Math.min(requestedLimit, 100);
    }

    let options: ListEmailsOptions | undefined;

    if (requestedLimit !== undefined) {
      options = { limit: requestedLimit };
    }

    const { data, error } = await resend.emails.list(options);

    if (error) {
      return { ok: false, error: error.message ?? "Resend error" };
    }

    if (!data) {
      return { ok: false, error: "Resend response missing data" };
    }

    if (skip === 0 && take === undefined) {
      return { ok: true, emails: data };
    }

    const end = skip + (take ?? data.data.length);
    const sliced = data.data.slice(skip, end);
    const hasMore = data.has_more || end < data.data.length;

    return {
      ok: true,
      emails: {
        ...data,
        data: sliced,
        has_more: hasMore,
      },
    };
  } catch (err) {
    const message = err instanceof Error ? err.message : "Unknown error";
    return { ok: false, error: message };
  }
}
