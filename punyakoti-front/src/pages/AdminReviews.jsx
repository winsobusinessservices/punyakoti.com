import React, { useEffect, useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { reviewApi } from "../api/reviewApi";
import { productApi } from "../api/productApi";
import { FiCheck, FiTrash2, FiVideo, FiStar, FiPlus } from "react-icons/fi";
import Modal from "../components/Modal";
import Loader from "../components/Loader";
import toast from "react-hot-toast";

const AdminReviews = () => {
  const queryClient = useQueryClient();

  const { data: reviews = [], isLoading: loading } = useQuery({
    queryKey: ["reviews", "admin"],
    queryFn: () => reviewApi.getReviews(true),
  });

  const { data: products = [] } = useQuery({
    queryKey: ["products"],
    queryFn: productApi.getProducts,
  });

  const [selectedProductId, setSelectedProductId] = useState("");
  const [isUploadOpen, setIsUploadOpen] = useState(false);
  const [uploadLoading, setUploadLoading] = useState(false);

  const [customerName, setCustomerName] = useState("");
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState("");
  const [videoUrl, setVideoUrl] = useState("");
  const [videoFile, setVideoFile] = useState(null);

  const approveMutation = useMutation({
    mutationFn: reviewApi.approveReview,
    onSuccess: () => {
      toast.success("Review approved successfully!");
      queryClient.invalidateQueries({ queryKey: ["reviews"] });
    },
    onError: () => toast.error("Approval failed"),
  });

  const deleteMutation = useMutation({
    mutationFn: reviewApi.deleteReview,
    onSuccess: () => {
      toast.success("Review deleted");
      queryClient.invalidateQueries({ queryKey: ["reviews"] });
    },
    onError: () => toast.error("Delete failed"),
  });

  const createMutation = useMutation({
    mutationFn: reviewApi.createReview,
    onSuccess: () => {
      toast.success("Video review uploaded and saved!");
      setIsUploadOpen(false);
      setCustomerName("");
      setComment("");
      setVideoUrl("");
      setVideoFile(null);
      queryClient.invalidateQueries({ queryKey: ["reviews"] });
    },
    onError: () => toast.error("Review upload failed"),
    onSettled: () => setUploadLoading(false),
  });

  const handleApprove = (id) => {
    approveMutation.mutate(id);
  };

  const handleDelete = (id) => {
    if (window.confirm("Are you sure you want to delete this review?")) {
      deleteMutation.mutate(id);
    }
  };

  const handleUploadReview = async (e) => {
    e.preventDefault();
    if (!selectedProductId) {
      toast.error("Please select a product");
      return;
    }
    if (!customerName || !comment) {
      toast.error("Please fill in name and comment");
      return;
    }

    setUploadLoading(true);
    createMutation.mutate({
      productId: selectedProductId,
      name: customerName,
      rating: Number(rating),
      comment: comment,
      videoUrl: videoUrl || null,
      approved: true, // Auto approved for admin additions
      videoFile,
    });
  };

  return (
    <div className="space-y-6 text-left">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 pb-4 border-b border-stone-200">
        <div>
          <h1 className="font-display font-extrabold text-2xl text-stone-850 m-0">
            Customer Reviews Moderation
          </h1>
          <p className="text-xs text-stone-500">
            Approve user testimonies or upload promotional customer video
            reviews.
          </p>
        </div>
        <button
          onClick={() => setIsUploadOpen(true)}
          className="inline-flex items-center gap-2 bg-primary hover:bg-primary-light text-white font-semibold text-xs px-4 py-2.5 rounded-xl shadow-md transition-all active:scale-95"
        >
          <FiVideo className="w-4 h-4" />
          <span>Upload Video Review</span>
        </button>
      </div>

      {loading ? (
        <Loader type="skeleton-table" count={4} />
      ) : (
        <div className="bg-white border border-stone-200 rounded-3xl overflow-hidden shadow-xs">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs sm:text-sm text-stone-600">
              <thead className="bg-stone-50 text-stone-500 uppercase text-[10px] font-bold border-b border-stone-200">
                <tr>
                  <th className="px-6 py-4">Customer</th>
                  <th className="px-6 py-4">Rating</th>
                  <th className="px-6 py-4">Comment</th>
                  <th className="px-6 py-4">Video URL</th>
                  <th className="px-6 py-4">Status</th>
                  <th className="px-6 py-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-stone-100">
                {reviews.map((rev) => (
                  <tr
                    key={rev.id}
                    className="hover:bg-stone-50/50 transition-colors"
                  >
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <img
                          src={rev.profileImage}
                          alt=""
                          className="w-8 h-8 rounded-full object-cover border border-stone-200"
                        />
                        <div>
                          <p className="font-semibold text-stone-850 leading-tight">
                            {rev.name}
                          </p>
                          <span className="text-[10px] text-stone-400">
                            {rev.date}
                          </span>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-0.5 text-amber-400">
                        <FiStar className="w-3.5 h-3.5 fill-current" />
                        <span className="font-bold text-stone-700 ml-1">
                          {rev.rating}
                        </span>
                      </div>
                    </td>
                    <td
                      className="px-6 py-4 max-w-[200px] sm:max-w-xs truncate"
                      title={rev.comment}
                    >
                      {rev.comment}
                    </td>
                    <td className="px-6 py-4 max-w-[150px] truncate text-stone-400 font-mono">
                      {rev.video ? (
                        rev.video
                      ) : (
                        <span className="text-stone-300 italic text-[11px]">
                          No Video
                        </span>
                      )}
                    </td>
                    <td className="px-6 py-4">
                      <span
                        className={`text-[10px] font-bold px-2 py-0.5 border rounded-full ${
                          rev.approved
                            ? "bg-emerald-100 text-emerald-800 border-emerald-200"
                            : "bg-amber-100 text-amber-800 border-amber-200"
                        }`}
                      >
                        {rev.approved ? "Approved" : "Pending"}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <div className="inline-flex gap-2">
                        {!rev.approved && (
                          <button
                            onClick={() => handleApprove(rev.id)}
                            className="p-2 text-emerald-600 hover:bg-emerald-55/10 rounded-lg transition-all"
                            title="Approve Review"
                          >
                            <FiCheck className="w-4 h-4" />
                          </button>
                        )}
                        <button
                          onClick={() => handleDelete(rev.id)}
                          className="p-2 text-stone-400 hover:text-rose-600 hover:bg-stone-100 rounded-lg transition-all"
                          title="Delete Review"
                        >
                          <FiTrash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Upload Video Review Modal */}
      <Modal
        isOpen={isUploadOpen}
        onClose={() => setIsUploadOpen(false)}
        title="Mock Upload Video Review"
        size="md"
      >
        <form onSubmit={handleUploadReview} className="space-y-4">
          <div className="space-y-1">
            <label className="text-xs font-bold text-stone-600 uppercase">
              Select Product
            </label>
            <select
              value={selectedProductId}
              onChange={(e) => setSelectedProductId(e.target.value)}
              className="w-full bg-stone-50 border border-stone-250 rounded-xl px-3.5 py-2 text-sm focus:outline-hidden focus:border-primary"
              required
            >
              <option value="">Select a Product</option>
              {products.map((p) => (
                <option key={p.id} value={p.id}>
                  {p.name}
                </option>
              ))}
            </select>
          </div>

          <div className="space-y-1">
            <label className="text-xs font-bold text-stone-600 uppercase">
              Customer Name
            </label>
            <input
              type="text"
              value={customerName}
              onChange={(e) => setCustomerName(e.target.value)}
              className="w-full bg-stone-50 border border-stone-250 rounded-xl px-3.5 py-2 text-sm focus:outline-hidden focus:border-primary"
              required
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1">
              <label className="text-xs font-bold text-stone-600 uppercase">
                Rating Score
              </label>
              <select
                value={rating}
                onChange={(e) => setRating(e.target.value)}
                className="w-full bg-stone-50 border border-stone-250 rounded-xl px-3.5 py-2 text-sm focus:outline-hidden focus:border-primary"
              >
                <option value={5}>5 Stars</option>
                <option value={4}>4 Stars</option>
                <option value={3}>3 Stars</option>
              </select>
            </div>
            <div className="space-y-1">
              <label className="text-xs font-bold text-stone-600 uppercase">
                Video File (MP4)
              </label>
              <input
                type="file"
                accept="video/mp4"
                onChange={(e) => setVideoFile(e.target.files[0])}
                className="w-full bg-stone-50 border border-stone-250 rounded-xl px-3.5 py-1.5 text-xs focus:outline-hidden focus:border-primary file:mr-4 file:py-1 file:px-3 file:rounded-full file:border-0 file:text-xs file:font-semibold file:bg-primary/10 file:text-primary hover:file:bg-primary/20"
              />
              {videoFile && (
                <p className="text-[10px] text-stone-500 truncate pt-1">
                  Selected: {videoFile.name}
                </p>
              )}
            </div>
          </div>

          <div className="space-y-1">
            <label className="text-xs font-bold text-stone-600 uppercase">
              Customer Comment
            </label>
            <textarea
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              className="w-full bg-stone-50 border border-stone-250 rounded-xl px-3.5 py-2 text-sm focus:outline-hidden focus:border-primary h-24"
              required
            />
          </div>

          <div className="flex justify-end gap-3 pt-4 border-t border-stone-100">
            <button
              type="button"
              onClick={() => setIsUploadOpen(false)}
              className="px-4 py-2 border border-stone-200 rounded-xl text-stone-600 text-sm font-semibold hover:bg-stone-50"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={uploadLoading}
              className="bg-primary hover:bg-primary-light text-white font-semibold px-5 py-2 rounded-xl text-sm transition-all flex items-center gap-2"
            >
              {uploadLoading ? "Uploading..." : "Save & Publish"}
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
};

export default AdminReviews;
