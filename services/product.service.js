/**
 * Product Service
 * Replace in-memory store with your DB layer (Prisma, Sequelize, etc.)
 */

let products = [
  { id: "1", name: "iPhone 15 Pro", category: "Electronics", brand: "Apple", sku: "APL-IP15P-256", createdAt: new Date().toISOString() },
  { id: "2", name: "Samsung Galaxy S24", category: "Electronics", brand: "Samsung", sku: "SAM-GS24-128", createdAt: new Date().toISOString() },
  { id: "3", name: "Sony WH-1000XM5", category: "Audio", brand: "Sony", sku: "SNY-WH1000XM5", createdAt: new Date().toISOString() },
];

let nextId = 4;

const findAll = async ({ page = 1, limit = 20, category } = {}) => {
  let results = [...products];
  if (category) results = results.filter((p) => p.category.toLowerCase() === category.toLowerCase());
  const start = (page - 1) * limit;
  return {
    items: results.slice(start, start + limit),
    total: results.length,
    page,
    limit,
    totalPages: Math.ceil(results.length / limit),
  };
};

const findById = async (id) => products.find((p) => p.id === id) || null;

const search = async (query) => {
  const q = query.toLowerCase();
  return products.filter(
    (p) => p.name.toLowerCase().includes(q) || p.brand.toLowerCase().includes(q) || p.category.toLowerCase().includes(q)
  );
};

const create = async (data) => {
  const product = { id: String(nextId++), ...data, createdAt: new Date().toISOString() };
  products.push(product);
  return product;
};

const update = async (id, data) => {
  const index = products.findIndex((p) => p.id === id);
  if (index === -1) return null;
  products[index] = { ...products[index], ...data, updatedAt: new Date().toISOString() };
  return products[index];
};

const remove = async (id) => {
  const index = products.findIndex((p) => p.id === id);
  if (index === -1) return false;
  products.splice(index, 1);
  return true;
};

module.exports = { findAll, findById, search, create, update, remove };
