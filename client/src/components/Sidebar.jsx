import React, { useMemo, useState, useCallback, useRef } from 'react';
import { Icon } from './Icon.jsx';

// Função auxiliar para construir a árvore de categorias a partir de uma lista simples
const buildCategoryTree = (categories) => {
  const tree = [];
  const map = new Map(categories.map(cat => [cat.id, { ...cat, children: [] }]));

  categories.forEach(cat => {
    if (cat.parentId && map.has(cat.parentId)) {
      map.get(cat.parentId).children.push(map.get(cat.id));
    } else {
      tree.push(map.get(cat.id));
    }
  });

  // Ordena as categorias e subcategorias alfabeticamente
  tree.sort((a, b) => a.name.localeCompare(b.name));
  map.forEach(node => {
    node.children.sort((a, b) => a.name.localeCompare(b.name));
  });

  return tree;
};

// Componente recursivo para renderizar cada item (categoria ou subcategoria)
const CategoryItem = ({ category, level = 0, onSelectCategory, onAddSubCategory, onEditCategory, onDeleteCategory, activeCategoryId }) => {
  const [isOpen, setIsOpen] = useState(true);
  const isActive = activeCategoryId === category.id;
  const hasChildren = category.children && category.children.length > 0;

  const activeClasses = isActive ? 'bg-primary-100 dark:bg-primary-900/50 text-primary-700 dark:text-white' : 'hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-600 dark:text-gray-300';

  return (
    <li className="group/item">
      <a 
        href="#" 
        onClick={(e) => { e.preventDefault(); onSelectCategory(category.id); }} 
        className={`flex items-center gap-2 w-full text-left px-2 py-2 rounded-lg text-sm font-medium transition-colors ${activeClasses}`}
        style={{ paddingLeft: `${0.75 + level * 0.8}rem` }}
      >
        <button onClick={(e) => { e.stopPropagation(); if (hasChildren) setIsOpen(!isOpen); }} className={`p-0.5 rounded ${!hasChildren && 'invisible'}`}>
            <Icon name={isOpen ? 'folder-minus' : 'folder-plus'} size="sm" className="transition-transform"/>
        </button>
        <span className="flex-1 truncate">{category.name}</span>
        <div className="flex items-center gap-1 opacity-0 group-hover/item:opacity-100 transition-opacity">
            <button title="Editar Categoria" onClick={(e) => { e.stopPropagation(); onEditCategory(category); }} className="p-1 rounded hover:bg-gray-200 dark:hover:bg-gray-700"><Icon name="edit" size="sm"/></button>
            {level === 0 && (
              <button title="Adicionar Subcategoria" onClick={(e) => { e.stopPropagation(); onAddSubCategory(category.id); }} className="p-1 rounded hover:bg-gray-200 dark:hover:bg-gray-700"><Icon name="folder-plus" size="sm"/></button>
            )}
            <button title="Excluir Categoria" onClick={(e) => { e.stopPropagation(); onDeleteCategory(category); }} className="p-1 rounded hover:bg-gray-200 dark:hover:bg-gray-700"><Icon name="trash" size="sm" className="hover:text-red-500"/></button>
        </div>
      </a>
      
      {hasChildren && isOpen && (
        <ul className="pt-1 border-l border-gray-200 dark:border-gray-700 ml-3.5 pl-3">
          {category.children.map(child => <CategoryItem key={child.id} category={child} level={level + 1} onSelectCategory={onSelectCategory} onAddSubCategory={onAddSubCategory} onEditCategory={onEditCategory} onDeleteCategory={onDeleteCategory} activeCategoryId={activeCategoryId} />)}
        </ul>
      )}
    </li>
  );
};


export function Sidebar({ width, setWidth, categories, onAddCategory, onSelectCategory, onEditCategory, onDeleteCategory, onAddSubCategory, activeCategoryId }) {
    const isResizing = useRef(false);
    const categoryTree = useMemo(() => buildCategoryTree(categories), [categories]);

    const handleMouseMove = useCallback((e) => {
        if (!isResizing.current) return;
        let newWidth = e.clientX;
        if (newWidth < 200) newWidth = 200;
        if (newWidth > 500) newWidth = 500;
        setWidth(newWidth);
    }, [setWidth]);
    
    const handleMouseUp = useCallback(() => {
        isResizing.current = false;
        document.body.style.cursor = 'default';
        document.body.style.userSelect = 'auto';
        document.removeEventListener('mousemove', handleMouseMove);
        document.removeEventListener('mouseup', handleMouseUp);
    }, [handleMouseMove]);

    const handleMouseDown = useCallback((e) => {
        e.preventDefault();
        isResizing.current = true;
        document.body.style.cursor = 'col-resize';
        document.body.style.userSelect = 'none';
        document.addEventListener('mousemove', handleMouseMove);
        document.addEventListener('mouseup', handleMouseUp);
    }, [handleMouseMove, handleMouseUp]);


  return (
    <aside
      className="bg-white dark:bg-gray-900/80 backdrop-blur-sm border-r border-gray-200 dark:border-gray-800 flex-shrink-0 flex flex-col relative"
      style={{ width: `${width}px`, transition: isResizing.current ? 'none' : 'width 0.2s ease-out' }}
    >
      <div className="px-6 h-16 flex items-center justify-between flex-shrink-0 border-b border-gray-200 dark:border-gray-800">
        <div className={`flex items-center gap-3 transition-opacity duration-200 ${width < 100 ? 'opacity-0' : 'opacity-100'}`}>
            <Icon name="bookmark" className="text-primary-600" />
            <span className="font-bold text-lg dark:text-white">Favoritos</span>
        </div>
      </div>
      <div className={`flex-1 overflow-y-auto overflow-x-hidden p-2 transition-opacity duration-200 ${width < 160 ? 'opacity-0' : 'opacity-100'}`}>
         <nav className="p-2">
          <div className="flex justify-between items-center mb-2 px-2">
              <h3 className="text-xs font-semibold uppercase text-gray-500 dark:text-gray-400">Categorias</h3>
              <button onClick={onAddCategory} title="Adicionar Nova Categoria" className="p-1 rounded-full hover:bg-gray-200 dark:hover:bg-gray-700">
                  <Icon name="plus" size="sm"/>
              </button>
          </div>
          <ul>
            <li><a href="#" onClick={(e) => { e.preventDefault(); onSelectCategory(null); }} className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium ${!activeCategoryId ? 'bg-primary-100 dark:bg-primary-900/50 text-primary-700 dark:text-white' : 'hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-600 dark:text-gray-300'}`}><Icon name="bookmark" size="sm" />Todos os Favoritos</a></li>
            {categoryTree.map(cat => <CategoryItem key={cat.id} category={cat} level={0} onSelectCategory={onSelectCategory} onAddSubCategory={onAddSubCategory} onEditCategory={onEditCategory} onDeleteCategory={onDeleteCategory} activeCategoryId={activeCategoryId} />)}
          </ul>
         </nav>
      </div>
      
      <div 
        className="absolute top-0 right-0 h-full w-1.5 cursor-col-resize group z-10"
        onMouseDown={handleMouseDown}
      >
        <div className="w-0.5 h-full bg-transparent group-hover:bg-primary-400 transition-colors duration-200 mx-auto"></div>
      </div>
    </aside>
  );
}
