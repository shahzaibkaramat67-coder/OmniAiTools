import nodemailer from "nodemailer";

const transporter = nodemailer.createTransport({
  host:   process.env.EMAIL_HOST   ?? "smtp.gmail.com",
  port:   parseInt(process.env.EMAIL_PORT ?? "587"),
  secure: process.env.EMAIL_PORT   === "465",
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

const FROM = `"OmniAITool" <${process.env.EMAIL_USER}>`;

// ── Shared base HTML wrapper ────────────────────────────────────
function wrapHtml(content: string): string {
  return `
    <!DOCTYPE html>
    <html>
    <head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"></head>
    <body style="margin:0;padding:0;background:#0f1117;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',sans-serif;">
      <div style="max-width:520px;margin:40px auto;background:#161b27;border:1px solid #1e2535;border-radius:16px;overflow:hidden;">
        <!-- Header -->
        <div style="padding:28px 32px;border-bottom:1px solid #1e2535;background:linear-gradient(135deg,rgba(36,85,245,0.12),rgba(139,92,246,0.08));">
          <div style="display:inline-flex;align-items:center;gap:10px;">
            <div style="width:32px;height:32px;border-radius:8px;background:linear-gradient(135deg,#2455f5,#8b5cf6);display:flex;align-items:center;justify-content:center;font-weight:800;font-size:16px;color:white;">O</div>
            <span style="font-weight:700;font-size:16px;color:white;">OmniAITool</span>
          </div>
        </div>
        <!-- Body -->
        <div style="padding:32px;">
          ${content}
        </div>
        <!-- Footer -->
        <div style="padding:20px 32px;border-top:1px solid #1e2535;text-align:center;">
          <p style="color:#475569;font-size:12px;margin:0;">
            © ${new Date().getFullYear()} OmniAITool. All rights reserved.<br/>
            <a href="${process.env.NEXT_PUBLIC_APP_URL}" style="color:#4d7bff;text-decoration:none;">omniaitool.com</a>
          </p>
        </div>
      </div>
    </body>
    </html>
  `;
}

// ── Email senders ────────────────────────────────────────────────

export async function sendPasswordReset(to: string, resetUrl: string) {
  await transporter.sendMail({
    from:    FROM,
    to,
    subject: "Reset your OmniAITool password",
    html: wrapHtml(`
      <h2 style="color:white;margin:0 0 8px;">Reset your password</h2>
      <p style="color:#94a3b8;margin:0 0 24px;line-height:1.6;">
        We received a request to reset your password. Click the button below — this link expires in <strong style="color:white;">30 minutes</strong>.
      </p>
      <a href="${resetUrl}"
         style="display:inline-block;padding:13px 28px;background:#2455f5;color:white;text-decoration:none;border-radius:10px;font-weight:600;font-size:14px;box-shadow:0 0 20px rgba(36,85,245,0.3);">
        Reset Password →
      </a>
      <p style="color:#475569;font-size:12px;margin-top:24px;line-height:1.5;">
        If you didn't request a password reset, you can safely ignore this email.<br/>
        Your password will remain unchanged.
      </p>
    `),
  });
}

export async function sendWelcomeEmail(to: string, name: string) {
  await transporter.sendMail({
    from:    FROM,
    to,
    subject: "Welcome to OmniAITool 🚀",
    html: wrapHtml(`
      <h2 style="color:white;margin:0 0 8px;">Welcome, ${name}! 🎉</h2>
      <p style="color:#94a3b8;margin:0 0 16px;line-height:1.6;">
        Your account is ready. You've received <strong style="color:#4d7bff;">10 free credits</strong> to get started.
      </p>
      <p style="color:#94a3b8;margin:0 0 24px;line-height:1.6;">
        Explore 40+ AI tools for writing, SEO, social media, and more — all in one place.
      </p>
      <a href="${process.env.NEXT_PUBLIC_APP_URL}/dashboard"
         style="display:inline-block;padding:13px 28px;background:#2455f5;color:white;text-decoration:none;border-radius:10px;font-weight:600;font-size:14px;box-shadow:0 0 20px rgba(36,85,245,0.3);">
        Go to Dashboard →
      </a>
      <div style="margin-top:28px;padding:16px;background:rgba(36,85,245,0.08);border:1px solid rgba(36,85,245,0.2);border-radius:10px;">
        <p style="color:#94a3b8;font-size:13px;margin:0 0 8px;font-weight:600;">Quick tips:</p>
        <ul style="color:#94a3b8;font-size:13px;margin:0;padding-left:16px;line-height:1.8;">
          <li>Start with the <strong style="color:white;">Blog Generator</strong> to create content fast</li>
          <li>Use <strong style="color:white;">SEO Title Generator</strong> to boost your click rates</li>
          <li>Try <strong style="color:white;">Cold Email Generator</strong> for outreach</li>
        </ul>
      </div>
    `),
  });
}

export async function sendLowCreditsAlert(to: string, name: string, credits: number) {
  await transporter.sendMail({
    from:    FROM,
    to,
    subject: "⚡ Your OmniAITool credits are running low",
    html: wrapHtml(`
      <h2 style="color:white;margin:0 0 8px;">Credits running low ⚡</h2>
      <p style="color:#94a3b8;margin:0 0 16px;line-height:1.6;">
        Hi ${name}, you have only <strong style="color:#fbbf24;">${credits} credits</strong> remaining.
        Top up to keep generating without interruption.
      </p>
      <a href="${process.env.NEXT_PUBLIC_APP_URL}/pricing"
         style="display:inline-block;padding:13px 28px;background:#2455f5;color:white;text-decoration:none;border-radius:10px;font-weight:600;font-size:14px;box-shadow:0 0 20px rgba(36,85,245,0.3);">
        Buy Credits →
      </a>
    `),
  });
}
