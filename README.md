# Price Comparison API

A modular Express.js backend for a price comparison application.

## Folder Structure

```
price-comparison-api/
├── logs/                          # Log output files
├── src/
│   ├── app.js                     # Entry point
│   ├── config/
│   │   ├── index.js               # App config from env vars
│   │   └── logger.js              # Winston logger setup
│   ├── controllers/
│   │   ├── health.controller.js
│   │   ├── product.controller.js
│   │   ├── price.controller.js
│   │   └── store.controller.js
│   ├── middleware/
│   │   ├── error.middleware.js    # 404 + global error handler
│   │   ├── jsonOnly.middleware.js # Enforce JSON responses
│   │   └── logger.middleware.js   # Morgan HTTP request logger
│   ├── routes/
│   │   ├── health.routes.js
│   │   ├── product.routes.js
│   │   ├── price.routes.js
│   │   └── store.routes.js
│   └── services/
│       ├── product.service.js     # Business logic (in-memory stub)
│       ├── price.service.js
│       └── store.service.js
├── .env
├── .env.example
├── .gitignore
└── package.json
```

## Setup

```bash
npm install
cp .env.example .env   # fill in your values
npm run dev            # development with nodemon
npm start              # production
```

## Endpoints

### Health
| Method | Path | Description |
|--------|------|-------------|
| GET | `/health` | Liveness check |
| GET | `/health/ready` | Readiness check |

### Products
| Method | Path | Description |
|--------|------|-------------|
| GET | `/api/v1/products` | List all (supports `?page`, `?limit`, `?category`) |
| GET | `/api/v1/products/search?q=` | Search products |
| GET | `/api/v1/products/:id` | Get by ID |
| POST | `/api/v1/products` | Create |
| PUT | `/api/v1/products/:id` | Update |
| DELETE | `/api/v1/products/:id` | Delete |

### Prices
| Method | Path | Description |
|--------|------|-------------|
| GET | `/api/v1/prices/product/:productId` | All prices for a product |
| GET | `/api/v1/prices/product/:productId/lowest` | Lowest in-stock price |
| GET | `/api/v1/prices/compare?productIds=1,2,3` | Compare multiple products |
| GET | `/api/v1/prices/product/:productId/history?days=30` | Price history |

### Stores
| Method | Path | Description |
|--------|------|-------------|
| GET | `/api/v1/stores` | List all stores |
| GET | `/api/v1/stores/:id` | Get by ID |
| POST | `/api/v1/stores` | Create |
| PUT | `/api/v1/stores/:id` | Update |
| DELETE | `/api/v1/stores/:id` | Delete |

## Response Format

All responses follow this JSON envelope:

```json
{ "success": true, "data": { ... } }
{ "success": false, "error": { "message": "..." } }
```
