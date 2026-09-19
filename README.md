# Stellar Burgers

**Stellar Burgers** is a React application for building and ordering custom burgers.

**Live Demo:** https://stellar-burgers-beta.vercel.app/

The application includes authentication, protected routes, global state management, REST API integration, real-time order feeds via WebSocket, profile management, order history, and automated testing.

## Project Context

Educational project completed as part of the **Yandex Practicum Frontend Developer** program.

The main goal of the project was to build a production-like React application and practice working with:

- React application architecture;
- routing;
- authentication and authorization;
- global state management;
- REST API integration;
- WebSocket connections;
- asynchronous operations;
- protected routes;
- automated testing.

## Features

- Build a custom burger from buns, sauces, and fillings
- Calculate the total order price in real time
- View ingredient details in modal windows
- Register a new user
- Sign in and sign out
- Access protected profile routes
- Edit profile information
- Create authenticated orders
- View a public order feed
- View personal order history
- Open order details through dynamic routes
- Receive real-time order updates through WebSocket
- Automatically refresh expired access tokens
- Clear the burger constructor after a successful order
- Use a standalone portfolio demo fallback when the external backend is unavailable

## Portfolio Demo Mode

The original project depends on external Yandex Practicum REST API and WebSocket services.

Because those services may be unavailable or unstable, this portfolio version includes a standalone demo fallback.

If the external backend cannot be reached:

- ingredients are loaded from local demo data;
- the public order feed uses local demo orders;
- authentication falls back to a local demo session;
- orders can be created locally;
- demo orders are stored in `localStorage`;
- WebSocket reconnect attempts are limited to avoid endless error loops.

The application keeps the original React, Redux Toolkit, routing, testing, and API architecture while remaining usable for portfolio review without the external backend.

## Tech Stack

### Frontend

- React 18
- TypeScript
- Redux Toolkit
- React Redux
- React Router DOM
- CSS Modules
- clsx

### Data & Networking

- REST API
- WebSocket
- `createAsyncThunk`
- Token-based authentication
- Access token refresh logic

### Testing

- Jest
- Cypress
- Test fixtures
- Code coverage

### Tooling

- Webpack 5
- ESLint
- Prettier
- Storybook
- npm

## State Management

Global application state is managed with **Redux Toolkit**.

The Redux store is split into separate slices responsible for different parts of the application:

- ingredients
- burger constructor
- order creation
- public order feed
- user order history
- user profile
- order details

Asynchronous API requests are implemented using `createAsyncThunk`.

This separation keeps the application state predictable and makes individual parts of the store easier to maintain and test.

## Authentication and Protected Routes

The application supports:

- user registration
- user login
- user logout
- access token refresh
- protected routes
- profile editing

A custom token refresh mechanism is implemented through `fetchWithRefresh`.

Protected routes prevent unauthenticated users from accessing private profile pages.

## Real-Time Updates

The application uses **WebSocket** connections to display order data in real time.

WebSocket functionality is used for:

- the public order feed
- personal order history
- live order updates

This allows order information to update without manually refreshing the page.

## Routing

Routing is implemented with `react-router-dom`.

The application includes:

- public routes
- protected routes
- nested profile routes
- dynamic ingredient routes
- dynamic order routes

Ingredient and order details can be opened either:

- inside a modal window;
- as a standalone page through direct navigation.

This approach allows the same content to work both as an overlay during normal navigation and as a separate page when opening a direct URL.

## Testing

The project uses both **unit testing** and **end-to-end testing**.

### Jest

Jest is used to test Redux reducers and application state logic.

Covered scenarios include:

- `rootReducer`
- burger constructor slice
- ingredients slice states

Burger constructor tests cover:

- adding ingredients
- removing ingredients
- changing ingredient order

Ingredient slice tests cover asynchronous states:

- `pending`
- `fulfilled`
- `rejected`

### Cypress

Cypress is used for end-to-end user scenarios.

Covered flows include:

- adding a bun to the burger constructor
- adding ingredients to the constructor
- opening ingredient details
- closing modal windows
- closing modal windows by clicking on the overlay
- creating an order
- verifying the returned order number
- clearing the constructor after successful order creation

## Project Structure

```text
src/
├── components/        React components and UI wrappers
├── pages/             Application pages
├── services/          Redux store, slices, selectors, middleware and WS actions
├── utils/             API helpers, cookies and shared types
└── test/              Jest mocks and test utilities

cypress/
├── e2e/               End-to-end tests
├── fixtures/          Mock data
└── support/           Cypress configuration and helpers
```

## Environment Variables

The application requires an API URL.

Create a `.env` file in the project root:

```env
BURGER_API_URL=https://norma.education-services.ru/api
```

You can also copy the provided example file:

```bash
cp .env.example .env
```

## Installation

Clone the repository:

```bash
git clone https://github.com/RepinDM/stellar-burgers.git
```

Navigate to the project directory:

```bash
cd stellar-burgers
```

Install dependencies:

```bash
npm install
```

Create the environment file:

```bash
cp .env.example .env
```

Start the development server:

```bash
npm start
```

The application runs locally at:

```text
http://localhost:4000
```

## Available Scripts

### Development

```bash
npm start
```

Starts the local development server.

### Production Build

```bash
npm run build
```

Creates a production build in the `dist` directory.

### Lint

```bash
npm run lint
```

Runs ESLint.

### Lint Fix

```bash
npm run lint:fix
```

Automatically fixes supported linting issues.

### Formatting

```bash
npm run format
```

Formats the project using Prettier.

### Jest

```bash
npm test
```

Runs Jest tests.

### Test Coverage

```bash
npm run test:coverage
```

Generates the Jest coverage report.

### Cypress UI

```bash
npm run cypress:open
```

Opens the Cypress Test Runner.

### Cypress Headless

```bash
npm run cypress:run
```

Runs Cypress tests in headless mode.

## Quality Checks

The project can be validated using the following commands:

```bash
npm run lint
npm run build
npm test -- --runInBand
npm run test:coverage -- --runInBand
npm run cypress:run
```

These checks cover:

- code quality
- production build
- Redux unit tests
- test coverage
- end-to-end scenarios

## Design

The interface was implemented based on a Figma design provided as part of the Yandex Practicum project.

### Figma Design

[Open the design in Figma](https://www.figma.com/file/vIywAvqfkOIRWGOkfOnReY/React-Fullstack_-Проектные-задачи-\(3-месяца\)_external_link?type=design&node-id=0-1&mode=design)

## Future Improvements

Possible improvements for the project:

- Restore full integration with a stable production backend
- Replace demo authentication with a production authentication service
- Add CI checks for ESLint, Jest, Cypress, and production builds
- Expand unit and end-to-end test coverage
- Add accessibility and performance checks

## Author

**Dmitry Repin**

Frontend Developer
