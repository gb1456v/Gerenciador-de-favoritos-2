import React, { useState, useEffect, useMemo } from 'react';
import { Modal } from './Modal.jsx';
import * as api from '../api.js';

// Helper para criar a lista de opções com indentação
const buildCategoryOptions = (categories) => {
  const options = [];
  const map = new Map(categories.map(cat => [cat.id, { ...cat, children: [] }]));

  categories.forEach(cat => {
    if (cat.parentId && map.has(cat.parentId)) {
      map.get(cat.parentId).children.push(map.get(cat.id));
    }
  });

  function addOptions(category, depth) {
    options.push({
      ...category,
      label: `${'—'.repeat(depth)} ${category.name}`,
    });
    category.children.sort((a,b) => a.name.localeCompare(b.name)).forEach(child => addOptions(child, depth + 1));
  }

  const roots = categories.filter(cat => !cat.parentId).sort((a,b) => a.name.localeCompare(b.name));
  roots.forEach(root => addOptions(map.get(root.id), 0));

  return options;
};

export function BookmarkFormModal({ isOpen, onClose, categories, onSaveSuccess, preselectedCategoryId }) {
  const [title, setTitle] = useState('');
  const [url, setUrl] = useState('');
  const [categoryId, setCategoryId] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (isOpen) {
      setTitle('');
      setUrl('');
      setCategoryId(preselectedCategoryId || ''); // Define a categoria pré-selecionada
      setError('');
    }
  }, [isOpen, preselectedCategoryId]);

  const categoryOptions = useMemo(() => buildCategoryOptions(categories), [categories]);

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError('');
    setLoading(true);
    try {
      await api.addBookmark({ title, url, categoryId: categoryId || null });
      onSaveSuccess();
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Adicionar Novo Favorito">
      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Campos de Título e URL permanecem os mesmos */}
        <div>
          <label htmlFor="title" className="block text-sm font-medium text-gray-700 dark:text-gray-300">Título</label>
          <input type="text" name="title" id="title" required value={title} onChange={e => setTitle(e.target.value)} className="mt-1 block w-full px-3 py-2 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-primary-500 focus:border-primary-500" />
        </div>
        <div>
          <label htmlFor="url" className="block text-sm font-medium text-gray-700 dark:text-gray-300">URL</label>
          <input type="url" name="url" id="url" required value={url} onChange={e => setUrl(e.target.value)} className="mt-1 block w-full px-3 py-2 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-primary-500 focus:border-primary-500" />
        </div>
        <div>
          <label htmlFor="categoryId" className="block text-sm font-medium text-gray-700 dark:text-gray-300">Categoria/Subcategoria (Opcional)</label>
          <select name="categoryId" id="categoryId" value={categoryId} onChange={e => setCategoryId(e.target.value)} className="mt-1 block w-full px-3 py-2 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-primary-500 focus:border-primary-500">
            <option value="">Sem Categoria</option>
            {categoryOptions.map(cat => (
              <option key={cat.id} value={cat.id}>{cat.label}</option>
            ))}
          </select>
        </div>
        {error && <p className="text-sm text-red-500">{error}</p>}
        <div className="flex justify-end gap-3 pt-4">
          <button type="button" onClick={onClose} className="px-4 py-2 text-sm font-semibold bg-gray-200 dark:bg-gray-600 rounded-lg hover:bg-gray-300 dark:hover:bg-gray-500">Cancelar</button>
          <button type="submit" disabled={loading} className="px-4 py-2 text-sm font-semibold text-white bg-primary-600 rounded-lg hover:bg-primary-700 disabled:opacity-50">{loading ? 'Salvando...' : 'Salvar Favorito'}</button>
        </div>
      </form>
    </Modal>
  );
}