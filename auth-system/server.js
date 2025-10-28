#!/usr/bin/env node

/**
 * Simple HTTP Server pour tester le système d'authentification
 * 
 * Utilisation:
 *   node server.js
 *   Puis ouvrir http://localhost:3000
 */

const http = require('http');
const fs = require('fs');
const path = require('path');

const PORT = 3000;
const HOST = 'localhost';

// Map des types MIME
const mimeTypes = {
  '.html': 'text/html',
  '.js': 'text/javascript',
  '.css': 'text/css',
  '.json': 'application/json',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.gif': 'image/gif',
  '.svg': 'image/svg+xml',
  '.wav': 'audio/wav',
  '.mp4': 'video/mp4',
  '.woff': 'application/font-woff',
  '.ttf': 'application/font-ttf',
  '.eot': 'application/vnd.ms-fontobject',
  '.otf': 'application/font-otf',
  '.wasm': 'application/wasm'
};

const server = http.createServer((req, res) => {
  console.log(`${req.method} ${req.url}`);

  // Route par défaut
  let filePath = req.url === '/' ? '/index.html' : req.url;
  filePath = path.join(__dirname, filePath);

  // Vérifier si le fichier existe
  fs.stat(filePath, (err, stats) => {
    if (err || !stats.isFile()) {
      // Fichier non trouvé
      res.writeHead(404, { 'Content-Type': 'text/html' });
      res.end(`
        <!DOCTYPE html>
        <html>
        <head><title>404 Not Found</title></head>
        <body>
          <h1>404 - Fichier non trouvé</h1>
          <p>${filePath} n'existe pas</p>
          <p><a href="/">Retour à l'accueil</a></p>
        </body>
        </html>
      `);
      return;
    }

    // Déterminer le type MIME
    const ext = path.extname(filePath);
    const contentType = mimeTypes[ext] || 'application/octet-stream';

    // Lire et servir le fichier
    fs.readFile(filePath, (err, content) => {
      if (err) {
        res.writeHead(500, { 'Content-Type': 'text/html' });
        res.end(`<h1>Erreur serveur</h1><p>${err}</p>`);
        return;
      }

      res.writeHead(200, { 'Content-Type': contentType });
      res.end(content, 'utf-8');
    });
  });
});

server.listen(PORT, HOST, () => {
  console.log(`
╔════════════════════════════════════════════════════════════════════╗
║                                                                    ║
║  🎯 Système d'Authentification - Serveur de Développement         ║
║                                                                    ║
║  Serveur actif sur: http://${HOST}:${PORT}                           ║
║                                                                    ║
║  Fichiers:                                                         ║
║  • Principal:    http://${HOST}:${PORT}                               ║
║  • Démo:         http://${HOST}:${PORT}/demo.html                    ║
║                                                                    ║
║  Touches clés:                                                    ║
║  • Ctrl+C: Arrêter le serveur                                     ║
║  • F12:    Ouvrir la console du navigateur                        ║
║                                                                    ║
╚════════════════════════════════════════════════════════════════════╝
  `);
});

// Gestion de l'arrêt
process.on('SIGINT', () => {
  console.log('\n\n⛔ Serveur arrêté');
  process.exit(0);
});
