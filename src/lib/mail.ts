"use server";

import nodemailer from "nodemailer";

const transporter = nodemailer.createTransport({
  host: "smtp.ethereal.email",
  port: 587,
  auth: {
    user: "jose.cummings@ethereal.email",
    pass: "MgNCvYmr3mUGAY9Qgr",
  },
});

export async function sendMail(
  toEmail: string,
  subject: string,
  content: string
) {
  await transporter.sendMail({
    to: toEmail,
    subject: subject,
    text: content,
    html: content,
  });
}
