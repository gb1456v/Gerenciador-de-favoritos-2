import React, { useState, useEffect, useCallback } from 'react';
import { Sidebar } from './components/Sidebar.jsx';
import { Header } from './components/Header.jsx';
import { BookmarkCard } from './components/BookmarkCard.jsx';
import { Login } from './components/Login.jsx';
import { BookmarkFormModal } from './components/BookmarkFormModal.jsx';
import { CategoryFormModal } from './components/CategoryFormModal.jsx';
import { ConfirmModal } from './components/ConfirmModal.jsx';
import { Icon } from './components/Icon.jsx';
import * as api from './api.js';

// Hook customizado para "debouncing" (atrasar a execução de uma função)
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
  // --- ESTADO DE AUTENTICAÇÃO ---
  const [token, setToken] = useState(() => localStorage.getItem('authToken'));
  
  // --- ESTADO DOS DADOS ---
  const [bookmarks, setBookmarks] = useState([]);
  const [categories, setCategories] = useState([]);
  
  // --- ESTADOS DA INTERFACE ---
  const [isLoading, setIsLoading] = useState(true);
  const [isDarkMode, setIsDarkMode] = useState(() => window.matchMedia('(prefers-color-scheme: dark)').matches);
  
  // --- ESTADO DA BARRA LATERAL (CORRIGIDO) ---
  // Recupera a largura salva ou usa um padrão. Se for 0, considera fechada.
  const [sidebarWidth, setSidebarWidth] = useState(() => {
    const savedWidth = parseInt(localStorage.getItem('sidebarWidth'), 10);
    return savedWidth === 0 ? 0 : (savedWidth || 256);
  });

  const [modalState, setModalState] = useState({ type: null, data: null });
  
  // --- ESTADOS DE FILTRO ---
  const [searchTerm, setSearchTerm] = useState('');
  const [activeCategoryId, setActiveCategoryId] = useState(null);
  const debouncedSearchTerm = useDebounce(searchTerm, 300);

  // Função para buscar todos os dados
  const fetchAllData = useCallback(async () => {
    if (!token) return setIsLoading(false);
    
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

  // Salva a largura da sidebar no localStorage sempre que ela muda (e não está fechada)
  useEffect(() => {
    if (sidebarWidth > 0) {
      localStorage.setItem('sidebarWidth', sidebarWidth);
    }
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
    // Se a barra estiver fechada (ou muito pequena), abre para a largura salva.
    // Se estiver aberta, fecha (largura 0).
    if (sidebarWidth < 50) {
      setSidebarWidth(parseInt(localStorage.getItem('sidebarWidth'), 10) || 256);
    } else {
      setSidebarWidth(0);
    }
  };

  const handleDeleteItem = async () => {
    const { item, type } = modalState.data;
    try {
      if (type === 'bookmark') await api.deleteBookmark(item.id);
      else if (type === 'category') await api.deleteCategory(item.id);
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
          onAddCategory={() => setModalState({ type: 'categoryForm' })}
          onAddSubCategory={(parentId) => setModalState({ type: 'categoryForm', data: { parentId } })}
          onDeleteCategory={(category) => setModalState({ type: 'confirmDelete', data: { item: category, type: 'category' } })}
          activeCategoryId={activeCategoryId}
          onSelectCategory={setActiveCategoryId}
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
                <p className="text-center text-gray-500">Carregando...</p>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 gap-6">
                  {bookmarks.map(bookmark => 
                    <BookmarkCard 
                      key={bookmark.id} 
                      bookmark={bookmark} 
                      onDelete={(bm) => setModalState({ type: 'confirmDelete', data: { item: bm, type: 'bookmark' } })}
                    />
                  )}
                </div>
              )}
            </div>
          </main>
        </div>
      </div>
      
      <BookmarkFormModal isOpen={modalState.type === 'bookmarkForm'} onClose={closeModal} categories={categories} onSaveSuccess={handleSaveSuccess} preselectedCategoryId={modalState.data?.preselectedCategoryId} />
      <CategoryFormModal isOpen={modalState.type === 'categoryForm'} onClose={closeModal} categories={categories} onSaveSuccess={handleSaveSuccess} parentId={modalState.data?.parentId} />
      <ConfirmModal isOpen={modalState.type === 'confirmDelete'} onClose={closeModal} onConfirm={handleDeleteItem} title={`Excluir ${modalState.data?.type === 'bookmark' ? 'Favorito' : 'Categoria'}`}>
          <p>Tem a certeza que quer excluir "<strong>{modalState.data?.item?.title || modalState.data?.item?.name}</strong>"?</p>
          {modalState.data?.type === 'category' && <p className="mt-2 text-sm">Todas as subcategorias e favoritos contidos nela também serão excluídos.</p>}
          <p className="mt-2 text-xs font-bold">Esta ação não pode ser desfeita.</p>
      </ConfirmModal>
    </>
  );
}
