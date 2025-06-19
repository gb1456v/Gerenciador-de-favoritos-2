import db from '../config/db.js';

// GET ALL BOOKMARKS - Agora com busca APENAS por título
export const getAllBookmarks = async (req, res, next) => {
  try {
    const ownerId = req.user.id;
    const { search, categoryId } = req.query; // Pega os parâmetros da URL

    let sql = 'SELECT * FROM bookmarks WHERE ownerId = ?';
    const params = [ownerId];

    // Filtra por categoria, se um ID for fornecido
    if (categoryId) {
      sql += ' AND categoryId = ?';
      params.push(categoryId);
    }

    // Filtra por termo de busca APENAS no título
    if (search) {
      sql += ' AND title LIKE ?';
      params.push(`%${search}%`);
    }

    sql += ' ORDER BY createdAt DESC';

    const [bookmarks] = await db.query(sql, params);
    res.json(bookmarks);
  } catch (error) {
    next(error);
  }
};

// As outras funções (addBookmark, deleteBookmark) não precisam de alteração.
export const addBookmark = async (req, res, next) => {
  const { url, title, notes, categoryId, tags } = req.body;
  const ownerId = req.user.id;
  if (!url || !title) {
    return res.status(400).json({ message: 'URL e Título são obrigatórios.' });
  }
  try {
    const [result] = await db.query(
      'INSERT INTO bookmarks (ownerId, url, title, notes, categoryId, tags, createdByUserId, createdAt) VALUES (?, ?, ?, ?, ?, ?, ?, NOW())',
      [ownerId, url, title, notes, categoryId, JSON.stringify(tags || []), ownerId]
    );
    const [[newBookmark]] = await db.query('SELECT * FROM bookmarks WHERE id = ?', [result.insertId]);
    res.status(201).json(newBookmark);
  } catch (error) {
    next(error);
  }
};

export const deleteBookmark = async (req, res, next) => {
  try {
    const [result] = await db.query('DELETE FROM bookmarks WHERE id = ? AND ownerId = ?', [req.params.id, req.user.id]);
    if (result.affectedRows === 0) {
      return res.status(404).json({ message: 'Favorito não encontrado.' });
    }
    res.status(204).send();
  } catch (error) {
    next(error);
  }
};
