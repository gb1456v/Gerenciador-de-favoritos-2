import React, { useState, useEffect, useCallback } from 'react';
import { Sidebar } from './components/Sidebar.jsx';
import { Header } from './components/Header.jsx';
import { BookmarkCard } from './components/BookmarkCard.jsx';
import { Login } from './components/Login.jsx';
import { BookmarkFormModal } from './components/BookmarkFormModal.jsx';
import { CategoryFormModal } from './components/CategoryFormModal.jsx';
import { ConfirmModal } from './components/ConfirmModal.jsx';
import { Icon } from './components/Icon.jsx'; // <-- ESTA É A LINHA QUE FOI ADICIONADA
import * as api from './api.js';

function useDebounce(value, delay) {
  const [debouncedValue, setDebouncedValue] = useState(value);
  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);
    return () => {
      clearTimeout(handler);
    };
  }, [value, delay]);
  return debouncedValue;
}

export default function App() {
  const [token, setToken] = useState(() => localStorage.getItem('authToken'));
  const [bookmarks, setBookmarks] = useState([]);
  const [categories, setCategories] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isDarkMode, setIsDarkMode] = useState(() => window.matchMedia('(prefers-color-scheme: dark)').matches);
  const [sidebarWidth, setSidebarWidth] = useState(() => {
    const savedWidth = parseInt(localStorage.getItem('sidebarWidth'), 10);
    return savedWidth === 0 ? 0 : (savedWidth || 256);
  });
  const [modalState, setModalState] = useState({ type: null, data: null });
  const [searchTerm, setSearchTerm] = useState('');
  const [activeCategoryId, setActiveCategoryId] = useState(null);
  const debouncedSearchTerm = useDebounce(searchTerm, 300);

  const fetchAllData = useCallback(async () => {
    if (!token) {
      setIsLoading(false);
      return;
    }
    try {
      setIsLoading(true);
      const [bookmarksData, categoriesData] = await Promise.all([
        api.getBookmarks({ search: debouncedSearchTerm, categoryId: activeCategoryId }),
        api.getCategories(),
      ]);
      setBookmarks(bookmarksData);
      setCategories(categoriesData);
    } catch (error) {
      console.error("Erro ao buscar dados:", error);
      handleLogout();
    } finally {
      setIsLoading(false);
    }
  }, [token, debouncedSearchTerm, activeCategoryId]);

  useEffect(() => { fetchAllData(); }, [fetchAllData]);
  
  useEffect(() => {
    document.documentElement.classList.toggle('dark', isDarkMode);
  }, [isDarkMode]);

  useEffect(() => {
    localStorage.setItem('sidebarWidth', sidebarWidth);
  }, [sidebarWidth]);

  const handleLoginSuccess = (newToken) => {
    localStorage.setItem('authToken', newToken);
    setToken(newToken);
  };

  const handleLogout = () => {
    localStorage.removeItem('authToken');
    setToken(null);
  };

  const closeModal = () => setModalState({ type: null, data: null });

  const handleSaveSuccess = () => {
    closeModal();
    fetchAllData();
  };
  
  const handleToggleSidebar = () => {
    if (sidebarWidth < 50) {
      setSidebarWidth(parseInt(localStorage.getItem('sidebarWidth'), 10) || 256);
    } else {
      setSidebarWidth(0);
    }
  };
  
  const openDeleteModal = (item, type) => {
    setModalState({ type: 'confirmDelete', data: { item, type } });
  };
  
  const handleConfirmDelete = async () => {
    const { item, type } = modalState.data;
    try {
      if (type === 'bookmark') {
        await api.deleteBookmark(item.id);
      } else if (type === 'category') {
        await api.deleteCategory(item.id);
      }
      handleSaveSuccess();
    } catch (error) {
      alert(`Erro ao excluir: ${error.message}`);
      closeModal();
    }
  };

  if (!token) {
    return <Login onLoginSuccess={handleLoginSuccess} />;
  }

  return (
    <>
      <div className="flex h-screen text-gray-900 dark:text-gray-100 bg-gray-100 dark:bg-gray-900">
        <Sidebar 
          width={sidebarWidth}
          setWidth={setSidebarWidth}
          categories={categories}
          activeCategoryId={activeCategoryId}
          onSelectCategory={setActiveCategoryId}
          onAddCategory={() => setModalState({ type: 'categoryForm' })}
          onAddSubCategory={(parentId) => setModalState({ type: 'categoryForm', data: { parentId } })}
          onEditCategory={(category) => setModalState({ type: 'categoryForm', data: { categoryToEdit: category }})}
          onDeleteCategory={(category) => openDeleteModal(category, 'category')}
        />
        <div className="flex-1 flex flex-col overflow-hidden">
          <Header 
            onMenuClick={handleToggleSidebar}
            isDarkMode={isDarkMode}
            setIsDarkMode={setIsDarkMode}
            onLogout={handleLogout}
            searchTerm={searchTerm}
            onSearchChange={setSearchTerm}
            onAddBookmark={() => setModalState({ type: 'bookmarkForm', data: { preselectedCategoryId: activeCategoryId } })}
          />
          <main className="flex-1 overflow-x-hidden overflow-y-auto bg-gray-100 dark:bg-gray-900">
            <div className="container mx-auto px-6 py-8">
              {isLoading ? (
                <p className="text-center text-gray-500">A carregar...</p>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 gap-6">
                  {bookmarks.length > 0 ? (
                    bookmarks.map(bookmark => 
                      <BookmarkCard 
                        key={bookmark.id} 
                        bookmark={bookmark} 
                        onEdit={(bm) => setModalState({ type: 'bookmarkForm', data: { bookmarkToEdit: bm } })}
                        onDelete={(bm) => openDeleteModal(bm, 'bookmark')}
                      />
                    )
                  ) : (
                    <div className="col-span-full text-center py-16">
                        <Icon name="search" size="xl" className="mx-auto text-gray-300 dark:text-gray-600"/>
                        <h3 className="mt-2 text-sm font-semibold text-gray-900 dark:text-white">Nenhum favorito encontrado</h3>
                        <p className="mt-1 text-sm text-gray-500">Tente ajustar a sua busca ou adicione um novo favorito.</p>
                    </div>
                  )}
                </div>
              )}
            </div>
          </main>
        </div>
      </div>
      
      <BookmarkFormModal isOpen={modalState.type === 'bookmarkForm'} onClose={closeModal} categories={categories} onSaveSuccess={handleSaveSuccess} bookmarkToEdit={modalState.data?.bookmarkToEdit} preselectedCategoryId={modalState.data?.preselectedCategoryId} />
      <CategoryFormModal isOpen={modalState.type === 'categoryForm'} onClose={closeModal} categories={categories} onSaveSuccess={handleSaveSuccess} parentId={modalState.data?.parentId} categoryToEdit={modalState.data?.categoryToEdit} />
      <ConfirmModal isOpen={modalState.type === 'confirmDelete'} onClose={closeModal} onConfirm={handleConfirmDelete} title={`Excluir ${modalState.data?.type === 'bookmark' ? 'Favorito' : 'Categoria'}`}>
          <p>Tem a certeza que quer excluir "<strong>{modalState.data?.item?.title || modalState.data?.item?.name}</strong>"?</p>
          {modalState.data?.type === 'category' && <p className="mt-2 text-sm">Todas as subcategorias e favoritos contidos nela também serão excluídos.</p>}
          <p className="mt-2 text-xs font-bold">Esta ação não pode ser desfeita.</p>
      </ConfirmModal>
    </>
  );
}