import React from 'react';
import { Icon } from './Icon.jsx'; // <-- ESTA É A LINHA QUE FOI ADICIONADA

export function Header({ onMenuClick, isDarkMode, setIsDarkMode, onLogout, searchTerm, onSearchChange, onAddBookmark }) {
  return (
    <header className="flex-shrink-0 bg-white/80 dark:bg-gray-900/80 backdrop-blur-sm border-b border-gray-200 dark:border-gray-800 z-10">
      <div className="px-6 h-16 flex items-center justify-between">
        <div className="flex items-center gap-4 flex-1">
          <button onClick={onMenuClick} className="p-2 -ml-2 rounded-full text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-primary-500" aria-label="Abrir/Fechar Menu">
            <Icon name="menu" size="md"/>
          </button>
          <div className="relative w-full max-w-md">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Icon name="search" size="md" className="text-gray-400" />
            </div>
            <input 
              type="search"
              className="block w-full py-2 pl-10 pr-4 text-sm bg-gray-100 dark:bg-gray-800 border-transparent rounded-lg focus:ring-2 focus:ring-primary-500 focus:bg-white dark:focus:bg-gray-700 transition-colors"
              placeholder="Busque por título..."
              value={searchTerm}
              onChange={(e) => onSearchChange(e.target.value)}
            />
          </div>
        </div>
        
        <div className="flex items-center gap-3">
          <button onClick={() => setIsDarkMode(p => !p)} className="p-2 rounded-full text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-800" title={isDarkMode ? "Modo Claro" : "Modo Escuro"}>
            <Icon name={isDarkMode ? 'sun' : 'moon'} size="md" />
          </button>
          <button onClick={onAddBookmark} className="px-4 py-2 flex items-center gap-2 bg-primary-600 text-white text-sm font-semibold rounded-lg hover:bg-primary-700 transition-all duration-200 shadow-sm hover:shadow-md">
            <Icon name="plus" size="sm" />
            Adicionar
          </button>
           <button onClick={onLogout} title="Sair" className="p-2 rounded-full text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-800">
             <Icon name="logout" size="md"/>
          </button>
        </div>
      </div>
    </header>
  );
}