import nodemailer from "nodemailer"
import { env } from "../config/env.ts"

const transporter = nodemailer.createTransport({
  host: env.EMAIL_HOST,
  port: Number(env.EMAIL_PORT),
  secure: true, // true only for 465
  auth: {
    user: env.EMAIL_USER,
    pass: env.EMAIL_PASS,
  },
})

// Verify transporter at startup to surface auth/config issues early.
transporter.verify().then(() => {
  console.log("Email transporter verified and ready to send messages")
}).catch((err) => {
  console.error("Email transporter verification failed:", err?.message || err)
  console.error("Common causes: incorrect EMAIL_USER/EMAIL_PASS, missing app password for Gmail, or blocked sign-in. See https://support.google.com/mail/?p=BadCredentials")
})

export interface SendEmailOptions {
  to: string
  subject: string
  html: string
}

export const sendEmail = async ({
  to,
  subject,
  html,
}: SendEmailOptions): Promise<void> => {
  try {
    await transporter.sendMail({
      from: env.EMAIL_FROM,
      to,
      subject,
      html,
    })
  } catch (err: any) {
    console.error("Failed to send email:", err?.message || err)
    throw err
  }
}
