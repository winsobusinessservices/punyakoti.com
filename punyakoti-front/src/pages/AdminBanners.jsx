import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { bannerApi } from '../api/bannerApi';
import { FiPlus, FiEdit2, FiTrash2, FiSave, FiX } from 'react-icons/fi';
import toast from 'react-hot-toast';
import Loader from '../components/Loader';

const AdminBanners = () => {
  const queryClient = useQueryClient();
  const [editingId, setEditingId] = useState(null);
  const [formData, setFormData] = useState({ title: '', subtitle: '', imageUrl: '', buttonText: '', buttonUrl: '' });
  const [imageFile, setImageFile] = useState(null);
  const [isCreating, setIsCreating] = useState(false);

  const { data: banners = [], isLoading } = useQuery({
    queryKey: ['banners'],
    queryFn: bannerApi.getBanners,
  });

  const createMutation = useMutation({
    mutationFn: (data) => bannerApi.createBanner(data, imageFile),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['banners'] });
      toast.success('Banner created successfully');
      setIsCreating(false);
      setFormData({ title: '', subtitle: '', imageUrl: '', buttonText: '', buttonUrl: '' });
      setImageFile(null);
    },
    onError: (err) => toast.error(err?.message || 'Failed to create banner')
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, data }) => bannerApi.updateBanner(id, data, imageFile),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['banners'] });
      toast.success('Banner updated successfully');
      setEditingId(null);
      setFormData({ title: '', subtitle: '', imageUrl: '', buttonText: '', buttonUrl: '' });
      setImageFile(null);
    },
    onError: (err) => toast.error(err?.message || 'Failed to update banner')
  });

  const deleteMutation = useMutation({
    mutationFn: (id) => bannerApi.deleteBanner(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['banners'] });
      toast.success('Banner deleted successfully');
    },
    onError: (err) => toast.error(err?.message || 'Failed to delete banner')
  });

  const handleEdit = (banner) => {
    setEditingId(banner.id);
    setIsCreating(false);
    setFormData({
      title: banner.title,
      subtitle: banner.subtitle || '',
      imageUrl: banner.imageUrl || '',
      buttonText: banner.buttonText || '',
      buttonUrl: banner.buttonUrl || ''
    });
    setImageFile(null);
  };

  const handleCancel = () => {
    setEditingId(null);
    setIsCreating(false);
    setFormData({ title: '', subtitle: '', imageUrl: '', buttonText: '', buttonUrl: '' });
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
          <h1 className="font-display font-extrabold text-2xl text-stone-850 m-0">Banners Configuration</h1>
          <p className="text-xs text-stone-500">Manage promotional banners for the storefront</p>
        </div>
        {!isCreating && !editingId && (
          <button
            onClick={() => setIsCreating(true)}
            className="flex items-center gap-2 bg-primary text-white px-4 py-2 rounded-xl text-sm font-semibold hover:bg-primary-light transition-colors"
          >
            <FiPlus /> Add Banner
          </button>
        )}
      </div>

      {(isCreating || editingId) && (
        <form onSubmit={handleSubmit} className="bg-white p-6 rounded-3xl border border-stone-200 shadow-sm space-y-4">
          <h3 className="font-bold text-stone-800">{editingId ? 'Edit Banner' : 'New Banner'}</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-1">
              <label className="text-xs font-bold text-stone-600 uppercase">Title</label>
              <input
                type="text"
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                className="w-full bg-stone-50 border border-stone-250 rounded-xl px-3.5 py-2 text-sm focus:outline-hidden focus:border-primary"
                required
              />
            </div>
            <div className="space-y-1">
              <label className="text-xs font-bold text-stone-600 uppercase">Subtitle</label>
              <input
                type="text"
                value={formData.subtitle}
                onChange={(e) => setFormData({ ...formData, subtitle: e.target.value })}
                className="w-full bg-stone-50 border border-stone-250 rounded-xl px-3.5 py-2 text-sm focus:outline-hidden focus:border-primary"
              />
            </div>
            <div className="space-y-1 md:col-span-2">
              <label className="text-xs font-bold text-stone-600 uppercase">Image File</label>
              <input
                type="file"
                accept="image/*"
                onChange={(e) => setImageFile(e.target.files[0])}
                className="w-full bg-stone-50 border border-stone-250 rounded-xl px-3.5 py-1.5 text-sm focus:outline-hidden focus:border-primary file:mr-4 file:py-1 file:px-3 file:rounded-full file:border-0 file:text-xs file:font-semibold file:bg-primary/10 file:text-primary hover:file:bg-primary/20"
              />
              {imageFile && <p className="text-[10px] text-stone-500 truncate pt-1">Selected: {imageFile.name}</p>}
              {!imageFile && formData.imageUrl && <p className="text-[10px] text-stone-500 truncate pt-1">Current: {formData.imageUrl}</p>}
            </div>
            <div className="space-y-1">
              <label className="text-xs font-bold text-stone-600 uppercase">Button Text</label>
              <input
                type="text"
                value={formData.buttonText}
                onChange={(e) => setFormData({ ...formData, buttonText: e.target.value })}
                className="w-full bg-stone-50 border border-stone-250 rounded-xl px-3.5 py-2 text-sm focus:outline-hidden focus:border-primary"
              />
            </div>
            <div className="space-y-1">
              <label className="text-xs font-bold text-stone-600 uppercase">Button URL (Target Link)</label>
              <input
                type="text"
                value={formData.buttonUrl}
                onChange={(e) => setFormData({ ...formData, buttonUrl: e.target.value })}
                className="w-full bg-stone-50 border border-stone-250 rounded-xl px-3.5 py-2 text-sm focus:outline-hidden focus:border-primary font-mono"
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

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3 gap-6">
        {banners.map((banner) => (
          <div key={banner.id} className="bg-white rounded-3xl overflow-hidden border border-stone-200 shadow-sm flex flex-col relative group">
            <div className="h-40 bg-stone-100 relative">
              {banner.imageUrl ? (
                <img src={banner.imageUrl} alt={banner.title} className="w-full h-full object-cover" />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-stone-400 font-medium">No Image</div>
              )}
              {/* Overlay with info */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent flex flex-col justify-end p-4">
                <h4 className="font-display font-bold text-white text-lg leading-tight">{banner.title}</h4>
                {banner.subtitle && <p className="text-xs text-stone-200 mt-1">{banner.subtitle}</p>}
                {banner.buttonText && (
                  <div className="mt-3">
                    <span className="inline-block bg-primary text-white text-[10px] font-bold px-3 py-1 rounded-full">
                      {banner.buttonText} → {banner.buttonUrl || '#'}
                    </span>
                  </div>
                )}
              </div>
            </div>
            
            {/* Actions overlay */}
            <div className="absolute top-3 right-3 opacity-0 group-hover:opacity-100 transition-opacity flex gap-2">
              <button
                onClick={() => handleEdit(banner)}
                className="p-2 text-stone-700 bg-white/90 rounded-full hover:bg-white shadow-sm transition-colors"
                title="Edit"
              >
                <FiEdit2 className="w-4 h-4" />
              </button>
              <button
                onClick={() => {
                  if (window.confirm('Are you sure you want to delete this banner?')) {
                    deleteMutation.mutate(banner.id);
                  }
                }}
                className="p-2 text-red-600 bg-white/90 rounded-full hover:bg-white shadow-sm transition-colors"
                title="Delete"
              >
                <FiTrash2 className="w-4 h-4" />
              </button>
            </div>
          </div>
        ))}
        {banners.length === 0 && !isLoading && (
          <div className="col-span-full py-12 text-center text-stone-400">
            No banners configured yet.
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminBanners;
