const MAILTO_LENGTH_LIMIT = 1800;

export interface ContactFields {
  name: string;
  subject: string;
  message: string;
}

/** Builds a mailto: URL from contact form fields, encoding each part. */
export function buildMailto(email: string, fields: ContactFields): string {
  const subject = encodeURIComponent(fields.subject || `Message from ${fields.name}`);
  const body = encodeURIComponent(`${fields.message}\n\n— ${fields.name}`);
  return `mailto:${email}?subject=${subject}&body=${body}`;
}

/** True if the built mailto URL is short enough for browsers/mail clients to open reliably. */
export function isMailtoWithinLimit(email: string, fields: ContactFields): boolean {
  return buildMailto(email, fields).length <= MAILTO_LENGTH_LIMIT;
}
