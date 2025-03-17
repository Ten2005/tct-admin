import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';
const supabase = createClient(supabaseUrl, supabaseKey);

export interface FetchedAttribute extends SubmittingAttribute {
  attribute_id: number;
}

export interface SubmittingAttribute {
    attribute_name: string;
    attribute_type: string;
    is_required: boolean;
}

export interface UserAttribute extends FetchedAttribute {
  user_id: number;
  value?: string;
}

export interface UserData {
  attributes: UserAttribute[];
}

export async function getAttributes() {
  const { data, error } = await supabase
    .from('userAttributes-tct')
    .select('*')
    .order('attribute_id', { ascending: false });

  if (error) {
    console.error('Error fetching attributes:', error);
    throw new Error('Failed to fetch attributes data');
  }

  return data;
}

export async function createAttribute(attributeData: SubmittingAttribute) {
    const { data, error } = await supabase
      .from('userAttributes-tct')
      .insert([attributeData])
      .select();
  
    if (error) {
      console.error('Error creating attribute:', error);
      throw new Error('Failed to create attribute');
    }
  
    return data;
}

export async function updateAttribute(attributeId: number, attributeData: SubmittingAttribute) {
  const { data, error } = await supabase
    .from('userAttributes-tct')
    .update(attributeData)
    .eq('attribute_id', attributeId)
    .select();

  if (error) {
    console.error('Error updating attribute:', error);
    throw new Error('Failed to update attribute');
  }

  return data;
}

export async function deleteAttribute(attributeId: number) {
  const { error } = await supabase
    .from('userAttributes-tct')
    .delete()
    .eq('attribute_id', attributeId);

  if (error) {
    console.error('Error deleting attribute:', error);
    throw new Error('Failed to delete attribute');
  }

  return true;
}

export async function getUserAttributes(userId: number) {
  const { data, error } = await supabase
    .from('userAttributeValues-tct')
    .select('*, userAttributes-tct!inner(*)')
    .eq('user_id', userId);

  if (error) {
    console.error('Error fetching user attributes:', error);
    throw new Error('Failed to fetch user attributes');
  }

  return data;
}

export async function deleteUser(userId: number) {
  // First delete user attribute values
  const { error: attrError } = await supabase
    .from('userAttributeValues-tct')
    .delete()
    .eq('user_id', userId);

  if (attrError) {
    console.error('Error deleting user attributes:', attrError);
    throw new Error('Failed to delete user attributes');
  }

  // Then delete the user
  const { error } = await supabase
    .from('users-tct')
    .delete()
    .eq('user_id', userId);

  if (error) {
    console.error('Error deleting user:', error);
    throw new Error('Failed to delete user');
  }

  return true;
}

export async function getAllUsers() {
  const { data, error } = await supabase
    .from('users-tct')
    .select('*');

  if (error) {
    console.error('Error fetching users:', error);
    throw new Error('Failed to fetch users');
  }

  return data;
}

export async function createUser(userData: UserData) {
  // First create the user
  const { data, error } = await supabase
    .from('users-tct')
    .insert([{}])
    .select();
  
  const userId = data?.[0]?.user_id;

  if (!userId) {
    throw new Error('Failed to create user: No user ID returned');
  }

  const userAttributeValues = userData.attributes.map(attr => ({
    user_id: userId,
    attribute_id: attr.attribute_id,
    value_text: attr.attribute_type === 'string' ? attr.value || '' : null,
    value_number: attr.attribute_type === 'number' && attr.value ? parseFloat(attr.value) : null,
    value_date: attr.attribute_type === 'date' ? attr.value : null,
  }));

  const { error: attrError } = await supabase
    .from('userAttributeValues-tct')
    .insert(userAttributeValues);

  if (error || attrError) {
    console.error('Error creating user:', error || attrError);
    throw new Error('Failed to create user');
  }

  return data;
}

export async function updateUser(userData: UserData) {
  const userId = userData.attributes[0]?.user_id;
  
  if (!userId) {
    throw new Error('Failed to update user: No user ID provided');
  }

  // First delete existing attribute values
  const { error: deleteError } = await supabase
    .from('userAttributeValues-tct')
    .delete()
    .eq('user_id', userId);

  if (deleteError) {
    console.error('Error deleting existing attributes:', deleteError);
    throw new Error('Failed to update user attributes');
  }

  // Then insert new attribute values
  const userAttributeValues = userData.attributes.map(attr => ({
    user_id: userId,
    attribute_id: attr.attribute_id,
    value_text: attr.attribute_type === 'string' ? attr.value || '' : null,
    value_number: attr.attribute_type === 'number' && attr.value ? parseFloat(attr.value) : null,
    value_date: attr.attribute_type === 'date' ? attr.value : null,
  }));

  const { error: insertError } = await supabase
    .from('userAttributeValues-tct')
    .insert(userAttributeValues);

  if (insertError) {
    console.error('Error updating user attributes:', insertError);
    throw new Error('Failed to update user attributes');
  }

  return { user_id: userId };
}
