'use server'
import nodemailer from "nodemailer";

export type MailOptions = {
  replyTo: string;
  subject: string;
  text?: string;
  html?: string;
  from?: string;
  attachments?: {
    filename: string;
    path?: string;
    content?: Buffer | string;
    contentType?: string;
  }[];
};

export type MailOptions2 = {
  to: string;
  subject: string;
  text?: string;
  html?: string;
  from?: string;
  replyTo?: string;
  attachments?: {
    filename: string;
    path?: string;
    content?: Buffer | string;
    contentType?: string;
  }[];
};


export async function sendEmail({ from, replyTo, subject, text, html, attachments }: MailOptions) {

  const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: process.env.EMAIL_USER!,
      pass: process.env.EMAIL_PASS!,
    },
    tls: {
      rejectUnauthorized: false,
    },
  });

  const info = await transporter.sendMail({
    from: from ?? `"FOODLENS" <${process.env.EMAIL_USER}>`,
    to: process.env.RECIEVER_EMAIL_USER!,
    subject,
    text,
    html,
    attachments,
    replyTo
  });

  console.log("📧 Email sent:", info.messageId);
  return info;
}


export async function sendEmailFn({
  to,
  from,
  replyTo,
  subject,
  text,
  html,
  attachments,
}: MailOptions2) {
  const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: process.env.EMAIL_USER!,
      pass: process.env.EMAIL_PASS!,
    },
    tls: {
      rejectUnauthorized: false,
    },
  });

  const info = await transporter.sendMail({
    from: from ?? `"FOODLENS" <${process.env.EMAIL_USER}>`,
    to,
    subject,
    text,
    html,
    attachments,
    replyTo,
  });

  console.log("Email sent:", info.messageId);
  return info;
}


// ✅ Reusable HTML wrapper with Poppins font
function withPoppins(htmlContent: string) {
  return `
    <!DOCTYPE html>
    <html lang="en">
      <head>
        <meta charset="UTF-8" />
      <link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?family=Poppins:ital,wght@0,100;0,200;0,300;0,400;0,500;0,600;0,700;0,800;0,900;1,100;1,200;1,300;1,400;1,500;1,600;1,700;1,800;1,900&display=swap" rel="stylesheet">
        <style>
          body {
            font-family: 'Poppins', Arial, sans-serif;
            line-height: 1.6;
            color: #000;
          }
          a {
            color: #2F8E5C;
            text-decoration: none;
          }
          a:hover {
            text-decoration: underline;
          }
        </style>
      </head>
      <body>${htmlContent}</body>
    </html>
  `;
}


export async function sendVerificationEmail(email: string, token: string) {
  const baseUrl = process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000";
  const verifyUrl = `${baseUrl}/verify?token=${token}`;

  return sendEmailFn({
    to: email,
    subject: "Verify your FOODLENS account",
    html: withPoppins(`
      <h2>Welcome to <strong>FOOD<span style="color:#2F8E5C;">LENS</span></strong> 🎉</h2>
      <p>Please verify your email by clicking the link below:</p>
      <p><a href="${verifyUrl}" target="_blank">${verifyUrl}</a></p>
      <p>This link will expire in 1 hour.</p>
    `),
  });
}


export async function sendPasswordResetEmail(email: string, token: string) {
  const baseUrl = process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000";
  const resetUrl = `${baseUrl}/reset-password?token=${token}`;

  return sendEmailFn({
    to: email,
    subject: "Reset your FOODLENS password",
    html: withPoppins(`
      <h2 style="color: #333;">Reset Your Password 🔑</h2>
      <p>We received a request to reset your password for your <strong>FOOD<span style="color:#2F8E5C;">LENS</span></strong> account.</p>
      <p>Click the button below to set a new password:</p>
      <p>
        <a 
          href="${resetUrl}" 
          target="_blank" 
          style="display:inline-block;padding:10px 20px;background:#ef4444;color:#fff;text-decoration:none;border-radius:5px;"
        >
          Reset Password
        </a>
      </p>
      <p>If the button doesn’t work, copy and paste this link into your browser:</p>
      <p><a href="${resetUrl}" target="_blank">${resetUrl}</a></p>
      <p style="font-size: 12px; color: #666;">
        This link will expire in 1 hour. If you didn’t request this, please ignore this email.
      </p>
    `),
  });
}


export async function sendSubscriptionEmail(email: string) {
  const unsubscribeUrl = `${process.env.NEXT_PUBLIC_APP_URL}/unsubscribe?email=${encodeURIComponent(email)}`;

  return sendEmailFn({
    to: email,
    subject: "You’re subscribed to FOODLENS updates!",
    html: withPoppins(`
      <h2>Thanks for subscribing 🙌</h2>
      <p>You’ll now receive exclusive updates, discounts, and early access to new templates & scripts.</p>
      <p>If this wasn’t you, you can <a href="${unsubscribeUrl}" style="color:#d00; font-weight:bold;">unsubscribe here</a> anytime.</p>
    `),
  });
}


export async function sendUnsubscriptionEmail(email: string) {
  return sendEmailFn({
    to: email,
    subject: "You’ve been unsubscribed from FOODLENS",
    html: withPoppins(`
      <h2>Sorry to see you go 😢</h2>
      <p>Your email has been removed from our mailing list. You won’t receive further updates.</p>
      <p>If this was a mistake, you can <a href="${process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000"}/">subscribe again here</a>.</p>
    `),
  });
}
