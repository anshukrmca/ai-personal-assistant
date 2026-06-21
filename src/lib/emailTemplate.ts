export function buildEmailHtml(to: string, subject: string, bodyText: string): string {
  // Convert plain text body to HTML paragraphs
  const bodyHtml = bodyText
    .split(/\n+/)
    .map((line) => `<p style="margin:0 0 12px 0;line-height:1.6;">${line}</p>`)
    .join("");

  return `<!DOCTYPE html>\r
<html lang="en">\r
<head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1.0"></head>\r
<body style="margin:0;padding:0;background-color:#f4f4f7;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,'Helvetica Neue',Arial,sans-serif;">\r
  <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background-color:#f4f4f7;padding:32px 16px;">\r
    <tr><td align="center">\r
      <table role="presentation" width="600" cellpadding="0" cellspacing="0" style="background-color:#ffffff;border-radius:12px;overflow:hidden;box-shadow:0 2px 8px rgba(0,0,0,0.06);">\r
        <!-- Header -->\r
        <tr>\r
          <td style="background:linear-gradient(135deg,#7c3aed,#9061f9);padding:28px 32px;">\r
            <h1 style="margin:0;color:#ffffff;font-size:18px;font-weight:700;letter-spacing:-0.3px;">\r
              ${subject}\r
            </h1>\r
          </td>\r
        </tr>\r
        <!-- Body -->\r
        <tr>\r
          <td style="padding:32px;color:#1f2937;font-size:15px;">\r
            ${bodyHtml}\r
          </td>\r
        </tr>\r
        <!-- Signature -->\r
        <tr>\r
          <td style="padding:0 32px 32px 32px;">\r
            <table role="presentation" width="100%" cellpadding="0" cellspacing="0">\r
              <tr><td style="border-top:1px solid #e5e7eb;padding-top:20px;">\r
                <p style="margin:0 0 4px 0;color:#6b7280;font-size:13px;">Best regards,</p>\r
                <p style="margin:0 0 2px 0;color:#1f2937;font-size:14px;font-weight:600;">Anshu</p>\r
                <p style="margin:0;color:#9ca3af;font-size:12px;">Sent via Anshu Personal Assistant</p>\r
              </td></tr>\r
            </table>\r
          </td>\r
        </tr>\r
        <!-- Footer -->\r
        <tr>\r
          <td style="background-color:#f9fafb;padding:16px 32px;border-top:1px solid #f3f4f6;">\r
            <p style="margin:0;color:#9ca3af;font-size:11px;text-align:center;">\r
              This email was composed by Anshu AI - your personal productivity assistant.\r
            </p>\r
          </td>\r
        </tr>\r
      </table>\r
    </td></tr>\r
  </table>\r
</body>\r
</html>`;
}
