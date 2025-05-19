# Tax Calculator Frontend

This is the frontend application for the tax calculator. It is built using:

*   React
*   TypeScript
*   Vite
*   Plain CSS

## Backend Requirement

For the frontend to work, you must have the backend API running locally.

To start the backend:

```sh
docker pull ptsdocker16/interview-test-server
docker run --init -p 5001:5001 -it ptsdocker16/interview-test-server
```

Once running, the API will be available at [http://localhost:5001](http://localhost:5001), with key endpoints:
- `/tax-calculator/` — main development endpoint
- `/tax-calculator/tax-year/2022` — assessment endpoint

If you have any issues, contact the engineering hiring manager for assistance.

## Getting Started

To get the frontend running locally, follow these steps:

1.  **Navigate to the frontend directory:**
    ```bash
    cd tax-calculator-frontend
    ```
2.  **Install dependencies:**
    ```bash
    npm install
    ```
3.  **Start the development server:**
    ```bash
    npm run dev
    ```
    The application should now be running at `http://localhost:5173` (or another port if 5173 is in use).

    **Note:** This development server is configured with a proxy in `vite.config.ts` to forward API requests to the backend, helping to avoid CORS issues during development. This proxy is not used in the production build.

## Running Tests

Unit and integration tests are included and can be run using Jest and React Testing Library.

To run the tests:

```bash
npm test
```

## API Interaction

This frontend interacts with the backend tax calculator API, specifically the `/tax-calculator/tax-year/:year` endpoint, to fetch tax bracket information.

## Project Structure

The project follows a standard structure:
*   `src/components`: Contains React components.
*   `src/hooks`: Contains custom React hooks.
*   `src/utils`: Contains utility functions (e.g., tax calculation, validation).
