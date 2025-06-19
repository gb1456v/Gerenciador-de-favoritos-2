import React, { useState, useEffect } from 'react';
import { Modal } from './Modal.jsx';
import * as api from '../api.js';

export function CategoryFormModal({ isOpen, onClose, onSaveSuccess, categories, parentId }) {
  const [name, setName] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const modalTitle = parentId ? 'Criar Subcategoria' : 'Criar Nova Categoria';

  // Limpa o formulário sempre que o modal é aberto
  useEffect(() => {
    if (isOpen) {
      setName('');
      setError('');
    }
  }, [isOpen]);

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError('');
    setLoading(true);
    try {
      await api.addCategory({ name, parentId: parentId || null });
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
          {/* ---- CORREÇÃO APLICADA AQUI ---- */}
          <label htmlFor="cat-name" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
            Nome:
          </label>
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
          <button 
            type="button" 
            onClick={onClose} 
            className="px-4 py-2 text-sm font-semibold bg-gray-200 dark:bg-gray-600 rounded-lg hover:bg-gray-300 dark:hover:bg-gray-500 transition-colors"
          >
            Cancelar
          </button>
          <button 
            type="submit" 
            disabled={loading} 
            className="px-4 py-2 text-sm font-semibold text-white bg-primary-600 rounded-lg hover:bg-primary-700 disabled:opacity-50 transition-colors"
          >
            {loading ? 'Salvando...' : 'Salvar'}
          </button>
        </div>
      </form>
    </Modal>
  );
}
