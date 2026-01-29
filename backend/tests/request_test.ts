import { assertEquals } from "std/assert";
import type { Context } from "hono";
import { parseJsonBody, validateJsonBody } from "../src/utils/request.ts";

const mockContext = (json: () => Promise<unknown>) =>
  ({
    req: {
      json,
    },
  }) as unknown as Context;

Deno.test("validateJsonBody accepts plain objects", () => {
  const result = validateJsonBody<{ ok: boolean }>({ ok: true });
  if (!result.ok) {
    throw new Error("Expected ok result");
  }
  assertEquals(result.value.ok, true);
});

Deno.test("validateJsonBody accepts empty objects", () => {
  const result = validateJsonBody<Record<string, unknown>>({});
  if (!result.ok) {
    throw new Error("Expected ok result");
  }
  assertEquals(Object.keys(result.value).length, 0);
});

Deno.test("validateJsonBody accepts nested objects", () => {
  const result = validateJsonBody<{ user: { name: string } }>({
    user: { name: "Ada" },
  });
  if (!result.ok) {
    throw new Error("Expected ok result");
  }
  assertEquals(result.value.user.name, "Ada");
});

Deno.test("validateJsonBody accepts objects with arrays and nulls", () => {
  const result = validateJsonBody<{
    tags: string[];
    meta: { count: number | null };
  }>({
    tags: ["a", "b"],
    meta: { count: null },
  });
  if (!result.ok) {
    throw new Error("Expected ok result");
  }
  assertEquals(result.value.tags.length, 2);
  assertEquals(result.value.meta.count, null);
});

Deno.test("validateJsonBody rejects non-object values", () => {
  assertEquals(validateJsonBody<string>("hello").ok, false);
  assertEquals(validateJsonBody<number>(123).ok, false);
  assertEquals(validateJsonBody<null>(null).ok, false);
  assertEquals(validateJsonBody<string[]>(["a"]).ok, false);
});

Deno.test("parseJsonBody returns ok for valid JSON object", async () => {
  const context = mockContext(() => Promise.resolve({ name: "Ada" }));

  const result = await parseJsonBody<{ name: string }>(context);
  if (!result.ok) {
    throw new Error("Expected ok result");
  }
  assertEquals(result.value.name, "Ada");
});

Deno.test("parseJsonBody returns ok for empty JSON object", async () => {
  const context = mockContext(() => Promise.resolve({}));

  const result = await parseJsonBody<Record<string, unknown>>(context);
  if (!result.ok) {
    throw new Error("Expected ok result");
  }
  assertEquals(Object.keys(result.value).length, 0);
});

Deno.test("parseJsonBody returns ok for nested JSON object", async () => {
  const context = mockContext(() =>
    Promise.resolve({ user: { name: "Ada" }, tags: ["a", "b"] }),
  );

  const result = await parseJsonBody<{
    user: { name: string };
    tags: string[];
  }>(context);
  if (!result.ok) {
    throw new Error("Expected ok result");
  }
  assertEquals(result.value.user.name, "Ada");
  assertEquals(result.value.tags.length, 2);
});

Deno.test(
  "parseJsonBody returns ok for object with mixed primitives",
  async () => {
    const context = mockContext(() =>
      Promise.resolve({
        name: "Ada",
        active: true,
        score: 42,
        note: null,
      }),
    );

    const result = await parseJsonBody<{
      name: string;
      active: boolean;
      score: number;
      note: null;
    }>(context);
    if (!result.ok) {
      throw new Error("Expected ok result");
    }
    assertEquals(result.value.name, "Ada");
    assertEquals(result.value.active, true);
    assertEquals(result.value.score, 42);
    assertEquals(result.value.note, null);
  },
);

Deno.test("parseJsonBody returns error for invalid JSON body", async () => {
  const context = mockContext(() => Promise.resolve([]));

  const result = await parseJsonBody(context);
  assertEquals(result.ok, false);
});

Deno.test("parseJsonBody returns error when JSON parsing throws", async () => {
  const context = mockContext(() => Promise.reject(new Error("bad json")));

  const result = await parseJsonBody(context);
  assertEquals(result.ok, false);
});
