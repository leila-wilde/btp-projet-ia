# L'Archipel Libre - Web Platform Setup Guide

## Quick Start

### 1. Add Your Company Logo

Your logo should be placed at: `frontend/src/assets/logo.png`

**Logo Specifications:**
- Format: PNG with transparent background (recommended)
- Dimensions: Minimum 200x200 pixels (will scale to 50x50 in header)
- The logo will automatically appear in the header navigation

**Current Setup:**
The application is configured to display the logo in the header. If the logo file is not found, the application will log a warning but continue to function normally.

### 2. Install and Run Frontend

```bash
cd frontend
npm install
npm start
```

This will start the development server at `http://localhost:4200/`

## Features Overview

### 🏠 Home Page (`/`)
- News feed with multiple articles
- Each article shows title, author, date, and content
- Sample articles are included for demonstration

### 🔐 Authentication (`/auth`)
- **Login Mode**: Existing users can log in
- **Sign Up Mode**: New users can create an account
- Toggle between modes with the link at the bottom
- Form validation for email and password
- Local storage persistence (demo mode)
- Session-aware state management

### 👤 Profile Page (`/profile`)
- View logged-in user information
- Display email and account status
- Logout button to clear session
- Redirects non-authenticated users with login prompt

### 🎨 Header Navigation
- Company logo (top left)
- Application title
- Navigation buttons: Home, Authentication, Profile
- Responsive design

## File Structure

```
frontend/
├── src/
│   ├── app/
│   │   ├── pages/
│   │   │   ├── home/
│   │   │   │   └── home.component.ts      # News feed page
│   │   │   ├── auth/
│   │   │   │   └── auth.component.ts      # Login/signup page
│   │   │   └── profile/
│   │   │       └── profile.component.ts   # User profile page
│   │   ├── app.component.ts               # Main layout component
│   │   └── app.routes.ts                  # Route configuration
│   ├── assets/
│   │   └── logo.png                       # (ADD YOUR LOGO HERE)
│   ├── index.html                         # HTML entry point
│   ├── main.ts                            # Bootstrap file
│   └── styles.css                         # Global styles
├── angular.json                           # Angular CLI config
├── package.json                           # Dependencies
├── tsconfig.json                          # TypeScript config
└── README.md                              # Frontend docs
```

## Development

### Build Commands
- `npm start` - Start development server
- `npm run build` - Build for production
- `npm run watch` - Build in watch mode
- `npm test` - Run tests (when configured)
- `npm run lint` - Run linter (when configured)

### Adding New Pages

1. Create a new component in `frontend/src/app/pages/{page-name}/`
2. Export the component as `standalone: true`
3. Add the route to `frontend/src/app/app.routes.ts`
4. Add navigation button in `frontend/src/app/app.component.ts`

### Authentication Integration

The current authentication system uses local storage for demonstration. To integrate with the backend:

1. Create an authentication service in `frontend/src/app/services/auth.service.ts`
2. Replace localStorage calls with HTTP API calls
3. Connect to the feature/auth-system branch when ready

## Browser Support

- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)

## Notes

- The application uses Angular 17 standalone components (no NgModules)
- Routing is configured with the new standalone routing API
- Forms use two-way binding with `[(ngModel)]`
- Styling is done with inline CSS in components and global styles

## Troubleshooting

### Logo not showing?
- Verify the file exists at `frontend/src/assets/logo.png`
- Check browser console for warnings
- The app will work fine without the logo

### Port 4200 already in use?
- Change port: `ng serve --port 4300`
- Or kill the process using port 4200

### Dependencies issues?
- Delete `node_modules/` and `package-lock.json`
- Run `npm install` again

## Next Steps

1. ✅ Add your company logo
2. ✅ Test the frontend locally
3. ⏳ Connect to backend API
4. ⏳ Integrate production authentication from feature/auth-system
5. ⏳ Add more news articles and features
6. ⏳ Deploy to production

---

For more details on each page, see the component files or the frontend `README.md`.
