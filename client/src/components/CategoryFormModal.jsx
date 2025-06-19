import React, { useState, useEffect } from 'react';
import { Modal } from './Modal.jsx';
import * as api from '../api.js';

// ---- CORREÇÃO APLICADA AQUI ----
// Adicionado `categories = []` para garantir que nunca seja undefined
export function CategoryFormModal({ isOpen, onClose, onSaveSuccess, categories = [], parentId, categoryToEdit }) {
  const [name, setName] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const isEditing = !!categoryToEdit;
  const modalTitle = isEditing ? 'Editar Categoria' : (parentId ? 'Criar Subcategoria' : 'Criar Nova Categoria');

  useEffect(() => {
    if (isOpen) {
      if (isEditing) {
        setName(categoryToEdit.name);
      } else {
        setName('');
      }
      setError('');
    }
  }, [isOpen, categoryToEdit, isEditing]);

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError('');
    setLoading(true);
    try {
      const categoryData = {
        name,
        parentId: isEditing ? categoryToEdit.parentId : (parentId || null)
      };
      if (isEditing) {
        await api.updateCategory(categoryToEdit.id, categoryData);
      } else {
        await api.addCategory(categoryData);
      }
      onSaveSuccess();
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title={modalTitle}>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label htmlFor="cat-name" className="block text-sm font-medium text-gray-700 dark:text-gray-300">Nome:</label>
          <input
            type="text"
            name="name"
            id="cat-name"
            required
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="mt-1 block w-full px-3 py-2 bg-white dark:bg-gray-700 dark:text-white border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-primary-500 focus:border-primary-500"
            placeholder={parentId ? "Nome da Subcategoria" : "Nome da Categoria"}
          />
        </div>
        {error && <p className="text-sm text-red-500 text-center">{error}</p>}
        <div className="flex justify-end gap-3 pt-4">
          <button type="button" onClick={onClose} className="px-4 py-2 text-sm font-semibold bg-gray-200 dark:bg-gray-600 rounded-lg hover:bg-gray-300 dark:hover:bg-gray-500">Cancelar</button>
          <button type="submit" disabled={loading} className="px-4 py-2 text-sm font-semibold text-white bg-primary-600 rounded-lg hover:bg-primary-700 disabled:opacity-50">{loading ? 'Salvando...' : 'Salvar'}</button>
        </div>
      </form>
    </Modal>
  );
}
