import db from '../config/db.js';

export const getAllCategories = async (req, res, next) => {
  try {
    const [categories] = await db.query('SELECT * FROM categories WHERE ownerId = ? ORDER BY name ASC', [req.user.id]);
    res.json(categories);
  } catch (error) { next(error); }
};

export const addCategory = async (req, res, next) => {
  const { name, parentId = null } = req.body;
  if (!name) return res.status(400).json({ message: 'O nome da categoria é obrigatório.' });
  try {
    const [result] = await db.query('INSERT INTO categories (ownerId, name, parentId) VALUES (?, ?, ?)', [req.user.id, name, parentId]);
    const [[newCategory]] = await db.query('SELECT * FROM categories WHERE id = ?', [result.insertId]);
    res.status(201).json(newCategory);
  } catch (error) { next(error); }
};

export const updateCategory = async (req, res, next) => {
  const { id } = req.params;
  const { name, parentId } = req.body;
  const ownerId = req.user.id;

  if (!name) {
    return res.status(400).json({ message: 'O nome da categoria é obrigatório.' });
  }
  
  if (parseInt(id, 10) === parseInt(parentId, 10)) {
    return res.status(400).json({ message: 'Uma categoria não pode ser subcategoria de si mesma.' });
  }

  try {
    const [result] = await db.query(
      'UPDATE categories SET name = ?, parentId = ? WHERE id = ? AND ownerId = ?',
      [name, parentId || null, id, ownerId]
    );

    if (result.affectedRows === 0) {
      return res.status(404).json({ message: 'Categoria não encontrada ou sem permissão para editar.' });
    }
    const [[updatedCategory]] = await db.query('SELECT * FROM categories WHERE id = ?', [id]);
    res.json(updatedCategory);
  } catch (error) {
    next(error);
  }
};

export const deleteCategory = async (req, res, next) => {
  try {
    const [result] = await db.query('DELETE FROM categories WHERE id = ? AND ownerId = ?', [req.params.id, req.user.id]);
    if (result.affectedRows === 0) return res.status(404).json({ message: 'Categoria não encontrada.' });
    res.status(204).send();
  } catch (error) { next(error); }
};
