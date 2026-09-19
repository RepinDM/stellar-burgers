# Stellar Burgers

Stellar Burgers is a React application for building and ordering custom burgers.

The application includes authentication, protected routes, global state management, REST API integration, real-time order feeds via WebSocket, profile management, order history, and automated testing.

## Project Context

Educational project completed as part of the Yandex Practicum Frontend Developer program.

The main goal of the project was to build a production-like React application with routing, authentication, global state management, API integration, real-time data, and automated tests.

## Features

- Build a custom burger from buns, sauces, and fillings
- Calculate the total order price in real time
- View ingredient details in modal windows
- Register, sign in, and sign out
- Access protected profile routes
- Edit profile information
- Create authenticated orders
- View a public order feed
- View personal order history
- Open order details through dynamic routes
- Receive real-time order updates through WebSocket
- Automatically refresh expired access tokens
- Clear the burger constructor after a successful order

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
- token-based authentication
- access token refresh logic

### Testing

- Jest
- Cypress
- test fixtures
- code coverage

### Tooling

- Webpack 5
- ESLint
- Prettier
- Storybook
- npm

## State Management

Global application state is managed with Redux Toolkit.

The store is split into separate slices responsible for:

- ingredients
- burger constructor
- order creation
- public order feed
- user order history
- user profile
- order details

Asynchronous API requests are implemented with `createAsyncThunk`.

This separation keeps application state predictable and makes individual parts of the store easier to test and maintain.

## Authentication and Protected Routes

The application supports:

- user registration
- user login
- user logout
- access token refresh
- protected routes
- profile editing

A custom token refresh mechanism is implemented through `fetchWithRefresh`.

Protected routes prevent unauthenticated users from opening private profile pages.

## Real-Time Updates

The application uses WebSocket connections to display real-time order data.

WebSocket functionality is used for:

- the public order feed
- personal order history
- live order updates

This allows order information to update without manual page refreshes.

## Routing

Routing is implemented with `react-router-dom`.

The application includes:

- public routes
- protected routes
- nested profile routes
- dynamic ingredient routes
- dynamic order routes

Ingredient and order details can be opened either:

- inside a modal window
- as a standalone page through direct navigation

## Testing

The project uses both unit and end-to-end testing.

### Jest

Jest is used to test Redux logic and reducers.

Covered scenarios include:

- `rootReducer`
- burger constructor slice
- ingredient slice states

Burger constructor tests include:

- adding ingredients
- removing ingredients
- changing ingredient order

Ingredient slice tests include:

- `pending`
- `fulfilled`
- `rejected`

### Cypress

Cypress is used for end-to-end user scenarios.

Covered flows include:

- adding a bun and ingredients to the constructor
- opening ingredient details
- closing modals
- closing modals by overlay click
- creating an order
- verifying the returned order number
- clearing the constructor after order creation

## Project Structure

```text
src/
├── components/        React components and UI wrappers
├── pages/             Application pages
├── services/          Redux store, slices, selectors, middleware, ws actions
├── utils/             API helpers, cookies, shared types
└── test/              Jest mocks and test utilities

cypress/
├── e2e/               End-to-end tests
├── fixtures/          Mock data
└── support/           Cypress configuration and helpers
Environment Variables
The application requires an API URL.
Create a .env file in the project root:
BURGER_API_URL=https://norma.education-services.ru/api
You can also copy the provided example file:
cp .env.example .env
Installation
Clone the repository:
git clone https://github.com/RepinDM/stellar-burgers.git
cd stellar-burgers
Install dependencies:
npm install
Create the environment file:
cp .env.example .env
Start the development server:
npm start
The application runs locally at:
http://localhost:4000
Available Scripts
Development
npm start
Starts the local development server.
Production Build
npm run build
Creates a production build in the dist directory.
Lint
npm run lint
Runs ESLint.
Lint Fix
npm run lint:fix
Automatically fixes supported linting issues.
Formatting
npm run format
Formats the project with Prettier.
Jest
npm test
Runs Jest tests.
Test Coverage
npm run test:coverage
Generates the Jest coverage report.
Cypress UI
npm run cypress:open
Opens the Cypress test runner.
Cypress Headless
npm run cypress:run
Runs Cypress tests in headless mode.
Quality Checks
The project can be validated with:
npm run lint
npm run build
npm test -- --runInBand
npm run test:coverage -- --runInBand
npm run cypress:run
These checks cover:
- code quality
- production build
- Redux unit tests
- coverage reporting
- end-to-end scenarios
Design
The interface was implemented based on a Figma design provided as part of the Yandex Practicum project.
Figma Design
Future Improvements
- Increase unit test coverage for the remaining Redux slices
- Add CI checks for linting, Jest, and Cypress
- Add deployment configuration for a public live demo
- Add accessibility checks
- Improve architecture documentation
- Add performance monitoring
