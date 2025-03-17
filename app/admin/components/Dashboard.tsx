'use client';

import { useState, useEffect } from 'react';
import {
  FetchedAttribute,
  getAttributes,
  createUser,
  updateUser,
  getAllUsers,
  getUserAttributes,
  deleteUser
} from '@/app/lib/data';
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

interface User {
  user_id: number;
  created_at: string;
  // Add other fields as needed
}

// Interface for user attribute values from database
interface UserAttributeValue {
  user_id: number;
  attribute_id: number;
  value_text: string | null;
  value_number: number | null;
  value_date: string | null;
  'userAttributes-tct': {
    attribute_id: number;
    attribute_name: string;
    attribute_type: string;
    is_required: boolean;
  };
}

export default function Candidates() {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState<number | null>(null);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const [userToDelete, setUserToDelete] = useState<number | null>(null);
  
  return (
    <div>
      <h2 className="text-2xl font-bold mb-4">ダッシュボード</h2>
      <div className="bg-white rounded shadow">
        <h2 className="text-xl font-semibold px-4 py-4">新入生一覧</h2>
        <div className="overflow-x-auto shadow">
          <AttributesTable 
            onEdit={userId => {
              setSelectedUser(userId);
              setIsOpen(true);
            }} 
            onDelete={(userId) => {
              setUserToDelete(userId);
              setIsDeleteOpen(true);
            }}
          />
        </div>
        <div className="p-4 flex justify-end">
          <button 
            className="shadow-md px-4 py-2 rounded bg-gray-600 text-white hover:bg-gray-700" 
            onClick={() => {
              setSelectedUser(null);
              setIsOpen(!isOpen);
            }}
          >
            新入生を追加
          </button>
        </div>
      </div>
      
      {isOpen && <EditOverlay userId={selectedUser} setIsOpen={setIsOpen} />}
      
      <ConfirmationModal
        isOpen={isDeleteOpen}
        onClose={() => setIsDeleteOpen(false)}
        title="新入生を削除"
        message="本当に削除しますか？"
        onConfirm={async () => {
          if (userToDelete) {
            await deleteUser(userToDelete);
            setIsDeleteOpen(false);
            window.location.reload();
          }
        }}
      />
    </div>
  );
}

function EditOverlay({
  userId,
  setIsOpen
  }: {
    userId: number | null;
    setIsOpen: (isOpen: boolean) => void
  }) {
  const [attributes, setAttributes] = useState<FetchedAttribute[]>([]);
  const [attributeValues, setAttributeValues] = useState<{[key: string]: string}>({});
  
  useEffect(() => {
    const fetchAttributes = async () => {
      const attributes = await getAttributes();
      setAttributes(attributes);

      // If editing an existing user, fetch their attribute values
      if (userId) {
        const userAttributesData = await getUserAttributes(userId);
        const userAttributes = userAttributesData as unknown as UserAttributeValue[];
        const values: {[key: string]: string} = {};
        
        userAttributes.forEach((attr) => {
          // Determine which value field to use based on attribute type
          let value = null;
          if (attr.value_text !== null) value = attr.value_text;
          else if (attr.value_number !== null) value = attr.value_number.toString();
          else if (attr.value_date !== null) value = attr.value_date;
          
          values[attr.attribute_id] = value || '';
        });
        
        setAttributeValues(values);
      }
    };
    fetchAttributes();
  }, [userId]);

  const handleInputChange = (attributeId: number, value: string) => {
    setAttributeValues(prev => ({
      ...prev,
      [attributeId]: value
    }));
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    
    // Collect all attribute values from the form
    const userAttributes = attributes.map(attribute => ({
      user_id: userId || 0, // This will be set by the backend for new users
      attribute_id: attribute.attribute_id,
      attribute_name: attribute.attribute_name,
      attribute_type: attribute.attribute_type,
      is_required: attribute.is_required,
      value: attributeValues[attribute.attribute_id] || ''
    }));

    try {
      if (userId) {
        // Update existing user
        await updateUser({ attributes: userAttributes });
      } else {
        // Create new user
        await createUser({ attributes: userAttributes });
      }
      setIsOpen(false);
      // Refresh the users list
      window.location.reload();
    } catch (error) {
      console.error('Error saving user:', error);
      alert('エラーが発生しました。もう一度お試しください。');
    }
  };
  
  return (
    <Modal
      isOpen={true}
      onClose={() => setIsOpen(false)}
      title={userId ? '新入生を編集' : '新入生を追加'}
      className="min-h-96"
    >
      <form
        onSubmit={handleSubmit}
        className="flex flex-col gap-4 max-h-96 overflow-auto py-4"
      >
        <div className="flex flex-col gap-4">
          {attributes.map((attribute) => (
            <div
              key={attribute.attribute_id}
              className="flex flex-col gap-2"
            >
              <label
                htmlFor={attribute.attribute_name}
                className="text-sm font-medium"
              >
                {attribute.attribute_name}
                {attribute.is_required && <span className="text-red-500 ml-1 text-lg">*</span>}
              </label>
              <input 
                type={attribute.attribute_type === 'date' ? 'date' : 
                      attribute.attribute_type === 'number' ? 'number' : 'text'} 
                id={attribute.attribute_name} 
                className="border border-gray-300 rounded-md p-2" 
                required={attribute.is_required}
                onChange={(e) => handleInputChange(attribute.attribute_id, e.target.value)}
                value={attributeValues[attribute.attribute_id] || ''}
                placeholder={
                  attribute.attribute_type === 'date' ? '日付を選択' : 
                  attribute.attribute_type === 'number' ? '数値を入力' : 'テキストを入力'
                }
              />
            </div>
          ))}
          <div className="flex justify-end mt-4">
            <button
              type="button" 
              className="mr-2 px-4 py-2 border border-gray-300 rounded-md text-gray-700"
              onClick={() => setIsOpen(false)}
            >
              キャンセル
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-gray-600 text-white rounded-md hover:bg-gray-700"
            >
              {userId ? '更新' : '追加'}
            </button>
          </div>
        </div>
      </form>
    </Modal>
  );
}

interface AttributesTableProps {
  onEdit: (userId: number) => void;
  onDelete: (userId: number) => void;
}

function AttributesTable({ onEdit, onDelete }: AttributesTableProps) {
  const [users, setUsers] = useState<User[]>([]);
  const [userAttributes, setUserAttributes] = useState<{[key: number]: UserAttributeValue[]}>({});
  const [attributes, setAttributes] = useState<FetchedAttribute[]>([]);
  
  useEffect(() => {
    fetchUsers();
    fetchAttributes();
  }, []);
  
  const fetchUsers = async () => {
    const usersData = await getAllUsers();
    setUsers(usersData);
    
    // Fetch attributes for each user
    const attributes: {[key: number]: UserAttributeValue[]} = {};
    for (const user of usersData) {
      const userAttrsData = await getUserAttributes(user.user_id);
      const userAttrs = userAttrsData as unknown as UserAttributeValue[];
      attributes[user.user_id] = userAttrs;
    }
    setUserAttributes(attributes);
  };
  
  const fetchAttributes = async () => {
    const attributesData = await getAttributes();
    setAttributes(attributesData);
  };
  
  // Get attribute value for a user
  const getAttributeValue = (userId: number, attributeId: number) => {
    if (!userAttributes[userId]) return '-';
    
    const attr = userAttributes[userId].find(attr => 
      attr.attribute_id === attributeId);
    
    if (!attr) return '-';
    
    if (attr.value_text !== null) return attr.value_text;
    if (attr.value_number !== null) return attr.value_number.toString();
    if (attr.value_date !== null) return attr.value_date;
    
    return '-';
  };
  
  return (
    <Table>
      <TableHeader>
        {attributes.map(attr => (
          <TableHeadCell key={attr.attribute_id}>
            {attr.attribute_name}
          </TableHeadCell>
        ))}
        <TableHeadCell>編集</TableHeadCell>
        <TableHeadCell>削除</TableHeadCell>
      </TableHeader>
      <TableBody>
        {users.map((user) => (
          <TableRow key={user.user_id}>
            {attributes.map(attr => (
              <TableCell key={`${user.user_id}-${attr.attribute_id}`}>
                {getAttributeValue(user.user_id, attr.attribute_id)}
              </TableCell>
            ))}
            <TableCell className="text-sm text-gray-500">
              <EditButton onClick={() => onEdit(user.user_id)} />
            </TableCell>
            <TableCell className="text-sm text-gray-500">
              <DeleteButton onClick={() => onDelete(user.user_id)} />
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}