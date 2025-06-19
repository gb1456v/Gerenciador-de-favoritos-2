import db from '../config/db.js';

export const getAllBookmarks = async (req, res, next) => {
  try {
    const ownerId = req.user.id;
    const { search, categoryId } = req.query;
    let sql = 'SELECT * FROM bookmarks WHERE ownerId = ?';
    const params = [ownerId];
    if (categoryId) {
      sql += ' AND categoryId = ?';
      params.push(categoryId);
    }
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

export const addBookmark = async (req, res, next) => {
  const { url, title, categoryId } = req.body;
  const ownerId = req.user.id;
  if (!url || !title) {
    return res.status(400).json({ message: 'URL e Título são obrigatórios.' });
  }
  try {
    const [result] = await db.query(
      'INSERT INTO bookmarks (ownerId, url, title, categoryId, createdByUserId, createdAt) VALUES (?, ?, ?, ?, ?, NOW())',
      [ownerId, url, title, categoryId || null, ownerId]
    );
    const [[newBookmark]] = await db.query('SELECT * FROM bookmarks WHERE id = ?', [result.insertId]);
    res.status(201).json(newBookmark);
  } catch (error) { next(error); }
};

export const updateBookmark = async (req, res, next) => {
  const { id } = req.params;
  const { title, url, categoryId } = req.body;
  const ownerId = req.user.id;

  if (!url || !title) {
    return res.status(400).json({ message: 'URL e Título são obrigatórios.' });
  }

  try {
    const [result] = await db.query(
      'UPDATE bookmarks SET title = ?, url = ?, categoryId = ? WHERE id = ? AND ownerId = ?',
      [title, url, categoryId || null, id, ownerId]
    );

    if (result.affectedRows === 0) {
      return res.status(404).json({ message: 'Favorito não encontrado ou sem permissão para editar.' });
    }

    const [[updatedBookmark]] = await db.query('SELECT * FROM bookmarks WHERE id = ?', [id]);
    res.json(updatedBookmark);
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
