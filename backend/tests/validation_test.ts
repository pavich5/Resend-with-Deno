import {
  validateEmailId,
  validateListEmailsQuery,
  validateRescheduleEmailRequest,
  validateSendEmailRequest,
} from "../src/utils/validation.ts";
import { assertEquals } from "std/assert";

Deno.test("validateSendEmailRequest returns no errors for valid input", () => {
  const result = validateSendEmailRequest({
    to: "recipient@example.com",
    subject: "Hello",
    html: "<strong>Hi</strong>",
    from: "onboarding@resend.dev",
  });

  assertEquals(result.ok, true);
});

Deno.test("validateSendEmailRequest returns errors for invalid fields", () => {
  const result = validateSendEmailRequest({
    to: "",
    subject: " ",
    html: "",
    from: "",
  });

  assertEquals(result.ok, false);
  if (result.ok) {
    return;
  }

  assertEquals(result.errors, [
    "Invalid or missing 'to'",
    "Invalid or missing 'subject'",
    "Invalid or missing 'html'",
    "Invalid or missing 'from'",
  ]);
});

Deno.test("validateSendEmailRequest rejects invalid from email", () => {
  const result = validateSendEmailRequest({
    to: "recipient@example.com",
    subject: "Hello",
    html: "<strong>Hi</strong>",
    from: "not-an-email",
    scheduledAt: "in 1 min",
  });

  assertEquals(result.ok, false);
  if (result.ok) {
    return;
  }

  assertEquals(result.errors, ["Invalid or missing 'from'"]);
});

Deno.test("validateSendEmailRequest rejects invalid scheduledAt", () => {
  const result = validateSendEmailRequest({
    to: "recipient@example.com",
    subject: "Hello",
    html: "<strong>Hi</strong>",
    from: "onboarding@resend.dev",
    scheduledAt: "   ",
  });

  assertEquals(result.ok, false);
  if (result.ok) {
    return;
  }

  assertEquals(result.errors, ["Invalid 'scheduledAt'"]);
});

Deno.test("validateEmailId rejects empty id", () => {
  const result = validateEmailId("");

  assertEquals(result.ok, false);
  if (result.ok) {
    return;
  }

  assertEquals(result.errors, ["Invalid or missing 'id'"]);
});

Deno.test("validateEmailId accepts non-empty id", () => {
  const result = validateEmailId("4ef9a417-02e9-4d39-ad75-9611e0fcc33c");

  assertEquals(result.ok, true);
});

Deno.test("validateEmailId rejects whitespace-only id", () => {
  const result = validateEmailId("   ");

  assertEquals(result.ok, false);
  if (result.ok) {
    return;
  }

  assertEquals(result.errors, ["Invalid or missing 'id'"]);
});

Deno.test("validateRescheduleEmailRequest rejects missing scheduledAt", () => {
  const result = validateRescheduleEmailRequest({});

  assertEquals(result.ok, false);
  if (result.ok) {
    return;
  }

  assertEquals(result.errors, ["Invalid or missing 'scheduledAt'"]);
});

Deno.test("validateRescheduleEmailRequest rejects empty scheduledAt", () => {
  const result = validateRescheduleEmailRequest({ scheduledAt: "   " });

  assertEquals(result.ok, false);
  if (result.ok) {
    return;
  }

  assertEquals(result.errors, ["Invalid or missing 'scheduledAt'"]);
});

Deno.test("validateRescheduleEmailRequest accepts relative scheduledAt", () => {
  const result = validateRescheduleEmailRequest({
    scheduledAt: "in 2min",
  });

  assertEquals(result.ok, true);
  if (!result.ok || !result.value) {
    return;
  }

  assertEquals(result.value.scheduledAt, "in 2min");
});

Deno.test("validateRescheduleEmailRequest accepts ISO scheduledAt", () => {
  const result = validateRescheduleEmailRequest({
    scheduledAt: "2024-08-05T11:52:01.858Z",
  });

  assertEquals(result.ok, true);
  if (!result.ok || !result.value) {
    return;
  }

  assertEquals(result.value.scheduledAt, "2024-08-05T11:52:01.858Z");
});

Deno.test("validateListEmailsQuery accepts empty query", () => {
  const result = validateListEmailsQuery({});

  assertEquals(result.ok, true);
});

Deno.test("validateListEmailsQuery parses limit param", () => {
  const result = validateListEmailsQuery({
    limit: "25",
  });

  assertEquals(result.ok, true);
  if (!result.ok) {
    return;
  }

  assertEquals(result.value.limit, 25);
});

Deno.test("validateListEmailsQuery parses skip and take params", () => {
  const result = validateListEmailsQuery({
    skip: "5",
    take: "10",
  });

  assertEquals(result.ok, true);
  if (!result.ok) {
    return;
  }

  assertEquals(result.value.skip, 5);
  assertEquals(result.value.take, 10);
});

Deno.test("validateListEmailsQuery rejects invalid limit", () => {
  const result = validateListEmailsQuery({ limit: "0" });

  assertEquals(result.ok, false);
  if (result.ok) {
    return;
  }

  assertEquals(result.errors, ["Invalid 'limit'"]);
});

Deno.test("validateListEmailsQuery rejects invalid skip", () => {
  const result = validateListEmailsQuery({ skip: "-1" });

  assertEquals(result.ok, false);
  if (result.ok) {
    return;
  }

  assertEquals(result.errors, ["Invalid 'skip'"]);
});

Deno.test("validateListEmailsQuery rejects invalid take", () => {
  const result = validateListEmailsQuery({ take: "0" });

  assertEquals(result.ok, false);
  if (result.ok) {
    return;
  }

  assertEquals(result.errors, ["Invalid 'take'"]);
});
