import fs from 'fs';
import express from 'express';
import { createServer } from 'vite';

const app = express();

const vite = await createServer({
    server: {
        middlewareMode: true,
    },
    appType: 'custom',
});

app.use(vite.middlewares);

app.use('*', async (req, res) => {
    const url = req.originalUrl;
   
    try {
   
      const html = await vite.transformIndexHtml(url, fs.readFileSync('main.html', 'utf-8'));
      res.status(200).set({ 'Content-Type': 'text/html' }).end(html);
    } catch (error) {
      res.status(500).end(error);
    }
  });

app.listen(4173, () => {
    console.log('http://localhost:4173.');
});