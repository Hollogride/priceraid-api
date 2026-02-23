/**
 * Store Service
 * Replace in-memory store with your DB layer.
 */

let stores = [
  { id: "s1", name: "BestBuy", website: "https://bestbuy.com", country: "US", active: true, createdAt: new Date().toISOString() },
  { id: "s2", name: "Amazon", website: "https://amazon.com", country: "US", active: true, createdAt: new Date().toISOString() },
  { id: "s3", name: "Walmart", website: "https://walmart.com", country: "US", active: true, createdAt: new Date().toISOString() },
];

let nextId = 4;

const findAll = async () => [...stores];

const findById = async (id) => stores.find((s) => s.id === id) || null;

const create = async (data) => {
  const store = { id: `s${nextId++}`, ...data, createdAt: new Date().toISOString() };
  stores.push(store);
  return store;
};

const update = async (id, data) => {
  const index = stores.findIndex((s) => s.id === id);
  if (index === -1) return null;
  stores[index] = { ...stores[index], ...data, updatedAt: new Date().toISOString() };
  return stores[index];
};

const remove = async (id) => {
  const index = stores.findIndex((s) => s.id === id);
  if (index === -1) return false;
  stores.splice(index, 1);
  return true;
};

module.exports = { findAll, findById, create, update, remove };
