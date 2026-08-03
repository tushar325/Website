/**
 * In-memory live purchase feed for online social-proof popups.
 * Events are short-lived (not durable) — enough for users currently browsing.
 */
const MAX_EVENTS = 40;
const TTL_MS = 15 * 60 * 1000;
const events = [];

function prune(now = Date.now()) {
  while (events.length && (now - events[0].at > TTL_MS || events.length > MAX_EVENTS)) {
    events.shift();
  }
}

function normalizeEvent(input = {}) {
  const username = String(input.username || input.buyerName || input.name || 'A customer').trim().slice(0, 60) || 'A customer';
  const productName = String(input.productName || input.product || 'a product').trim().slice(0, 120) || 'a product';
  const productImage = String(input.productImage || input.imageUrl || '').trim().slice(0, 500);
  const buyerId = String(input.buyerId || input.userId || '').trim().slice(0, 80);
  const productId = String(input.productId || '').trim().slice(0, 80);
  const orderId = String(input.orderId || '').trim().slice(0, 80);
  return {
    id: String(input.id || `lp-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`),
    username,
    productName,
    productImage,
    productId,
    buyerId,
    orderId,
    at: Number(input.at) || Date.now()
  };
}

function publishLivePurchase(input) {
  const event = normalizeEvent(input);
  events.push(event);
  prune(event.at);
  return event;
}

function listLivePurchases(since = 0) {
  prune();
  const cutoff = Number(since) || 0;
  return events.filter((event) => event.at > cutoff);
}

module.exports = function livePurchasesRouter() {
  const express = require('express');
  const router = express.Router();

  router.get('/', (req, res) => {
    const since = Number(req.query.since || 0) || 0;
    res.setHeader('Cache-Control', 'no-store');
    res.json({
      serverTime: Date.now(),
      events: listLivePurchases(since)
    });
  });

  router.post('/', (req, res) => {
    const body = req.body || {};
    if (!body.productName && !body.product && !Array.isArray(body.items)) {
      return res.status(400).json({ error: 'productName or items required' });
    }

    const published = [];
    if (Array.isArray(body.items) && body.items.length) {
      body.items.slice(0, 6).forEach((item) => {
        published.push(publishLivePurchase({
          ...body,
          productName: item.name || item.productName,
          productId: item.id || item.productId,
          productImage: item.imageUrl || item.productImage,
          id: undefined
        }));
      });
    } else {
      published.push(publishLivePurchase(body));
    }

    res.status(201).json({ events: published });
  });

  // Expose helpers for other routes (e.g. orders)
  router.publish = publishLivePurchase;
  router.list = listLivePurchases;

  return router;
};

module.exports.publishLivePurchase = publishLivePurchase;
module.exports.listLivePurchases = listLivePurchases;
