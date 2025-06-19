import db from '../config/db.js';

export const getAllCategories = async (req, res, next) => {
  try {
    const [categories] = await db.query('SELECT id, name, parentId FROM categories WHERE ownerId = ? ORDER BY name ASC', [req.user.id]);
    res.json(categories);
  } catch (error) {
    next(error);
  }
};

export const addCategory = async (req, res, next) => {
  const { name, parentId = null } = req.body;
  if (!name) {
    return res.status(400).json({ message: 'O nome da categoria é obrigatório.' });
  }
  try {
    const [result] = await db.query('INSERT INTO categories (ownerId, name, parentId) VALUES (?, ?, ?)', [req.user.id, name, parentId]);
    res.status(201).json({ id: result.insertId, name, parentId });
  } catch (error) {
    next(error);
  }
};

export const deleteCategory = async (req, res, next) => {
  try {
    const [result] = await db.query('DELETE FROM categories WHERE id = ? AND ownerId = ?', [req.params.id, req.user.id]);
    if (result.affectedRows === 0) {
      return res.status(404).json({ message: 'Categoria não encontrada.' });
    }
    res.status(204).send();
  } catch (error) {
    next(error);
  }
};