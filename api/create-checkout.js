import Stripe from 'stripe';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

const PACK_NAMES = {
  'lendas-do-basquete': 'Lendas do Basquete',
  'lendas-do-futebol': 'Lendas do Futebol',
  'lendas-do-rock': 'Lendas Do Rock',
  'anime': 'Anime Pack',
};

const PRICE_FULL = 6490;  // R$ 64,90
const PRICE_BUMP = 3245;  // R$ 32,45 (50% off)

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
    const { packSlug } = JSON.parse(rawBody);

    if (!packSlug || !PACK_NAMES[packSlug]) {
      return res.status(400).json({ error: 'Pack inválido' });
    }

    const siteUrl = process.env.SITE_URL || 'https://studiopackhalftone.com';

    const session = await stripe.checkout.sessions.create({
      ui_mode: 'embedded_page',
      payment_method_types: ['card'],
      line_items: [
        {
          price_data: {
            currency: 'brl',
            product_data: {
              name: PACK_NAMES[packSlug],
              description: 'Studio Pack – Estampas Halftone em alta resolução',
            },
            unit_amount: PRICE_FULL,
          },
          quantity: 1,
        },
      ],
      mode: 'payment',
      return_url: `${siteUrl}/sucesso?session_id={CHECKOUT_SESSION_ID}`,
      metadata: {
        cartItems: JSON.stringify([packSlug]),
      },
    });

    res.status(200).json({ url: session.url, id: session.id, ui_mode: session.ui_mode, keys: Object.keys(session) });
  } catch (err) {
    console.error('Checkout error:', err);
    res.status(500).json({ error: err.message || 'Erro ao criar checkout' });
  }
}
