# Quick Launch Scripts

Two scripts are provided to help you quickly launch the application:

## For Windows Users

**Double-click:** `run.bat`

Or open Command Prompt and run:
```bash
run.bat
```

The script will:
1. Check Node.js and npm are installed
2. Navigate to the frontend folder
3. Install dependencies (if needed)
4. Start the development server

## For macOS/Linux Users

Run in terminal:
```bash
chmod +x run.sh
./run.sh
```

Or:
```bash
bash run.sh
```

The script will:
1. Check Node.js and npm are installed
2. Navigate to the frontend folder
3. Install dependencies (if needed)
4. Start the development server

## Manual Launch

If the scripts don't work, run these commands in terminal/command prompt:

```bash
cd frontend
npm install
npm start
```

## What Happens Next

1. **Dependencies Installation**: npm will download and install all required packages (Angular 17, TypeScript, etc.)
2. **Compilation**: Angular will compile your application
3. **Development Server**: A local server will start at `http://localhost:4200/`
4. **Auto-open**: Your default browser should automatically open the application

## If Browser Doesn't Open

Manually open your browser and go to: **http://localhost:4200/**

## Stop the Server

Press `Ctrl+C` in the terminal/command prompt to stop the development server.

## Troubleshooting

### "npm: command not found"
- Node.js is not installed or not added to PATH
- Download from https://nodejs.org (LTS version recommended)

### "Port 4200 is already in use"
Run with a different port:
```bash
ng serve --port 4300
```

### Dependencies installation fails
Try clearing npm cache:
```bash
npm cache clean --force
rm -rf node_modules package-lock.json
npm install
```

---

**Everything is ready! Just run the script and enjoy your platform! 🚀**
