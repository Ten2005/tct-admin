'use client';

import { ReactNode } from 'react';

interface TableProps {
  children: ReactNode;
  className?: string;
}

export function Table({ children, className = '' }: TableProps) {
  return (
    <div className={`overflow-x-auto ${className}`}>
      <table className="min-w-full divide-y divide-gray-200">
        {children}
      </table>
    </div>
  );
}

interface TableHeaderProps {
  children: ReactNode;
  className?: string;
}

export function TableHeader({ children, className = '' }: TableHeaderProps) {
  return (
    <thead className={`bg-gray-50 ${className}`}>
      <tr>
        {children}
      </tr>
    </thead>
  );
}

interface TableBodyProps {
  children: ReactNode;
  className?: string;
}

export function TableBody({ children, className = '' }: TableBodyProps) {
  return (
    <tbody className={`bg-white divide-y divide-gray-200 ${className}`}>
      {children}
    </tbody>
  );
}

interface TableRowProps {
  children: ReactNode;
  className?: string;
}

export function TableRow({ children, className = '' }: TableRowProps) {
  return (
    <tr className={className}>
      {children}
    </tr>
  );
}

interface TableHeadCellProps {
  children: ReactNode;
  className?: string;
}

export function TableHeadCell({ children, className = '' }: TableHeadCellProps) {
  return (
    <th className={`px-4 py-3 whitespace-nowrap text-center text-xs font-medium text-gray-500 uppercase tracking-wider ${className}`}>
      {children}
    </th>
  );
}

interface TableCellProps {
  children: ReactNode;
  className?: string;
}

export function TableCell({ children, className = '' }: TableCellProps) {
  return (
    <td className={`px-4 py-4 text-center whitespace-nowrap ${className}`}>
      {children}
    </td>
  );
}

interface EditButtonProps {
  onClick: () => void;
  className?: string;
}

export function EditButton({ onClick, className = '' }: EditButtonProps) {
  return (
    <button
      className={`text-gray-600 hover:text-gray-900 mr-2 ${className}`}
      aria-label="編集"
      onClick={onClick}
    >
      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
      </svg>
    </button>
  );
}

interface DeleteButtonProps {
  onClick: () => void;
  className?: string;
}

export function DeleteButton({ onClick, className = '' }: DeleteButtonProps) {
  return (
    <button 
      className={`text-red-600 hover:text-red-900 px-1 ${className}`}
      aria-label="削除"
      onClick={onClick}
    >
      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
      </svg>
    </button>
  );
}

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  children: ReactNode;
  className?: string;
}

export function Modal({ isOpen, onClose, title, children, className = '' }: ModalProps) {
  if (!isOpen) return null;
  
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center">
      <div className={`bg-white p-4 m-2 rounded shadow relative w-full max-w-xl h-fit ${className}`}>
        <button 
          className="absolute top-2 right-4 text-gray-500 hover:text-gray-700" 
          onClick={onClose}
        >
          ✕
        </button>
        <h2 className="font-bold mb-4">{title}</h2>
        {children}
      </div>
    </div>
  );
}

interface ConfirmationModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  message: string;
  confirmText?: string;
  cancelText?: string;
  onConfirm: () => void;
  className?: string;
}

export function ConfirmationModal({ 
  isOpen, 
  onClose, 
  title, 
  message, 
  confirmText = '削除', 
  cancelText = 'キャンセル',
  onConfirm,
  className = ''
}: ConfirmationModalProps) {
  if (!isOpen) return null;
  
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center">
      <div className={`bg-white p-4 m-2 rounded shadow relative w-full max-w-xl h-fit ${className}`}>
        <button 
          className="absolute top-2 right-4 text-gray-500 hover:text-gray-700" 
          onClick={onClose}
        >
          ✕
        </button>
        <h2 className="font-bold mb-4">{title}</h2>
        <p className="mb-4">{message}</p>
        <div className="flex justify-end mt-4">
          <button 
            type="button" 
            className="mr-2 px-4 py-2 border border-gray-300 rounded-md text-gray-700"
            onClick={onClose}
          >
            {cancelText}
          </button>
          <button 
            type="submit" 
            onClick={onConfirm}
            className="px-4 py-2 bg-gray-600 text-white rounded-md hover:bg-gray-700"
          >
            {confirmText}
          </button>
        </div>
      </div>
    </div>
  );
} 