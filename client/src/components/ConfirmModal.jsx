import React from 'react';
import { Modal } from './Modal.jsx';
import { Icon } from './Icon.jsx';

export function ConfirmModal({ isOpen, onClose, onConfirm, title, children }) {
  if (!isOpen) return null;

  return (
    <Modal isOpen={isOpen} onClose={onClose} title={title}>
      <div className="flex flex-col items-center text-center">
        <div className="mx-auto flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-full bg-red-100 sm:mx-0 sm:h-10 sm:w-10">
          <Icon name="alert-triangle" className="text-red-600" />
        </div>
        <div className="mt-3 text-center sm:mt-4">
          <h3 className="text-base font-semibold leading-6 text-gray-900 dark:text-white" id="modal-title">
            {title}
          </h3>
          <div className="mt-2">
            <div className="text-sm text-gray-500 dark:text-gray-400">
              {children}
            </div>
          </div>
        </div>
      </div>
      <div className="mt-5 sm:mt-6 flex justify-center gap-3">
        <button
          type="button"
          className="inline-flex w-full justify-center rounded-md bg-white dark:bg-gray-700 px-3 py-2 text-sm font-semibold text-gray-900 dark:text-white shadow-sm ring-1 ring-inset ring-gray-300 dark:ring-gray-600 hover:bg-gray-50 dark:hover:bg-gray-600"
          onClick={onClose}
        >
          Cancelar
        </button>
        <button
          type="button"
          className="inline-flex w-full justify-center rounded-md bg-red-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-red-500"
          onClick={onConfirm}
        >
          Confirmar Exclusão
        </button>
      </div>
    </Modal>
  );
}