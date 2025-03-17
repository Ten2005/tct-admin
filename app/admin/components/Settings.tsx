'use client';

import {
  getAttributes,
  FetchedAttribute,
  SubmittingAttribute,
  createAttribute,
  updateAttribute,
  deleteAttribute,
} from '@/app/lib/data';
import { useState, useEffect } from 'react';
import { 
  Table,
  TableHeader,
  TableBody,
  TableRow,
  TableHeadCell,
  TableCell,
  EditButton,
  DeleteButton,
  Modal,
  ConfirmationModal
} from './common/Table';

export default function Settings() {
  const [attributes, setAttributes] = useState<FetchedAttribute[]>([]);
  const [newAttribute, setNewAttribute] = useState<SubmittingAttribute>({
    attribute_name: '',
    attribute_type: '',
    is_required: false,
  });
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [editingAttribute, setEditingAttribute] = useState<FetchedAttribute | null>(null);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);

  useEffect(() => {
    const fetchAttributes = async () => {
      const attributes = await getAttributes();
      setAttributes(attributes);
    };
    fetchAttributes();
  }, []);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      const created = await createAttribute(newAttribute);
      setAttributes([...attributes, created[0]]);
      setNewAttribute({
        attribute_name: '',
        attribute_type: '',
        is_required: false,
      });
      setIsCreateOpen(false);
    } catch (error) {
      console.error('Error creating attribute:', error);
    }
  };

  const handleEdit = (attribute: FetchedAttribute) => {
    setEditingAttribute(attribute);
    setIsEditOpen(true);
  };

  const handleEditSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!editingAttribute) return;
    
    try {
      const updated = await updateAttribute(
        editingAttribute.attribute_id, 
        {
          attribute_name: editingAttribute.attribute_name,
          attribute_type: editingAttribute.attribute_type,
          is_required: editingAttribute.is_required
        }
      );
      
      setAttributes(attributes.map(attr => 
        attr.attribute_id === editingAttribute.attribute_id ? updated[0] : attr
      ));
      
      setEditingAttribute(null);
      setIsEditOpen(false);
    } catch (error) {
      console.error('Error updating attribute:', error);
    }
  };

  const handleDelete = async (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    if (!editingAttribute) return;
    
    try {
      await deleteAttribute(editingAttribute.attribute_id);
      setAttributes(attributes.filter(attr => attr.attribute_id !== editingAttribute.attribute_id));
      setEditingAttribute(null);
      setIsDeleteOpen(false);
    } catch (error) {
      console.error('Error deleting attribute:', error);
    }
  };
  

  return (
    <div>
      <h1 className="text-2xl font-bold mb-4">設定</h1>
      <div className="bg-white rounded shadow">
        <h2 className="text-xl font-semibold px-4 py-4">項目一覧</h2>
        <div className="overflow-x-auto shadow">
          <Table>
            <TableHeader>
              <TableHeadCell>項目名</TableHeadCell>
              <TableHeadCell>データの種類</TableHeadCell>
              <TableHeadCell>必須・任意</TableHeadCell>
              <TableHeadCell>編集</TableHeadCell>
              <TableHeadCell>削除</TableHeadCell>
            </TableHeader>
            <TableBody>
              {attributes.map((attribute) => (
                <TableRow key={attribute.attribute_id}>
                  <TableCell>{attribute.attribute_name}</TableCell>
                  <TableCell>
                    {attribute.attribute_type === 'string' && 'テキスト'}
                    {attribute.attribute_type === 'number' && '数値'}
                    {attribute.attribute_type === 'date' && '日付'}
                  </TableCell>
                  <TableCell>
                    <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${attribute.is_required ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'}`}>
                      {attribute.is_required ? '必須' : '任意'}
                    </span>
                  </TableCell>
                  <TableCell className="text-sm text-gray-500">
                    <EditButton onClick={() => handleEdit(attribute)} />
                  </TableCell>
                  <TableCell className="text-sm text-gray-500">
                    <DeleteButton
                      onClick={() => {
                        setIsDeleteOpen(true);
                        setEditingAttribute(attribute);
                      }}
                    />
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
        <div className="p-4 flex justify-end">
          <button
          className="shadow-md px-4 py-2 rounded bg-gray-600 text-white hover:bg-gray-700"
          onClick={() => setIsCreateOpen(true)}
          >
            項目を追加
          </button>
        </div>
      </div>

      <Modal
        isOpen={isCreateOpen}
        onClose={() => setIsCreateOpen(false)}
        title="項目を追加"
      >
        <form
          onSubmit={handleSubmit}
          className="flex flex-col gap-4"
        >
          <div className="flex flex-col gap-2">
            <label htmlFor="attribute_name" className="text-sm font-medium">項目名</label>
            <input 
              type="text" 
              id="attribute_name" 
              className="border border-gray-300 rounded-md p-2"
              value={newAttribute.attribute_name}
              onChange={(e) => setNewAttribute({...newAttribute, attribute_name: e.target.value})}
              required
            />
          </div>
          <div className="flex flex-col gap-2">
            <label htmlFor="attribute_type" className="text-sm font-medium">データの種類</label>
            <select 
              id="attribute_type" 
              className="border border-gray-300 rounded-md p-2 text-base"
              value={newAttribute.attribute_type}
              onChange={(e) => setNewAttribute({...newAttribute, attribute_type: e.target.value})}
              required
            >
              <option value="text" className="text-base">テキスト</option>
              <option value="number" className="text-base">数値</option>
              <option value="date" className="text-base">日付</option>
            </select>
          </div>
          <div className="flex items-center gap-2">
            <input 
              type="checkbox" 
              id="is_required" 
              className="h-4 w-4"
              checked={newAttribute.is_required}
              onChange={(e) => setNewAttribute({...newAttribute, is_required: e.target.checked})}
            />
            <label htmlFor="is_required" className="text-sm font-medium">必須項目</label>
          </div>
          <div className="flex justify-end mt-4">
            <button 
              type="button" 
              className="mr-2 px-4 py-2 border border-gray-300 rounded-md text-gray-700"
              onClick={() => setIsCreateOpen(false)}
            >
              キャンセル
            </button>
            <button 
              type="submit" 
              className="px-4 py-2 bg-gray-600 text-white rounded-md hover:bg-gray-700"
            >
              追加
            </button>
          </div>
        </form>
      </Modal>

      <Modal
        isOpen={isEditOpen && !!editingAttribute}
        onClose={() => setIsEditOpen(false)}
        title="項目を編集"
      >
        {editingAttribute && (
          <form
            onSubmit={handleEditSubmit}
            className="flex flex-col gap-4"
          >
            <div className="flex flex-col gap-2">
              <label htmlFor="edit_attribute_name" className="text-sm font-medium">項目名</label>
              <input 
                type="text" 
                id="edit_attribute_name" 
                className="border border-gray-300 rounded-md p-2"
                value={editingAttribute.attribute_name}
                onChange={(e) => setEditingAttribute({...editingAttribute, attribute_name: e.target.value})}
                required
              />
            </div>
            <div className="flex flex-col gap-2">
              <label htmlFor="edit_attribute_type" className="text-sm font-medium">データの種類</label>
              <select 
                id="edit_attribute_type" 
                className="border border-gray-300 rounded-md p-2 text-base"
                value={editingAttribute.attribute_type}
                onChange={(e: React.ChangeEvent<HTMLSelectElement>) => setEditingAttribute({...editingAttribute, attribute_type: e.target.value})}
                required
              >
                <option value="text" className="text-base">テキスト</option>
                <option value="number" className="text-base">数値</option>
                <option value="date" className="text-base">日付</option>
              </select>
            </div>
            <div className="flex items-center gap-2">
              <input 
                type="checkbox" 
                id="edit_is_required" 
                className="h-4 w-4"
                checked={editingAttribute.is_required}
                onChange={(e) => setEditingAttribute({...editingAttribute, is_required: e.target.checked})}
              />
              <label htmlFor="edit_is_required" className="text-sm font-medium">必須項目</label>
            </div>
            <div className="flex justify-end mt-4">
              <button 
                type="button" 
                className="mr-2 px-4 py-2 border border-gray-300 rounded-md text-gray-700"
                onClick={() => setIsEditOpen(false)}
              >
                キャンセル
              </button>
              <button 
                type="submit" 
                className="px-4 py-2 bg-gray-600 text-white rounded-md hover:bg-gray-700"
              >
                更新
              </button>
            </div>
          </form>
        )}
      </Modal>

      <ConfirmationModal
        isOpen={isDeleteOpen && !!editingAttribute}
        onClose={() => setIsDeleteOpen(false)}
        title="項目を削除"
        message="本当に削除しますか？"
        onConfirm={() => {
          if (editingAttribute) {
            deleteAttribute(editingAttribute.attribute_id)
              .then(() => {
                setAttributes(attributes.filter(attr => attr.attribute_id !== editingAttribute.attribute_id));
                setEditingAttribute(null);
                setIsDeleteOpen(false);
              })
              .catch(error => {
                console.error('Error deleting attribute:', error);
              });
          }
        }}
      />
    </div>
  );
}