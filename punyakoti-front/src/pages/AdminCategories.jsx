import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { categoryApi } from '../api/categoryApi';
import { FiPlus, FiEdit2, FiTrash2, FiSave, FiX } from 'react-icons/fi';
import toast from 'react-hot-toast';
import Loader from '../components/Loader';

const AdminCategories = () => {
  const queryClient = useQueryClient();
  const [editingId, setEditingId] = useState(null);
  const [formData, setFormData] = useState({ name: '', description: '', image: '' });
  const [imageFile, setImageFile] = useState(null);
  const [isCreating, setIsCreating] = useState(false);

  const { data: categories = [], isLoading } = useQuery({
    queryKey: ['categories'],
    queryFn: categoryApi.getCategories,
  });

  const createMutation = useMutation({
    mutationFn: (data) => categoryApi.createCategory(data, imageFile),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['categories'] });
      toast.success('Category created successfully');
      setIsCreating(false);
      setFormData({ name: '', description: '', image: '' });
      setImageFile(null);
    },
    onError: (err) => toast.error(err?.message || 'Failed to create category')
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, data }) => categoryApi.updateCategory(id, data, imageFile),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['categories'] });
      toast.success('Category updated successfully');
      setEditingId(null);
      setFormData({ name: '', description: '', image: '' });
      setImageFile(null);
    },
    onError: (err) => toast.error(err?.message || 'Failed to update category')
  });

  const deleteMutation = useMutation({
    mutationFn: (id) => categoryApi.deleteCategory(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['categories'] });
      toast.success('Category deleted successfully');
    },
    onError: (err) => toast.error(err?.message || 'Failed to delete category')
  });

  const handleEdit = (category) => {
    setEditingId(category.id);
    setIsCreating(false);
    setFormData({ name: category.name, description: category.description || '', image: category.image || '' });
    setImageFile(null);
  };

  const handleCancel = () => {
    setEditingId(null);
    setIsCreating(false);
    setFormData({ name: '', description: '', image: '' });
    setImageFile(null);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (editingId) {
      updateMutation.mutate({ id: editingId, data: formData });
    } else {
      createMutation.mutate(formData);
    }
  };

  if (isLoading) return <Loader />;

  return (
    <div className="space-y-6 text-left">
      <div className="flex justify-between items-center pb-4 border-b border-stone-200">
        <div>
          <h1 className="font-display font-extrabold text-2xl text-stone-850 m-0">Categories</h1>
          <p className="text-xs text-stone-500">Manage product categories</p>
        </div>
        {!isCreating && !editingId && (
          <button
            onClick={() => setIsCreating(true)}
            className="flex items-center gap-2 bg-primary text-white px-4 py-2 rounded-xl text-sm font-semibold hover:bg-primary-light transition-colors"
          >
            <FiPlus /> Add Category
          </button>
        )}
      </div>

      {(isCreating || editingId) && (
        <form onSubmit={handleSubmit} className="bg-white p-6 rounded-3xl border border-stone-200 shadow-sm space-y-4">
          <h3 className="font-bold text-stone-800">{editingId ? 'Edit Category' : 'New Category'}</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-1">
              <label className="text-xs font-bold text-stone-600 uppercase">Name</label>
              <input
                type="text"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className="w-full bg-stone-50 border border-stone-250 rounded-xl px-3.5 py-2 text-sm focus:outline-hidden focus:border-primary"
                required
              />
            </div>
            <div className="space-y-1">
              <label className="text-xs font-bold text-stone-600 uppercase">Image File</label>
              <input
                type="file"
                accept="image/*"
                onChange={(e) => setImageFile(e.target.files[0])}
                className="w-full bg-stone-50 border border-stone-250 rounded-xl px-3.5 py-1.5 text-sm focus:outline-hidden focus:border-primary file:mr-4 file:py-1 file:px-3 file:rounded-full file:border-0 file:text-xs file:font-semibold file:bg-primary/10 file:text-primary hover:file:bg-primary/20"
              />
              {imageFile && <p className="text-[10px] text-stone-500 truncate pt-1">Selected: {imageFile.name}</p>}
              {!imageFile && formData.image && <p className="text-[10px] text-stone-500 truncate pt-1">Current: {formData.image}</p>}
            </div>
            <div className="space-y-1 md:col-span-2">
              <label className="text-xs font-bold text-stone-600 uppercase">Description</label>
              <textarea
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                className="w-full bg-stone-50 border border-stone-250 rounded-xl px-3.5 py-2 text-sm focus:outline-hidden focus:border-primary h-24"
              />
            </div>
          </div>
          <div className="flex justify-end gap-3 pt-2">
            <button
              type="button"
              onClick={handleCancel}
              className="px-4 py-2 text-sm font-bold text-stone-500 bg-stone-100 rounded-xl hover:bg-stone-200"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={createMutation.isPending || updateMutation.isPending}
              className="flex items-center gap-2 px-4 py-2 text-sm font-bold text-white bg-primary rounded-xl hover:bg-primary-light"
            >
              <FiSave /> {editingId ? 'Update' : 'Create'}
            </button>
          </div>
        </form>
      )}

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {categories.map((category) => (
          <div key={category.id} className="bg-white rounded-3xl overflow-hidden border border-stone-200 shadow-sm flex flex-col">
            <div className="h-32 bg-stone-100 relative">
              {category.image ? (
                <img src={category.image} alt={category.name} className="w-full h-full object-cover" />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-stone-400 font-medium">No Image</div>
              )}
            </div>
            <div className="p-4 flex-grow space-y-2">
              <h4 className="font-bold text-stone-800">{category.name}</h4>
              <p className="text-xs text-stone-500 line-clamp-2">{category.description}</p>
            </div>
            <div className="p-4 border-t border-stone-100 flex justify-end gap-2 bg-stone-50/50">
              <button
                onClick={() => handleEdit(category)}
                className="p-2 text-blue-600 bg-blue-50 rounded-xl hover:bg-blue-100 transition-colors"
                title="Edit"
              >
                <FiEdit2 className="w-4 h-4" />
              </button>
              <button
                onClick={() => {
                  if (window.confirm('Are you sure you want to delete this category?')) {
                    deleteMutation.mutate(category.id);
                  }
                }}
                className="p-2 text-red-600 bg-red-50 rounded-xl hover:bg-red-100 transition-colors"
                title="Delete"
              >
                <FiTrash2 className="w-4 h-4" />
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default AdminCategories;
