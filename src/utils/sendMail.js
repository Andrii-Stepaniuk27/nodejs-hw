import nodemailer from 'nodemailer';
import handlebars from 'handlebars';
import fs from 'fs';
import 'dotenv/config';

const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST,
  port: Number(process.env.SMTP_PORT),
  secure: Number(process.env.SMTP_PORT) === 465,
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASSWORD,
  },
});

export const sendEmail = async (options) => {
  let html = options.html;
  if (!html && options.templatePath) {
    const templateSource = fs.readFileSync(options.templatePath, 'utf8');
    const template = handlebars.compile(templateSource);
    html = template(options.templateData || {});
  }

  return await transporter.sendMail({
    from: options.from || process.env.SMTP_FROM,
    to: options.to,
    subject: options.subject,
    text: options.text,
    html,
  });
};

export const sendMail = sendEmail;

