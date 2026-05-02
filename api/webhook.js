import Stripe from 'stripe';
import nodemailer from 'nodemailer';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

const PDF_MAP = {
  'lendas-do-basquete': 'PACK_LENDAS_DA_NBA.pdf',
  'lendas-do-futebol': 'PACK_LENDAS_DO_FUTEBOL.pdf',
  'lendas-do-rock': 'PACK_LENDAS_DO_ROCK.pdf',
  'anime': 'PACK_ANIMES.pdf',
};

const PACK_NAMES = {
  'lendas-do-basquete': 'Lendas do Basquete',
  'lendas-do-futebol': 'Lendas do Futebol',
  'lendas-do-rock': 'Lendas Do Rock',
  'anime': 'Anime Pack',
};

const getRawBody = (req) =>
  new Promise((resolve, reject) => {
    const chunks = [];
    req.on('data', (c) => chunks.push(c));
    req.on('end', () => resolve(Buffer.concat(chunks)));
    req.on('error', reject);
  });

const sendEmail = async (toEmail, packSlugs) => {
  const transporter = nodemailer.createTransport({
    host: 'smtp.gmail.com',
    port: 465,
    secure: true,
    auth: {
      user: process.env.GMAIL_USER,
      pass: process.env.GMAIL_APP_PASSWORD,
    },
  });

  const attachments = packSlugs.map((slug) => ({
    filename: `${PACK_NAMES[slug]}.pdf`,
    path: path.join(__dirname, 'pdfs', PDF_MAP[slug]),
  }));

  const packListHtml = packSlugs
    .map((s) => `<li style="margin-bottom:6px;"><strong style="color:#FFD700;">${PACK_NAMES[s]}</strong></li>`)
    .join('');

  await transporter.sendMail({
    from: `"Studio Pack" <${process.env.GMAIL_USER}>`,
    to: toEmail,
    subject: '🎨 Seu Pack Studio Pack está pronto!',
    html: `
      <div style="font-family:Arial,sans-serif;max-width:600px;margin:0 auto;background:#0a0a0a;color:#fff;padding:40px;border-radius:12px;">
        <h1 style="color:#FFD700;font-size:32px;margin:0 0 4px;">Studio Pack</h1>
        <p style="color:#888;font-size:13px;margin:0 0 32px;letter-spacing:2px;text-transform:uppercase;">Estampas Halftone Profissionais</p>

        <h2 style="color:#fff;font-size:22px;margin-bottom:16px;">Compra confirmada! 🎉</h2>
        <p style="color:#ccc;font-size:15px;line-height:1.7;margin-bottom:20px;">
          Obrigado pela sua compra! Os PDFs com os links de acesso estão em anexo neste email.
        </p>

        <div style="background:#111;border:1px solid #FFD70033;border-radius:10px;padding:20px;margin-bottom:24px;">
          <p style="color:#888;font-size:12px;text-transform:uppercase;letter-spacing:1px;margin:0 0 12px;">Seus packs:</p>
          <ul style="margin:0;padding-left:20px;color:#ccc;font-size:15px;line-height:1.8;">
            ${packListHtml}
          </ul>
        </div>

        <p style="color:#ccc;font-size:14px;line-height:1.7;margin-bottom:24px;">
          Abra o PDF anexo e você encontrará o link do <strong style="color:#fff;">Google Drive</strong> para baixar todas as artes em alta resolução (300 DPI, formato A3, PNG e PSD).
        </p>

        <div style="background:#1a1a1a;border-left:3px solid #FFD700;padding:16px 20px;border-radius:0 8px 8px 0;margin-bottom:32px;">
          <p style="color:#ccc;font-size:13px;margin:0;line-height:1.6;">
            💡 <strong style="color:#fff;">Dica:</strong> Salve o link do Google Drive em um lugar seguro. Em caso de dúvidas, entre em contato pelo Instagram ou WhatsApp.
          </p>
        </div>

        <div style="border-top:1px solid #222;padding-top:24px;color:#555;font-size:12px;">
          Studio Pack – Estampas Halftone para Estamparia Profissional
        </div>
      </div>
    `,
    attachments,
  });
};

export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).end();

  const rawBody = await getRawBody(req);
  const sig = req.headers['stripe-signature'];

  let event;
  try {
    event = stripe.webhooks.constructEvent(
      rawBody,
      sig,
      process.env.STRIPE_WEBHOOK_SECRET
    );
  } catch (err) {
    console.error('Webhook signature error:', err.message);
    return res.status(400).send(`Webhook Error: ${err.message}`);
  }

  if (event.type === 'checkout.session.completed') {
    const session = event.data.object;
    const customerEmail = session.customer_details?.email;
    const { mainPackSlug, bumpPackSlug } = session.metadata;

    if (!customerEmail) {
      console.error('No customer email found in session');
      return res.status(200).json({ received: true });
    }

    const packsToSend = [mainPackSlug];
    if (bumpPackSlug && PDF_MAP[bumpPackSlug]) {
      packsToSend.push(bumpPackSlug);
    }

    try {
      await sendEmail(customerEmail, packsToSend);
      console.log(`Email enviado para ${customerEmail} | packs: ${packsToSend.join(', ')}`);
    } catch (emailErr) {
      console.error('Erro ao enviar email:', emailErr);
    }
  }

  res.status(200).json({ received: true });
}
