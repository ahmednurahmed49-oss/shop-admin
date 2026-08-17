# ShopAdmin — E-Commerce Administration Portal

A responsive single-page administrator portal for managing an e-commerce product catalogue. The application provides dashboard statistics, product search and filtering, product management, and full CRUD functionality through a REST API.

## Features

* Dashboard with dynamically calculated statistics:

  * Total products
  * In-stock products
  * Low-stock products
  * Out-of-stock products
* Product list with live search

  * Search by product name
  * Search by category
  * Search by description
* Product filtering

  * Category filter
  * Stock-status filter
* Product details page
* Add new products
* Edit existing products
* Delete products with confirmation dialog
* Controlled forms with client-side validation
* Loading states
* Error states
* Empty states
* Toast notifications
* Custom React hooks:

  * `useProducts`
  * `useFetch`
  * `useForm`
* Centralised API service layer
* Responsive layout:

  * Mobile cards
  * Tablet 2-column layout
  * Desktop 3-column layout
* Accessible HTML markup
* Client-side routing with React Router DOM
* Automated testing with Vitest and React Testing Library

## Technologies

* React 19
* JavaScript / JSX
* React Router DOM
* Tailwind CSS
* Vite
* JSON Server
* Vitest
* React Testing Library
* `@testing-library/jest-dom`
* `@testing-library/user-event`
* Sonner for toast notifications
* Lucide React for icons

## Installation

Clone the repository and install the dependencies:

```bash
npm install
```

## Run the Frontend

Start the Vite development server:

```bash
npm run dev
```

The application will normally be available at:

```text
http://localhost:5173
```

## Run the Backend

The application uses JSON Server as a lightweight REST API for product data.

Start the backend with:

```bash
npm run server
```

JSON Server runs on:

```text
http://localhost:3000
```

The API is backed by `db.json`.

### API Configuration

Create a `.env` file in the project root:

```env
VITE_API_URL=http://localhost:3000
```

The frontend then communicates with the JSON Server API.

## API Endpoints

| Method | Endpoint        | Description               |
| ------ | --------------- | ------------------------- |
| GET    | `/products`     | Retrieve all products     |
| GET    | `/products/:id` | Retrieve a single product |
| POST   | `/products`     | Create a product          |
| PATCH  | `/products/:id` | Update a product          |
| PUT    | `/products/:id` | Replace a product         |
| DELETE | `/products/:id` | Delete a product          |

## Testing

The project includes an automated test suite using Vitest and React Testing Library.

Run the tests once:

```bash
npm test
```

Run tests in watch mode:

```bash
npm run test:watch
```

Run tests with coverage:

```bash
npm run test:coverage
```

The test suite covers:

* Dashboard rendering
* Product rendering
* Product searching
* Product filtering
* Product creation
* Product editing
* Product deletion
* Product details
* Form validation
* Application routing

Tests mock API requests, making the test suite deterministic and independent of a running JSON Server instance.

## Production Build

Create an optimized production build:

```bash
npm run build
```

Preview the production build locally:

```bash
npm run preview
```

## Project Structure

```text
src/
├── assets/
│   ├── hero.png
│   ├── react.svg
│   └── vite.svg
│
├── components/
│   ├── ConfirmDialog.jsx
│   ├── FilterBar.jsx
│   ├── Navbar.jsx
│   ├── ProductCard.jsx
│   ├── ProductForm.jsx
│   ├── ProductList.jsx
│   ├── SearchBar.jsx
│   └── ui-kit.jsx
│
├── data/
│   └── products.js
│
├── hooks/
│   ├── use-mobile.jsx
│   ├── useFetch.js
│   ├── useForm.js
│   └── useProducts.js
│
├── lib/
│   ├── format.js
│   ├── seed-products.js
│   └── utils.js
│
├── pages/
│   ├── AddProduct.jsx
│   ├── Dashboard.jsx
│   ├── EditProduct.jsx
│   ├── NotFound.jsx
│   ├── ProductDetail.jsx
│   └── Products.jsx
│
├── services/
│   └── productService.js
│
├── test/
│   ├── Dashboard.test.jsx
│   ├── EditProduct.test.jsx
│   ├── ProductDetails.test.jsx
│   ├── ProductForm.test.jsx
│   ├── Products.test.jsx
│   ├── routing.test.jsx
│   ├── setup.js
│   └── test-utils.jsx
│
├── App.jsx
├── index.css
└── main.jsx
```

## Architecture

The application follows a layered React architecture:

```text
Pages
   ↓
Components
   ↓
Custom Hooks
   ↓
Service Layer
   ↓
REST API
   ↓
JSON Server
   ↓
db.json
```

This separation keeps the application maintainable and makes API operations easier to manage and test.

## CRUD Operations

### Retrieve All Products

```text
useProducts()
      ↓
productService.getProducts()
      ↓
GET /products
```

### Retrieve One Product

```text
useFetch()
      ↓
productService.getProduct(id)
      ↓
GET /products/:id
```

### Create Product

```text
ProductForm
      ↓
createProduct()
      ↓
productService.createProduct()
      ↓
POST /products
```

### Update Product

```text
ProductForm
      ↓
updateProduct()
      ↓
productService.updateProduct()
      ↓
PATCH /products/:id
```

### Delete Product

```text
ConfirmDialog
      ↓
deleteProduct()
      ↓
productService.deleteProduct()
      ↓
DELETE /products/:id
```

When JSON Server is running, product changes are persisted to `db.json`. This means changes remain available after refreshing the application.

## Application Routes

| Route                | Page                             |
| -------------------- | -------------------------------- |
| `/`                  | Dashboard                        |
| `/products`          | Product list, search and filters |
| `/products/new`      | Add product                      |
| `/products/:id`      | Product details                  |
| `/products/:id/edit` | Edit product                     |
| `*`                  | 404 — Page not found             |

## Search and Filtering

The Products page supports real-time product searching and filtering.

Users can search products by:

* Product name
* Category
* Description

Products can also be filtered by:

* Category
* Stock status

The filtering happens dynamically as the user interacts with the interface.

## Form Validation

Product forms use controlled React inputs and client-side validation.

Validation includes:

* Required product fields
* Valid product prices
* Valid stock quantities
* Required category information
* Valid product descriptions

Invalid submissions are prevented and appropriate feedback is displayed to the user.

## Responsive Design

The application is designed to work across different screen sizes.

### Mobile

Products are displayed as individual cards in a single-column layout.

### Tablet

Products use a two-column grid.

### Desktop

Products use a three-column grid for efficient catalogue browsing.

## Git Workflow

The project can be developed using feature branches that are merged into `main`.

Recommended branches:

```text
feature/project-setup
feature/dashboard
feature/products
feature/crud
feature/routing
feature/testing
```

### Feature Branches

* `feature/project-setup` — project tooling, base structure and design system
* `feature/dashboard` — dashboard statistics and navigation
* `feature/products` — product list, cards, search and filters
* `feature/crud` — service layer, hooks, API integration and product persistence
* `feature/routing` — application routes and navigation
* `feature/testing` — Vitest and React Testing Library tests

## Available NPM Commands

| Command                 | Description                   |
| ----------------------- | ----------------------------- |
| `npm run dev`           | Start Vite development server |
| `npm run server`        | Start JSON Server             |
| `npm run build`         | Create production build       |
| `npm run preview`       | Preview production build      |
| `npm run lint`          | Run ESLint                    |
| `npm test`              | Run automated tests           |
| `npm run test:watch`    | Run tests in watch mode       |
| `npm run test:coverage` | Generate test coverage        |

## Future Improvements

Potential future enhancements include:

* Admin authentication
* Role-based access control
* Product image uploads
* Product pagination
* Advanced product sorting
* Dark mode
* CSV product export
* Product categories management
* Sales analytics
* Order management
* User management
* Cloud database integration
* Production deployment

## Author

**Timothy Koigi**

Full Stack Web & Application Developer

Technologies and tools:

```text
React • JavaScript • Tailwind CSS • Flask • MySQL • REST APIs
```

## License

This project is intended for educational and portfolio purposes.
