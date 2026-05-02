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
    const { items, promotionCodeId } = JSON.parse(rawBody);

    if (!items || !Array.isArray(items) || items.length === 0) {
      return res.status(400).json({ error: 'Carrinho vazio' });
    }

    for (const item of items) {
      if (!item.slug || !PACK_NAMES[item.slug]) {
        return res.status(400).json({ error: `Pack inválido: ${item.slug}` });
      }
    }

    const siteUrl = process.env.SITE_URL || 'https://studiopackhalftone.com';

    const line_items = items.map(item => ({
      price_data: {
        currency: 'brl',
        product_data: {
          name: PACK_NAMES[item.slug],
          description: 'Studio Pack – Estampas Halftone em alta resolução',
        },
        unit_amount: item.price,
      },
      quantity: 1,
    }));

    const session = await stripe.checkout.sessions.create({
      ui_mode: 'embedded_page',
      payment_method_types: ['card', 'boleto'],
      line_items,
      mode: 'payment',
      billing_address_collection: 'required',
      ...(promotionCodeId
        ? { discounts: [{ promotion_code: promotionCodeId }] }
        : { allow_promotion_codes: true }
      ),
      return_url: `${siteUrl}/sucesso?session_id={CHECKOUT_SESSION_ID}`,
      metadata: {
        cartItems: JSON.stringify(items.map(i => i.slug)),
      },
    });

    res.status(200).json({ clientSecret: session.client_secret });
  } catch (err) {
    console.error('Checkout error:', err);
    res.status(500).json({ error: err.message || 'Erro ao criar checkout' });
  }
}
