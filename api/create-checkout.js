import Stripe from 'stripe';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

const PACK_NAMES = {
  'lendas-do-basquete': 'Lendas do Basquete',
  'lendas-do-futebol': 'Lendas do Futebol',
  'lendas-do-rock': 'Lendas Do Rock',
  'anime': 'Anime Pack',
};

const PRICE_FULL = 6490;  // R$ 64,90 — primeiro pack
const PRICE_BUMP = 3245;  // R$ 32,45 — demais packs (50% off)

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
    const { cartItems } = JSON.parse(rawBody);

    if (!cartItems || !Array.isArray(cartItems) || cartItems.length === 0) {
      return res.status(400).json({ error: 'Carrinho vazio' });
    }

    const validItems = cartItems.filter((slug) => PACK_NAMES[slug]);
    if (validItems.length === 0) {
      return res.status(400).json({ error: 'Nenhum pack válido' });
    }

    // Primeiro pack: preço cheio. Demais: 50% off.
    const lineItems = validItems.map((slug, index) => ({
      price_data: {
        currency: 'brl',
        product_data: {
          name: index === 0
            ? PACK_NAMES[slug]
            : `${PACK_NAMES[slug]} – 50% OFF`,
          description: 'Studio Pack – Estampas Halftone em alta resolução',
        },
        unit_amount: index === 0 ? PRICE_FULL : PRICE_BUMP,
      },
      quantity: 1,
    }));

    const siteUrl = process.env.SITE_URL || 'https://studiopackhalftone.com';

    const session = await stripe.checkout.sessions.create({
      payment_method_configuration: 'default',
      line_items: lineItems,
      mode: 'payment',
      success_url: `${siteUrl}/sucesso?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${siteUrl}/packs`,
      metadata: {
        cartItems: JSON.stringify(validItems),
      },
      locale: 'pt-BR',
    });

    res.status(200).json({ url: session.url });
  } catch (err) {
    console.error('Checkout error:', err);
    res.status(500).json({ error: 'Erro ao criar checkout' });
  }
}
