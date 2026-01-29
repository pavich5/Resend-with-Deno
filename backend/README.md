# Resend (Deno + Hono)

Simple API for sending, scheduling, retrieving, canceling, and rescheduling
emails with Resend.

## Setup

```bash
export RESEND_API_KEY=api_key

## Run

```bash
deno task dev
```

### GET /emails

List sent emails.

Query params:
- `limit` (number, optional; 1-100)
- `skip` (number, optional; 0-100)
- `take` (number, optional; 1-100)

Example:
```bash
curl "http://localhost:8000/api/emails?limit=20"
```

### POST /emails/send

Send or schedule an email.

Body:
- `to` (string)
- `subject` (string)
- `html` (string)
- `from` (string, required, valid email)
- `scheduledAt` (string, optional: ISO 8601 or relative like `in 10 sec`)

Example:
```bash
curl -X POST http://localhost:8000/api/emails/send \
  -H "Content-Type: application/json" \
  -d '{"to":"antonio.pavikj@ludotech.co","subject":"Hello","html":"<strong>It works</strong>","from":"onboarding@resend.dev","scheduledAt":"in 50 sec"}'
```

### GET /emails/:id

Retrieve a sent email by ID.

```bash
curl http://localhost:8000/api/emails/4ef9a417-02e9-4d39-ad75-9611e0fcc33c
```

### POST /emails/:id/cancel

Cancel a scheduled email by ID.

```bash
curl -X POST http://localhost:8000/api/emails/4ef9a417-02e9-4d39-ad75-9611e0fcc33c/cancel
```

### PATCH /emails/:id

Reschedule a pending email by ID.

```bash
curl -X PATCH http://localhost:8000/api/emails/4ef9a417-02e9-4d39-ad75-9611e0fcc33c \
  -H "Content-Type: application/json" \
  -d '{"scheduledAt":"in 2 min"}'
```

## Tests

```bash
deno test
```
