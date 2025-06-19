import dotenv from 'dotenv';
import express from 'express';
import path from 'path';
import cors from 'cors';
import { fileURLToPath } from 'url';

// --- Correção de Caminho para Módulos ES ---
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// --- Importações com .js no final ---
import authRoutes from './src/routes/authRoutes.js';
import bookmarkRoutes from './src/routes/bookmarkRoutes.js';
import categoryRoutes from './src/routes/categoryRoutes.js';
import tagRoutes from './src/routes/tagRoutes.js';
import authMiddleware from './src/middleware/authMiddleware.js';

dotenv.config();

const app = express();
const port = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(express.static(path.join(__dirname, 'public')));

app.use('/api/auth', authRoutes);
app.use('/api/bookmarks', authMiddleware, bookmarkRoutes);
app.use('/api/categories', authMiddleware, categoryRoutes);
app.use('/api/tags', authMiddleware, tagRoutes);

app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ message: 'Algo deu errado no servidor!' });
});

app.listen(port, () => {
  console.log(`Servidor rodando em http://localhost:${port}`);
});