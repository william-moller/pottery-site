import { Resend } from "resend";

// Server-side email client — never import this in client components
export const resend = new Resend(process.env.RESEND_API_KEY);

export const FROM_EMAIL = process.env.RESEND_FROM_EMAIL ?? "hello@example.com";
export const SELLER_EMAIL = process.env.RESEND_SELLER_EMAIL ?? "seller@example.com";
