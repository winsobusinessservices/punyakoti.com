import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { whyChooseUsApi } from '../api/whyChooseUsApi';
import { FiPlus, FiEdit2, FiTrash2, FiStar } from 'react-icons/fi';
import Modal from '../components/Modal';
import Loader from '../components/Loader';
import toast from 'react-hot-toast';

const AdminWhyChooseUs = () => {
  const queryClient = useQueryClient();
  const { data: usps = [], isLoading: loading } = useQuery({
    queryKey: ['usps'],
    queryFn: whyChooseUsApi.getAll,
  });

  const deleteMutation = useMutation({
    mutationFn: whyChooseUsApi.delete,
    onSuccess: () => {
      toast.success('USP deleted');
      queryClient.invalidateQueries({ queryKey: ['usps'] });
    },
    onError: () => toast.error('Delete failed')
  });

  const createMutation = useMutation({
    mutationFn: (data) => whyChooseUsApi.create(data.payload, data.imageFile),
    onSuccess: () => {
      toast.success('USP created successfully!');
      queryClient.invalidateQueries({ queryKey: ['usps'] });
      setIsOpen(false);
    },
    onError: () => toast.error('Save failed'),
    onSettled: () => setFormLoading(false)
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, payload, imageFile }) => whyChooseUsApi.update(id, payload, imageFile),
    onSuccess: () => {
      toast.success('USP updated successfully!');
      queryClient.invalidateQueries({ queryKey: ['usps'] });
      setIsOpen(false);
    },
    onError: () => toast.error('Save failed'),
    onSettled: () => setFormLoading(false)
  });

  // Modal states
  const [isOpen, setIsOpen] = useState(false);
  const [editUsp, setEditUsp] = useState(null); // null if adding
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [icon, setIcon] = useState('');
  const [imageFile, setImageFile] = useState(null);
  const [formLoading, setFormLoading] = useState(false);

  const openAddModal = () => {
    setEditUsp(null);
    setTitle('');
    setDescription('');
    setIcon('');
    setImageFile(null);
    setIsOpen(true);
  };

  const openEditModal = (item) => {
    setEditUsp(item);
    setTitle(item.title);
    setDescription(item.description);
    setIcon(item.icon);
    setImageFile(null);
    setIsOpen(true);
  };

  const handleDelete = (id) => {
    if (window.confirm('Are you sure you want to delete this USP?')) {
      deleteMutation.mutate(id);
    }
  };

  const handleSave = (e) => {
    e.preventDefault();
    if (!title || !description) {
      toast.error('All fields are required.');
      return;
    }

    setFormLoading(true);
    if (editUsp) {
      updateMutation.mutate({ id: editUsp.id, payload: { title, description, icon }, imageFile });
    } else {
      createMutation.mutate({ payload: { title, description, icon }, imageFile });
    }
  };

  return (
    <div className="space-y-6 text-left">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 pb-4 border-b border-stone-200">
        <div>
          <h1 className="font-display font-extrabold text-2xl text-stone-850 m-0">Why Choose Us USPs</h1>
          <p className="text-xs text-stone-500">Edit the USP cards displayed in the storefront Home page.</p>
        </div>
        <button
          onClick={openAddModal}
          className="inline-flex items-center gap-2 bg-primary hover:bg-primary-light text-white font-semibold text-xs px-4 py-2.5 rounded-xl shadow-md transition-all active:scale-95"
        >
          <FiPlus className="w-4 h-4" />
          <span>Add New USP</span>
        </button>
      </div>

      {loading ? (
        <Loader />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {usps.map((item) => (
            <div
              key={item.id}
              className="bg-white border border-stone-200/80 rounded-2xl p-5 flex items-start justify-between gap-4"
            >
              <div className="space-y-2">
                <div className="flex items-center gap-3">
                  <span className="w-8 h-8 rounded-lg bg-primary/5 text-primary flex items-center justify-center font-bold text-xs overflow-hidden">
                    {item.icon && item.icon.startsWith('http') ? <img src={item.icon} alt="" className="w-full h-full object-cover" /> : (item.icon ? item.icon.substring(0, 3) : 'USP')}
                  </span>
                  <h3 className="font-display font-semibold text-stone-800 text-sm sm:text-base leading-tight">
                    {item.title}
                  </h3>
                </div>
                <p className="text-xs sm:text-sm text-stone-500 leading-relaxed pl-1">{item.description}</p>
              </div>

              <div className="flex shrink-0 gap-1 pt-1">
                <button
                  onClick={() => openEditModal(item)}
                  className="p-2 text-stone-500 hover:text-primary hover:bg-stone-100 rounded-lg transition-all"
                  title="Edit USP"
                >
                  <FiEdit2 className="w-4 h-4" />
                </button>
                <button
                  onClick={() => handleDelete(item.id)}
                  className="p-2 text-stone-400 hover:text-rose-600 hover:bg-stone-100 rounded-lg transition-all"
                  title="Delete USP"
                >
                  <FiTrash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* USP Form Modal */}
      <Modal
        isOpen={isOpen}
        onClose={() => setIsOpen(false)}
        title={editUsp ? 'Edit USP Item' : 'Create New USP Card'}
      >
        <form onSubmit={handleSave} className="space-y-4">
          <div className="space-y-1">
            <label className="text-xs font-bold text-stone-600 uppercase">USP Title</label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full bg-stone-50 border border-stone-250 rounded-xl px-3.5 py-2 text-sm focus:outline-hidden focus:border-primary"
              required
            />
          </div>

            <div className="space-y-1 md:col-span-2">
              <label className="text-xs font-bold text-stone-600 uppercase">Icon Image</label>
              <input
                type="file"
                accept="image/*"
                onChange={(e) => setImageFile(e.target.files[0])}
                className="w-full bg-stone-50 border border-stone-250 rounded-xl px-3.5 py-1.5 text-sm focus:outline-hidden focus:border-primary file:mr-4 file:py-1 file:px-3 file:rounded-full file:border-0 file:text-xs file:font-semibold file:bg-primary/10 file:text-primary hover:file:bg-primary/20"
              />
              {imageFile && <p className="text-[10px] text-stone-500 truncate pt-1">Selected: {imageFile.name}</p>}
              {!imageFile && icon && <p className="text-[10px] text-stone-500 truncate pt-1">Current URL: {icon}</p>}
            </div>

          <div className="space-y-1">
            <label className="text-xs font-bold text-stone-600 uppercase">Description</label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full bg-stone-50 border border-stone-250 rounded-xl px-3.5 py-2 text-sm focus:outline-hidden focus:border-primary h-24"
              required
            />
          </div>

          <div className="flex justify-end gap-3 pt-4 border-t border-stone-100">
            <button
              type="button"
              onClick={() => setIsOpen(false)}
              className="px-4 py-2 border border-stone-200 rounded-xl text-stone-600 text-sm font-semibold hover:bg-stone-50"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={formLoading}
              className="bg-primary hover:bg-primary-light text-white font-semibold px-5 py-2 rounded-xl text-sm transition-all"
            >
              {formLoading ? 'Saving...' : 'Save USP'}
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
};

export default AdminWhyChooseUs;
