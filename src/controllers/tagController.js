import db from '../config/db.js';

export const getAllTags = async (req, res, next) => {
  try {
    const [tags] = await db.query('SELECT id, name FROM tags WHERE ownerId = ? ORDER BY name ASC', [req.user.id]);
    res.json(tags);
  } catch (error) {
    next(error);
  }
};

export const addTag = async (req, res, next) => {
  const { name } = req.body;
  if (!name) {
    return res.status(400).json({ message: 'O nome da tag é obrigatório.' });
  }
  try {
    const [result] = await db.query('INSERT INTO tags (ownerId, name) VALUES (?, ?)', [req.user.id, name]);
    res.status(201).json({ id: result.insertId, name });
  } catch (error) {
    if (error.code === 'ER_DUP_ENTRY') {
      return res.status(409).json({ message: 'Essa tag já existe.' });
    }
    next(error);
  }
};

export const deleteTag = async (req, res, next) => {
  try {
    const [result] = await db.query('DELETE FROM tags WHERE id = ? AND ownerId = ?', [req.params.id, req.user.id]);
    if (result.affectedRows === 0) {
      return res.status(404).json({ message: 'Tag não encontrada.' });
    }
    res.status(204).send();
  } catch (error) {
    next(error);
  }
};