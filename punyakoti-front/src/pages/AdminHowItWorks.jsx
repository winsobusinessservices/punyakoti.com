import React, { useState, useEffect } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { howItWorksApi } from '../api/howItWorksApi';
import { FiSave, FiUpload, FiPlay } from 'react-icons/fi';
import toast from 'react-hot-toast';
import Loader from '../components/Loader';

const AdminHowItWorks = () => {
  const queryClient = useQueryClient();
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [videoUrl, setVideoUrl] = useState('');
  const [currentItemId, setCurrentItemId] = useState(null);

  const { data: steps = [], isLoading } = useQuery({
    queryKey: ['howItWorks'],
    queryFn: howItWorksApi.getAll,
  });

  useEffect(() => {
    if (steps && steps.length > 0) {
      const step = steps[0];
      setCurrentItemId(step.id);
      setTitle(step.title || '');
      setDescription(step.description || '');
      setVideoUrl(step.videoUrl || '');
    }
  }, [steps]);

  const saveMutation = useMutation({
    mutationFn: (data) => {
      if (currentItemId) {
        return howItWorksApi.update(currentItemId, data);
      } else {
        return howItWorksApi.create(data);
      }
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['howItWorks'] });
      toast.success('How It Works section updated successfully!');
      if (!currentItemId && data?.id) {
        setCurrentItemId(data.id);
      }
    },
    onError: () => toast.error('Failed to update section')
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    saveMutation.mutate({ title, description, videoUrl });
  };

  if (isLoading) return <Loader />;

  return (
    <div className="space-y-6 text-left">
      <div className="pb-4 border-b border-stone-200">
        <h1 className="font-display font-extrabold text-2xl text-stone-850 m-0">How It Works Configuration</h1>
        <p className="text-xs text-stone-500">Configure promotional details and video links for Bilona Ghee processing.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Form Controls Column */}
        <form onSubmit={handleSubmit} className="lg:col-span-6 bg-white border border-stone-200/80 rounded-3xl p-6 shadow-sm space-y-6">
          <div className="space-y-1">
            <label className="text-xs font-bold text-stone-600 uppercase">Process Section Title</label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full bg-stone-50 border border-stone-250 rounded-xl px-3.5 py-2.5 text-sm focus:outline-hidden focus:border-primary"
              required
            />
          </div>

          <div className="space-y-1">
            <label className="text-xs font-bold text-stone-600 uppercase">YouTube Video URL</label>
            <input
              type="url"
              value={videoUrl}
              onChange={(e) => setVideoUrl(e.target.value)}
              placeholder="https://www.youtube.com/watch?v=..."
              className="w-full bg-stone-50 border border-stone-250 rounded-xl px-3.5 py-2.5 text-sm focus:outline-hidden focus:border-primary"
            />
          </div>

          <div className="space-y-1">
            <label className="text-xs font-bold text-stone-600 uppercase">Process Description Details</label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full bg-stone-50 border border-stone-250 rounded-xl px-3.5 py-2.5 text-sm focus:outline-hidden focus:border-primary h-36"
              required
            />
          </div>

          <div className="pt-2 border-t border-stone-100 flex justify-end">
            <button
              type="submit"
              disabled={saveMutation.isPending}
              className="bg-primary hover:bg-primary-light text-white font-bold px-6 py-3 rounded-xl text-sm shadow-md transition-all active:scale-95 flex items-center gap-2"
            >
              <FiSave className="w-4 h-4" />
              <span>{saveMutation.isPending ? 'Saving Configurations...' : 'Save Configurations'}</span>
            </button>
          </div>
        </form>

        {/* Video Preview Column */}
        <div className="lg:col-span-6 bg-white border border-stone-200/80 rounded-3xl p-6 shadow-sm space-y-4">
          <h3 className="font-display font-semibold text-stone-800 text-base flex items-center gap-2">
            <FiPlay className="text-primary w-4 h-4" />
            Live Preview on Storefront
          </h3>

          <div className="bg-stone-50 rounded-2xl p-4 border border-stone-150 space-y-4">
            <h4 className="font-display font-bold text-stone-800 text-sm">{title}</h4>
            <p className="text-[11px] text-stone-500 leading-relaxed line-clamp-3">{description}</p>
            
            <div className="aspect-video w-full overflow-hidden rounded-xl bg-stone-200 border border-stone-300 relative flex items-center justify-center">
              <span className="text-xs text-stone-400 font-medium">Video Player Placeholder</span>
              <span className="absolute bottom-2 right-2 text-[9px] bg-black/60 text-white font-mono px-2 py-0.5 rounded-md truncate max-w-[200px]">
                {videoUrl}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminHowItWorks;
