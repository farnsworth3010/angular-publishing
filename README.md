# AngularPublishing

This project was generated using [Angular CLI](https://github.com/angular/angular-cli) version 20.3.1.

## Development server

To start a local development server, run:

```bash
ng serve
```

Once the server is running, open your browser and navigate to `http://localhost:4200/`. The application will automatically reload whenever you modify any of the source files.

## Code scaffolding

Angular CLI includes powerful code scaffolding tools. To generate a new component, run:

```bash
ng generate component component-name
```

For a complete list of available schematics (such as `components`, `directives`, or `pipes`), run:

```bash
ng generate --help
```

## Building

To build the project run:

```bash
ng build
```

This will compile your project and store the build artifacts in the `dist/` directory. By default, the production build optimizes your application for performance and speed.

## Running unit tests

To execute unit tests with the [Karma](https://karma-runner.github.io) test runner, use the following command:

```bash
ng test
```

## Running end-to-end tests

For end-to-end (e2e) testing, run:

```bash
ng e2e
```

Angular CLI does not come with an end-to-end testing framework by default. You can choose one that suits your needs.

## Additional Resources

For more information on using the Angular CLI, including detailed command references, visit the [Angular CLI Overview and Command Reference](https://angular.dev/tools/cli) page.

## Authentication

### Standard sign-in

Users sign in at `/auth/sign-in` with email and password. The backend returns a JWT which is stored in `localStorage` under the key `token` and held in `AuthStore` (ngrx signals). A guest mode is also available that bypasses authentication.

### Google OAuth

The app supports sign-in via Google OAuth 2.0 using a redirect flow:

1. The user clicks **Continue with Google** on the sign-in page.
2. The browser is redirected to `GET /auth/google` on the backend, which redirects to Google's consent screen.
3. After the user authenticates, Google redirects back to the backend callback (`/auth/google/callback`).
4. The backend exchanges the code for a token, finds or creates the user, and redirects the browser to:
   ```
   http://localhost:4200/auth/callback?token=<JWT>
   ```
5. The Angular `GoogleCallback` component (`/auth/callback`) reads the token from the URL, stores it in `AuthStore`, and navigates to `/`.

The JWT returned by Google OAuth is identical in format to the standard sign-in JWT and is used the same way.

#### Required backend environment variables

| Variable | Description |
|---|---|
| `GOOGLE_CLIENT_ID` | OAuth 2.0 Client ID from Google Cloud Console |
| `GOOGLE_CLIENT_SECRET` | OAuth 2.0 Client Secret from Google Cloud Console |
| `GOOGLE_CALLBACK_URL` | Redirect URI registered in Google Console (e.g. `http://localhost:3000/auth/google/callback`) |

---

## Offices Map (Google Maps)

The app includes a separate map page that displays mock publishing office addresses as map markers.

### Route

- `/map` (available from the header navigation as **Map**)

### Implementation details

- Uses `@angular/google-maps`
- Map page component: `src/app/components/offices-map/offices-map.ts`
- Mock office dataset: `src/app/core/constants/mock-offices.ts`
- Uses marker click interactions to open an info window with office name and address

### Setup

1. Install dependencies:

```bash
npm install
```

2. Add your Google Maps JavaScript API key in:

- `src/index.html`
- Replace `YOUR_API_KEY` in:

```html
<script src="https://maps.googleapis.com/maps/api/js?key=YOUR_API_KEY"></script>
```

3. Optional environment placeholders exist in:

- `src/environments/environment.ts`
- `src/environments/environment.development.ts`

These include `googleMapsApiKey` for project-level configuration tracking.

### Current behavior

- Office locations are mocked (no `/office` API call yet)
- Default camera is world view so all markers are visible

## Generating TypeScript Angular API Client

To generate the API client from your OpenAPI spec, run:

```sh
npx openapi-generator-cli generate \
	-i http://localhost:3000/swagger/json \
	-g typescript-angular \
	-o ./src/app/api
```

This will update the API client in `src/app/api`.
