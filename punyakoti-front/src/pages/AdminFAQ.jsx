import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { faqApi } from '../api/faqApi';
import { FiPlus, FiEdit2, FiTrash2, FiHelpCircle } from 'react-icons/fi';
import Modal from '../components/Modal';
import Loader from '../components/Loader';
import toast from 'react-hot-toast';

const AdminFAQ = () => {
  const queryClient = useQueryClient();
  const { data: faqs = [], isLoading: loading } = useQuery({
    queryKey: ['faqs'],
    queryFn: faqApi.getFaqs,
  });

  const deleteMutation = useMutation({
    mutationFn: faqApi.deleteFaq,
    onSuccess: () => {
      toast.success('FAQ deleted');
      queryClient.invalidateQueries({ queryKey: ['faqs'] });
    },
    onError: () => toast.error('Delete failed')
  });

  const createMutation = useMutation({
    mutationFn: faqApi.createFaq,
    onSuccess: () => {
      toast.success('FAQ created!');
      queryClient.invalidateQueries({ queryKey: ['faqs'] });
      setIsOpen(false);
    },
    onError: () => toast.error('Save failed'),
    onSettled: () => setFormLoading(false)
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, payload }) => faqApi.updateFaq(id, payload),
    onSuccess: () => {
      toast.success('FAQ updated!');
      queryClient.invalidateQueries({ queryKey: ['faqs'] });
      setIsOpen(false);
    },
    onError: () => toast.error('Save failed'),
    onSettled: () => setFormLoading(false)
  });

  // Form states
  const [isOpen, setIsOpen] = useState(false);
  const [editFaq, setEditFaq] = useState(null); // null if adding
  const [question, setQuestion] = useState('');
  const [answer, setAnswer] = useState('');
  const [formLoading, setFormLoading] = useState(false);

  const openAddModal = () => {
    setEditFaq(null);
    setQuestion('');
    setAnswer('');
    setIsOpen(true);
  };

  const openEditModal = (faq) => {
    setEditFaq(faq);
    setQuestion(faq.question);
    setAnswer(faq.answer);
    setIsOpen(true);
  };

  const handleDelete = (id) => {
    if (window.confirm('Are you sure you want to delete this FAQ?')) {
      deleteMutation.mutate(id);
    }
  };

  const handleSave = (e) => {
    e.preventDefault();
    if (!question || !answer) {
      toast.error('Please fill in both fields.');
      return;
    }

    setFormLoading(true);
    if (editFaq) {
      updateMutation.mutate({ id: editFaq.id, payload: { question, answer } });
    } else {
      createMutation.mutate({ question, answer });
    }
  };

  return (
    <div className="space-y-6 text-left">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 pb-4 border-b border-stone-200">
        <div>
          <h1 className="font-display font-extrabold text-2xl text-stone-850 m-0">FAQs Management</h1>
          <p className="text-xs text-stone-500">Edit or append questions and answers displayed in customer portals.</p>
        </div>
        <button
          onClick={openAddModal}
          className="inline-flex items-center gap-2 bg-primary hover:bg-primary-light text-white font-semibold text-xs px-4 py-2.5 rounded-xl shadow-md transition-all active:scale-95"
        >
          <FiPlus className="w-4 h-4" />
          <span>Add New FAQ</span>
        </button>
      </div>

      {loading ? (
        <Loader />
      ) : (
        <div className="space-y-4">
          {faqs.map((faq) => (
            <div
              key={faq.id}
              className="bg-white border border-stone-200/80 rounded-2xl p-5 flex items-start justify-between gap-4 hover:shadow-md transition-all"
            >
              <div className="space-y-2">
                <h3 className="font-display font-semibold text-stone-800 text-sm sm:text-base flex items-center gap-2 leading-snug">
                  <FiHelpCircle className="text-primary w-4 h-4 shrink-0" />
                  {faq.question}
                </h3>
                <p className="text-xs sm:text-sm text-stone-500 leading-relaxed pl-6">{faq.answer}</p>
              </div>

              <div className="flex shrink-0 gap-1.5 pt-1">
                <button
                  onClick={() => openEditModal(faq)}
                  className="p-2 text-stone-500 hover:text-primary hover:bg-stone-100 rounded-lg transition-all"
                  title="Edit FAQ"
                >
                  <FiEdit2 className="w-4 h-4" />
                </button>
                <button
                  onClick={() => handleDelete(faq.id)}
                  className="p-2 text-stone-400 hover:text-rose-600 hover:bg-stone-100 rounded-lg transition-all"
                  title="Delete FAQ"
                >
                  <FiTrash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* FAQ Form Modal */}
      <Modal
        isOpen={isOpen}
        onClose={() => setIsOpen(false)}
        title={editFaq ? 'Edit FAQ Content' : 'Create New FAQ Accordion'}
      >
        <form onSubmit={handleSave} className="space-y-4">
          <div className="space-y-1">
            <label className="text-xs font-bold text-stone-600 uppercase">Question</label>
            <input
              type="text"
              value={question}
              onChange={(e) => setQuestion(e.target.value)}
              className="w-full bg-stone-50 border border-stone-250 rounded-xl px-3.5 py-2 text-sm focus:outline-hidden focus:border-primary"
              required
            />
          </div>

          <div className="space-y-1">
            <label className="text-xs font-bold text-stone-600 uppercase">Answer</label>
            <textarea
              value={answer}
              onChange={(e) => setAnswer(e.target.value)}
              className="w-full bg-stone-50 border border-stone-250 rounded-xl px-3.5 py-2 text-sm focus:outline-hidden focus:border-primary h-28"
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
              {formLoading ? 'Saving...' : 'Save FAQ'}
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
};

export default AdminFAQ;
