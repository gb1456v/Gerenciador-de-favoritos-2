import React from 'react';
import { Icon } from './Icon.jsx';

export function BookmarkCard({ bookmark, onDelete }) { // Adicionada a prop onDelete
  const formatDate = (dateString) => new Date(dateString).toLocaleDateString('pt-BR', { day: '2-digit', month: 'short', year: 'numeric' });
  const getFaviconUrl = (url) => `https://www.google.com/s2/favicons?sz=32&domain_url=${new URL(url).hostname}`;

  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm hover:shadow-lg transition-shadow duration-300 flex flex-col">
      <div className="p-4 flex-grow">
        <div className="flex items-center mb-2">
          <img src={getFaviconUrl(bookmark.url)} alt="" className="w-5 h-5 mr-3 rounded-sm" onError={(e) => e.target.style.display = 'none'} />
          <h3 className="font-semibold text-gray-800 dark:text-white truncate">{bookmark.title}</h3>
        </div>
        <a href={bookmark.url} target="_blank" rel="noopener noreferrer" className="text-sm text-blue-600 dark:text-blue-400 hover:underline break-all">
          {bookmark.url}
        </a>
      </div>
      <div className="border-t border-gray-100 dark:border-gray-700 p-3 flex justify-between items-center text-xs text-gray-500 dark:text-gray-400">
        <span>{formatDate(bookmark.createdAt)}</span>
        <div className="flex items-center gap-1">
          <button className="p-1.5 rounded-md hover:bg-gray-200 dark:hover:bg-gray-700 hover:text-primary-600 transition-colors"><Icon name="edit" size="sm" /></button>
          {/* AQUI: onClick chama a função onDelete passada como prop */}
          <button onClick={() => onDelete(bookmark)} className="p-1.5 rounded-md hover:bg-gray-200 dark:hover:bg-gray-700 hover:text-red-500 transition-colors"><Icon name="trash" size="sm" /></button>
        </div>
      </div>
    </div>
  );
}