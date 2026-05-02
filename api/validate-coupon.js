import Stripe from 'stripe';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

const getRawBody = (req) =>
  new Promise((resolve, reject) => {
    const chunks = [];
    req.on('data', (c) => chunks.push(c));
    req.on('end', () => resolve(Buffer.concat(chunks).toString('utf8')));
    req.on('error', reject);
  });

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const rawBody = await getRawBody(req);
    const { code } = JSON.parse(rawBody);

    if (!code || typeof code !== 'string') {
      return res.status(400).json({ valid: false, error: 'Código inválido' });
    }

    const promoCodes = await stripe.promotionCodes.list({
      code: code.trim().toUpperCase(),
      active: true,
      limit: 1,
    });

    if (promoCodes.data.length === 0) {
      return res.status(200).json({ valid: false, error: 'Cupom não encontrado ou expirado' });
    }

    const promo = promoCodes.data[0];
    const coupon = promo.coupon;

    return res.status(200).json({
      valid: true,
      promoId: promo.id,
      percentOff: coupon.percent_off ?? null,
      amountOff: coupon.amount_off ?? null,
      name: coupon.name || code.trim().toUpperCase(),
    });
  } catch (err) {
    console.error('Coupon validation error:', err);
    return res.status(500).json({ valid: false, error: 'Erro ao validar cupom' });
  }
}
