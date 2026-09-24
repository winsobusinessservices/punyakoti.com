import React, { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { productApi } from "../api/productApi";
import { categoryApi } from "../api/categoryApi";
import { FiPlus, FiEdit2, FiTrash2, FiSearch, FiEye } from "react-icons/fi";
import Modal from "../components/Modal";
import Loader from "../components/Loader";
import toast from "react-hot-toast";

const AdminProducts = () => {
  const queryClient = useQueryClient();
  const [searchQuery, setSearchQuery] = useState("");

  const { data: products = [], isLoading: loadingProducts } = useQuery({
    queryKey: ["products", "admin"],
    queryFn: () => productApi.getProducts({ isAdmin: true }),
  });

  const { data: categories = [], isLoading: loadingCategories } = useQuery({
    queryKey: ["categories"],
    queryFn: categoryApi.getCategories,
  });

  const loading = loadingProducts || loadingCategories;

  const deleteMutation = useMutation({
    mutationFn: productApi.deleteProduct,
    onSuccess: () => {
      toast.success("Product deleted successfully");
      queryClient.invalidateQueries({ queryKey: ["products"] });
    },
    onError: () => toast.error("Delete failed"),
  });

  const createMutation = useMutation({
    mutationFn: ({ payload, imageFiles }) => productApi.createProduct(payload, imageFiles),
    onSuccess: () => {
      toast.success("Product created successfully");
      queryClient.invalidateQueries({ queryKey: ["products"] });
      setIsFormOpen(false);
    },
    onError: () => toast.error("Failed to create product"),
    onSettled: () => setFormLoading(false),
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, payload, imageFiles }) => productApi.updateProduct(id, payload, imageFiles),
    onSuccess: () => {
      toast.success("Product updated successfully");
      queryClient.invalidateQueries({ queryKey: ["products"] });
      setIsFormOpen(false);
    },
    onError: () => toast.error("Failed to update product"),
    onSettled: () => setFormLoading(false),
  });

  // Modal states
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editProduct, setEditProduct] = useState(null); // null if adding new product
  const [formLoading, setFormLoading] = useState(false);

  // Form Fields State
  const [name, setName] = useState("");
  const [category, setCategory] = useState("");
  const [price, setPrice] = useState(1000);
  const [stock, setStock] = useState(20);
  const [shortDescription, setShortDescription] = useState("");
  const [description, setDescription] = useState("");

  const [benefits, setBenefits] = useState("");
  const [ingredients, setIngredients] = useState("");
  const [usage, setUsage] = useState("");
  const [imageUrls, setImageUrls] = useState("");
  const [imageFiles, setImageFiles] = useState([]);
  const [videoUrl, setVideoUrl] = useState("");
  const [variantsList, setVariantsList] = useState([
    { weight: "500 ml", price: 1000, stock: 20, sku: "" },
  ]);

  const openAddModal = () => {
    setEditProduct(null);
    setName("");
    setCategory(category);
    setPrice(1000);
    setStock(20);
    setShortDescription("");
    setBenefits("");
    setIngredients("");
    setUsage("");
    setImageUrls("");
    setImageFiles([]);
    setVideoUrl("");
    setVariantsList([{ weight: "500 ml", price: 1000, stock: 20, sku: "" }]);
    setIsFormOpen(true);
  };

  const openEditModal = (prod) => {
    setEditProduct(prod);
    setName(prod.name);
    setCategory(prod.category ? prod.category.id : "");
    const baseVariant =
      prod.variants && prod.variants.length > 0
        ? [...prod.variants].sort(
            (a, b) => Number(a.price) - Number(b.price),
          )[0]
        : { price: 1000, stock: 20 };
    setPrice(baseVariant.price);
    const totalStock = prod.variants
      ? prod.variants.reduce((sum, v) => sum + (v.stock || 0), 0)
      : 20;
    setStock(totalStock);
    setShortDescription(prod.shortDescription);
    setDescription(prod.description);

    setBenefits(
      Array.isArray(prod.benefits)
        ? prod.benefits.join("\n")
        : prod.benefits || "",
    );
    setIngredients(
      Array.isArray(prod.ingredients)
        ? prod.ingredients.join("\n")
        : prod.ingredients || "",
    );
    setUsage(prod.usage || "");
    const images = (prod.media || [])
      .filter((m) => m.type === "IMAGE")
      .map((m) => m.url);
    setImageUrls(Array.isArray(images) ? images.join(", ") : images || "");
    setImageFiles([]);
    const video = (prod.media || []).find((m) => m.type === "VIDEO")?.url;
    setVideoUrl(video || "");

    if (prod.variants && prod.variants.length > 0) {
      setVariantsList(
        prod.variants.map((opt) => ({
          variantId: opt.id,
          weight: opt.weight,
          price: opt.price,
          stock: opt.stock,
          sku: opt.sku || "",
        })),
      );
    } else {
      setVariantsList([
        {
          weight: "500 ml",
          price: baseVariant.price,
          stock: totalStock,
          sku: "",
        },
      ]);
    }
    setIsFormOpen(true);
  };

  const handleDelete = (id) => {
    if (window.confirm("Are you sure you want to delete this product?")) {
      deleteMutation.mutate(id);
    }
  };

  const handleAddVariantField = () => {
    setVariantsList([
      ...variantsList,
      { weight: "", price: 0, stock: 0, sku: "" },
    ]);
  };

  const handleRemoveVariantField = (index) => {
    setVariantsList(variantsList.filter((_, idx) => idx !== index));
  };

  const handleVariantChange = (index, field, value) => {
    setVariantsList(
      variantsList.map((v, idx) => {
        if (idx === index) {
          return { ...v, [field]: value };
        }
        return v;
      }),
    );
  };

  const handleSave = async (e) => {
    e.preventDefault();
    if (!name || !shortDescription) {
      toast.error("Please enter name and short description");
      return;
    }
    if (variantsList.length === 0) {
      toast.error("Please add at least one variant");
      return;
    }

    setFormLoading(true);
    try {
      const basePrice = Number(variantsList[0].price);
      const baseStock = Number(variantsList[0].stock);

      const payload = {
        name,
        categoryId: Number(category),
        shortDescription,
        description,
        benefits: benefits.trim(),
        ingredients: ingredients.trim(),
        usageInstructions: usage,
        active: true,
        variants: variantsList.map((v) => ({
          id: v.variantId || null,
          weight: v.weight,
          price: Number(v.price),
          stock: Number(v.stock),
          sku:
            v.sku ||
            `${name.toLowerCase().replace(/[^a-z0-9]+/g, "-")}-${v.weight.toLowerCase().replace(/\s+/g, "")}-${Math.floor(Math.random() * 1000)}`,
        })),
        media: [],
      };

      const parsedImages = imageUrls
        .split(",")
        .map((img) => img.trim())
        .filter((img) => img.length > 0 && img.startsWith("http"));

      parsedImages.forEach((img, idx) => {
        payload.media.push({
          id: null,
          type: "IMAGE",
          url: img,
          displayOrder: idx + 1,
          thumbnail: idx === 0,
        });
      });

      if (videoUrl) {
        payload.media.push({
          id: null,
          type: "VIDEO",
          url: videoUrl,
          displayOrder: payload.media.length + 1,
          thumbnail: false,
        });
      }

      if (editProduct) {
        updateMutation.mutate({ id: editProduct.id, payload, imageFiles });
      } else {
        createMutation.mutate({ payload, imageFiles });
      }
    } catch (err) {
      toast.error("Failed to save product");
      setFormLoading(false);
    }
  };

  const filtered = products.filter(
    (p) =>
      p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (p.category?.name || "")
        .toLowerCase()
        .includes(searchQuery.toLowerCase()),
  );

  return (
    <div className="space-y-6 text-left">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 pb-4 border-b border-stone-200">
        <div>
          <h1 className="font-display font-extrabold text-2xl text-stone-850 m-0">
            Products Management
          </h1>
          <p className="text-xs text-stone-500">
            Configure prices, stocks, and category definitions.
          </p>
        </div>
        <button
          onClick={openAddModal}
          className="inline-flex items-center gap-2 bg-primary hover:bg-primary-light text-white font-semibold text-xs px-4 py-2.5 rounded-xl shadow-md transition-all active:scale-95"
        >
          <FiPlus className="w-4 h-4" />
          <span>Add New Product</span>
        </button>
      </div>

      {/* Filters & Search */}
      <div className="flex bg-white p-4 border border-stone-200 rounded-2xl items-center gap-3">
        <FiSearch className="text-stone-400 w-5 h-5 shrink-0" />
        <input
          type="text"
          placeholder="Search products by title or category..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="bg-transparent border-hidden w-full text-sm focus:outline-hidden text-stone-700 placeholder-stone-400"
        />
      </div>

      {/* Products Table */}
      {loading ? (
        <Loader type="skeleton-table" count={4} />
      ) : (
        <div className="bg-white border border-stone-200 rounded-3xl overflow-hidden shadow-xs">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs sm:text-sm text-stone-600">
              <thead className="bg-stone-50 text-stone-500 uppercase text-[10px] font-bold border-b border-stone-200">
                <tr>
                  <th className="px-6 py-4">Image</th>
                  <th className="px-6 py-4">Name</th>
                  <th className="px-6 py-4">Category</th>
                  <th className="px-6 py-4">Base Price</th>
                  <th className="px-6 py-4">Stock</th>
                  <th className="px-6 py-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-stone-100">
                {filtered.map((prod) => (
                  <tr
                    key={prod.id}
                    className="hover:bg-stone-50/50 transition-colors"
                  >
                    <td className="px-6 py-3 shrink-0">
                      <img
                        src={
                          (prod.media || []).find((m) => m.type === "IMAGE")
                            ?.url
                        }
                        alt=""
                        className="w-10 h-10 rounded-lg object-cover border border-stone-200"
                      />
                    </td>
                    <td className="px-6 py-3 font-semibold text-stone-850">
                      {prod.name}
                    </td>
                    <td className="px-6 py-3">
                      <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800">
                        {prod.category?.name || "Uncategorized"}
                      </span>
                    </td>
                    <td className="px-6 py-3 font-semibold">
                      ₹
                      {prod.variants && prod.variants.length > 0
                        ? [...prod.variants].sort(
                            (a, b) => a.price - b.price,
                          )[0].price
                        : 0}
                    </td>
                    <td className="px-6 py-3">
                      {(prod.variants || []).reduce(
                        (s, v) => s + (v.stock || 0),
                        0,
                      )}{" "}
                      units
                    </td>
                    <td className="px-6 py-3 text-right">
                      <div className="inline-flex gap-2">
                        <button
                          onClick={() => openEditModal(prod)}
                          className="p-2 text-stone-500 hover:text-primary hover:bg-stone-100 rounded-lg transition-all"
                          title="Edit Product"
                        >
                          <FiEdit2 className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleDelete(prod.id)}
                          className="p-2 text-stone-400 hover:text-rose-600 hover:bg-stone-100 rounded-lg transition-all"
                          title="Delete Product"
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

      {/* CRUD modal Form */}
      <Modal
        isOpen={isFormOpen}
        onClose={() => setIsFormOpen(false)}
        title={editProduct ? "Edit Product Details" : "Add New Dairy Product"}
        size="lg"
      >
        <form onSubmit={handleSave} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-1">
              <label className="text-xs font-bold text-stone-600 uppercase">
                Product Name
              </label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full bg-stone-50 border border-stone-250 rounded-xl px-3.5 py-2 text-sm focus:outline-hidden focus:border-primary"
                required
              />
            </div>

            <div className="space-y-1">
              <label className="text-xs font-bold text-stone-600 uppercase">
                Category
              </label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="w-full bg-stone-50 border border-stone-250 rounded-xl px-3.5 py-2 text-sm focus:outline-hidden focus:border-primary"
                required
              >
                <option value="" disabled>
                  Select a category
                </option>
                {categories.map((cat) => (
                  <option key={cat.id} value={cat.id}>
                    {cat.name}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="space-y-1">
            <label className="text-xs font-bold text-stone-600 uppercase">
              Short Summary Description
            </label>
            <input
              type="text"
              value={shortDescription}
              onChange={(e) => setShortDescription(e.target.value)}
              className="w-full bg-stone-50 border border-stone-250 rounded-xl px-3.5 py-2 text-sm focus:outline-hidden focus:border-primary"
              required
            />
          </div>

          <div className="space-y-1">
            <label className="text-xs font-bold text-stone-600 uppercase">
              Full Product Description
            </label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full bg-stone-50 border border-stone-250 rounded-xl px-3.5 py-2 text-sm focus:outline-hidden focus:border-primary h-20"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-1">
              <label className="text-xs font-bold text-stone-600 uppercase">
                Benefits (one per line)
              </label>
              <textarea
                value={benefits}
                onChange={(e) => setBenefits(e.target.value)}
                placeholder="Preservative free&#10;Rich organic fats"
                className="w-full bg-stone-50 border border-stone-250 rounded-xl px-3.5 py-2 text-sm focus:outline-hidden focus:border-primary h-20"
              />
            </div>

            <div className="space-y-1">
              <label className="text-xs font-bold text-stone-600 uppercase">
                Ingredients (one per line)
              </label>
              <textarea
                value={ingredients}
                onChange={(e) => setIngredients(e.target.value)}
                placeholder="Pure Cow Ghee"
                className="w-full bg-stone-50 border border-stone-250 rounded-xl px-3.5 py-2 text-sm focus:outline-hidden focus:border-primary h-20"
              />
            </div>
          </div>

          <div className="space-y-1">
            <label className="text-xs font-bold text-stone-600 uppercase">
              Usage Instructions
            </label>
            <input
              type="text"
              value={usage}
              onChange={(e) => setUsage(e.target.value)}
              placeholder="Consume as seasoning or cook directly."
              className="w-full bg-stone-50 border border-stone-250 rounded-xl px-3.5 py-2 text-sm focus:outline-hidden focus:border-primary"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-1">
              <label className="text-xs font-bold text-stone-600 uppercase">
                Product Images (Upload Files)
              </label>
              <input
                type="file"
                multiple
                accept="image/*"
                onChange={(e) => setImageFiles(Array.from(e.target.files))}
                className="w-full bg-stone-50 border border-stone-250 rounded-xl px-3.5 py-1.5 text-sm focus:outline-hidden focus:border-primary file:mr-4 file:py-1 file:px-3 file:rounded-full file:border-0 file:text-xs file:font-semibold file:bg-primary/10 file:text-primary hover:file:bg-primary/20"
              />
              {imageFiles.length > 0 && (
                <p className="text-[10px] text-stone-500 truncate pt-1">
                  {imageFiles.length} files selected
                </p>
              )}
              {imageUrls && (
                <p className="text-[10px] text-stone-500 truncate pt-1">
                  Current URLs: {imageUrls}
                </p>
              )}
            </div>

            <div className="space-y-1">
              <label className="text-xs font-bold text-stone-600 uppercase">
                Video URL (Optional)
              </label>
              <input
                type="text"
                value={videoUrl}
                onChange={(e) => setVideoUrl(e.target.value)}
                className="w-full bg-stone-50 border border-stone-250 rounded-xl px-3.5 py-2 text-xs focus:outline-hidden focus:border-primary font-mono text-stone-600"
              />
            </div>
          </div>

          <div className="space-y-2 border-t border-stone-200 pt-4">
            <label className="text-xs font-bold text-stone-600 uppercase block">
              Product Variants (Pack Sizes)
            </label>
            <div className="space-y-3">
              {variantsList.map((v, idx) => (
                <div
                  key={idx}
                  className="grid grid-cols-1 sm:grid-cols-5 gap-3 items-end bg-stone-50 p-3.5 border border-stone-200 rounded-xl"
                >
                  <div className="space-y-1">
                    <label className="text-[10px] font-bold text-stone-500 uppercase">
                      Weight
                    </label>
                    <input
                      type="text"
                      placeholder="e.g. 500 ml"
                      value={v.weight}
                      onChange={(e) =>
                        handleVariantChange(idx, "weight", e.target.value)
                      }
                      className="w-full bg-white border border-stone-250 rounded-lg px-2.5 py-1 text-xs focus:outline-hidden"
                      required
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-[10px] font-bold text-stone-500 uppercase">
                      Price (₹)
                    </label>
                    <input
                      type="number"
                      placeholder="Price"
                      value={v.price}
                      onChange={(e) =>
                        handleVariantChange(idx, "price", e.target.value)
                      }
                      className="w-full bg-white border border-stone-250 rounded-lg px-2.5 py-1 text-xs focus:outline-hidden"
                      min="1"
                      required
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-[10px] font-bold text-stone-500 uppercase">
                      Stock
                    </label>
                    <input
                      type="number"
                      placeholder="Stock"
                      value={v.stock}
                      onChange={(e) =>
                        handleVariantChange(idx, "stock", e.target.value)
                      }
                      className="w-full bg-white border border-stone-250 rounded-lg px-2.5 py-1 text-xs focus:outline-hidden"
                      min="0"
                      required
                    />
                  </div>
                  <div className="space-y-1 col-span-1 sm:col-span-1">
                    <label className="text-[10px] font-bold text-stone-500 uppercase">
                      SKU (Optional)
                    </label>
                    <input
                      type="text"
                      placeholder="Auto"
                      value={v.sku}
                      onChange={(e) =>
                        handleVariantChange(idx, "sku", e.target.value)
                      }
                      className="w-full bg-white border border-stone-250 rounded-lg px-2.5 py-1 text-xs focus:outline-hidden"
                    />
                  </div>
                  <div className="flex justify-end">
                    {variantsList.length > 1 && (
                      <button
                        type="button"
                        onClick={() => handleRemoveVariantField(idx)}
                        className="w-full bg-rose-50 hover:bg-rose-100 text-rose-600 text-xs font-semibold py-1.5 px-3 rounded-lg border border-rose-200 transition-all"
                      >
                        Remove
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>
            <button
              type="button"
              onClick={handleAddVariantField}
              className="mt-2 text-xs text-primary font-bold hover:underline flex items-center gap-1.5"
            >
              + Add Variant Pack Size
            </button>
          </div>

          <div className="flex justify-end gap-3 pt-4 border-t border-stone-100">
            <button
              type="button"
              onClick={() => setIsFormOpen(false)}
              className="px-4 py-2 border border-stone-200 rounded-xl text-stone-600 text-sm font-semibold hover:bg-stone-50"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={formLoading}
              className="bg-primary hover:bg-primary-light text-white font-semibold px-5 py-2 rounded-xl text-sm transition-all"
            >
              {formLoading ? "Saving..." : "Save Product"}
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
};

export default AdminProducts;
