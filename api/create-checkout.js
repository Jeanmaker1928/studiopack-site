import Stripe from 'stripe';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

const PACK_NAMES = {
  'lendas-do-basquete': 'Lendas do Basquete',
  'lendas-do-futebol': 'Lendas do Futebol',
  'lendas-do-rock': 'Lendas Do Rock',
  'anime': 'Anime Pack',
};

const PRICE_CENTS = 6490;      // R$ 64,90
const BUMP_PRICE_CENTS = 3245; // R$ 32,45

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
    const { mainPackSlug, bumpPackSlug } = JSON.parse(rawBody);

    if (!mainPackSlug || !PACK_NAMES[mainPackSlug]) {
      return res.status(400).json({ error: 'Pack inválido' });
    }

    const lineItems = [
      {
        price_data: {
          currency: 'brl',
          product_data: {
            name: PACK_NAMES[mainPackSlug],
            description: 'Studio Pack – Estampas Halftone em alta resolução',
          },
          unit_amount: PRICE_CENTS,
        },
        quantity: 1,
      },
    ];

    if (bumpPackSlug && PACK_NAMES[bumpPackSlug] && bumpPackSlug !== mainPackSlug) {
      lineItems.push({
        price_data: {
          currency: 'brl',
          product_data: {
            name: `${PACK_NAMES[bumpPackSlug]} – 50% OFF`,
            description: 'Oferta especial Studio Pack',
          },
          unit_amount: BUMP_PRICE_CENTS,
        },
        quantity: 1,
      });
    }

    const siteUrl = process.env.SITE_URL || 'https://studiopackhalftone.com';

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items: lineItems,
      mode: 'payment',
      success_url: `${siteUrl}/sucesso?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${siteUrl}/pack/${mainPackSlug}`,
      metadata: {
        mainPackSlug,
        bumpPackSlug: bumpPackSlug || '',
      },
      locale: 'pt-BR',
    });

    res.status(200).json({ url: session.url });
  } catch (err) {
    console.error('Checkout error:', err);
    res.status(500).json({ error: 'Erro ao criar checkout' });
  }
}
