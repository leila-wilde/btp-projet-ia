# Frontend - L'Archipel Libre

Angular 17 frontend application for the L'Archipel Libre community platform.

## Features

- **News Page**: Display community news and updates
- **Authentication**: Login and sign-up functionality
- **User Profile**: User profile management
- **Responsive Design**: Works on desktop and mobile devices
- **Standalone Components**: Uses Angular's latest standalone component architecture

## Prerequisites

- Node.js 18+ 
- npm 9+

## Installation

```bash
cd frontend
npm install
```

## Development Server

```bash
npm start
```

Navigate to `http://localhost:4200/`. The application will automatically reload if you change any of the source files.

## Build

```bash
npm run build
```

The build artifacts will be stored in the `dist/` directory.

## Project Structure

```
src/
├── app/
│   ├── pages/
│   │   ├── home/          # News/home page
│   │   ├── auth/          # Authentication page
│   │   └── profile/       # User profile page
│   ├── app.component.ts   # Main application component with header/navbar
│   └── app.routes.ts      # Application routing
├── assets/                # Static assets (logo, images)
├── index.html            # Main HTML file
├── main.ts               # Application entry point
└── styles.css            # Global styles
```

## Adding Logo

Place your company logo at `src/assets/logo.png`. The logo will be displayed in the header.

## Technologies Used

- Angular 17
- TypeScript
- RxJS
- CSS3

## License

See LICENSE file in the root directory.
