'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';

interface Product {
  id: string;
  name: string;
  description: string | null;
  price: number;
  category: string | null;
  image: string | null;
  available: boolean;
}

interface FormData {
  name: string;
  description: string;
  price: string;
  category: string;
  image: string;
  imageFile: File | null;
  available: boolean;
}

export default function AdminMenuPage() {
  const router = useRouter();
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [showAddModal, setShowAddModal] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [formData, setFormData] = useState<FormData>({
    name: '',
    description: '',
    price: '',
    category: '',
    image: '',
    imageFile: null,
    available: true,
  });
  const shouldReduceMotion = typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  useEffect(() => {
    const userStr = localStorage.getItem('user');
    if (!userStr) {
      router.push('/admin');
      return;
    }

    const user = JSON.parse(userStr);
    if (user.role !== 'manager') {
      router.push('/admin/orders');
      return;
    }

    fetchProducts();
  }, [router]);

  async function fetchProducts() {
    try {
      const userStr = localStorage.getItem('user');
      const user = userStr ? JSON.parse(userStr) : null;
      
      const headers: HeadersInit = {};
      if (user) {
        headers['Authorization'] = `Bearer ${user.email}`;
      }

      const response = await fetch('/api/admin/products', { headers });
      if (response.ok) {
        const data = await response.json();
        setProducts(data);
      }
    } catch (error) {
      console.error('Error fetching products:', error);
    } finally {
      setLoading(false);
    }
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    
    const userStr = localStorage.getItem('user');
    const user = userStr ? JSON.parse(userStr) : null;
    
    let imageUrl = formData.image;

    // Upload image if file selected
    if (formData.imageFile) {
      const formDataUpload = new FormData();
      formDataUpload.append('file', formData.imageFile);
      
      const uploadResponse = await fetch('/api/admin/upload', {
        method: 'POST',
        headers: user ? { 'Authorization': `Bearer ${user.email}` } : {},
        body: formDataUpload,
      });
      
      if (uploadResponse.ok) {
        const uploadData = await uploadResponse.json();
        imageUrl = uploadData.url;
      }
    }
    
    const headers: HeadersInit = { 'Content-Type': 'application/json' };
    if (user) {
      headers['Authorization'] = `Bearer ${user.email}`;
    }

    const method = editingProduct ? 'PUT' : 'POST';
    const url = editingProduct ? `/api/admin/products/${editingProduct.id}` : '/api/admin/products';

    const response = await fetch(url, {
      method,
      headers,
      body: JSON.stringify({
        name: formData.name,
        description: formData.description,
        price: parseInt(formData.price),
        category: formData.category,
        image: imageUrl || null,
        available: formData.available,
      }),
    });

    if (response.ok) {
      setShowAddModal(false);
      setEditingProduct(null);
      setFormData({ name: '', description: '', price: '', category: '', image: '', imageFile: null, available: true });
      fetchProducts();
    }
  }

  async function toggleAvailability(product: Product) {
    const userStr = localStorage.getItem('user');
    const user = userStr ? JSON.parse(userStr) : null;
    
    const headers: HeadersInit = { 'Content-Type': 'application/json' };
    if (user) {
      headers['Authorization'] = `Bearer ${user.email}`;
    }

    const response = await fetch(`/api/admin/products/${product.id}`, {
      method: 'PUT',
      headers,
      body: JSON.stringify({ ...product, available: !product.available }),
    });

    if (response.ok) {
      fetchProducts();
    }
  }

  async function deleteProduct(id: string) {
    if (!confirm('Êtes-vous sûr de vouloir supprimer ce produit ?')) return;

    const userStr = localStorage.getItem('user');
    const user = userStr ? JSON.parse(userStr) : null;
    
    const headers: HeadersInit = {};
    if (user) {
      headers['Authorization'] = `Bearer ${user.email}`;
    }

    const response = await fetch(`/api/admin/products/${id}`, {
      method: 'DELETE',
      headers,
    });

    if (response.ok) {
      fetchProducts();
    }
  }

  function openEditModal(product: Product) {
    setEditingProduct(product);
    setFormData({
      name: product.name,
      description: product.description || '',
      price: product.price.toString(),
      category: product.category || '',
      image: product.image || '',
      imageFile: null,
      available: product.available,
    });
    setShowAddModal(true);
  }

  if (loading) {
    return <div className="text-center py-8">Chargement...</div>;
  }

  return (
    <div className="container mx-auto p-4">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-heading font-bold text-orange-500">Gestion du menu</h1>
        <button
          onClick={() => {
            setEditingProduct(null);
            setFormData({ name: '', description: '', price: '', category: '', image: '', imageFile: null, available: true });
            setShowAddModal(true);
          }}
          className="bg-orange-500 hover:bg-orange-600 text-white px-4 py-2 rounded-lg font-bold min-h-[44px]"
        >
          Ajouter un produit
        </button>
      </div>

      <div className="bg-gray-900 rounded-lg overflow-hidden">
        <table className="w-full">
          <thead>
            <tr className="border-b border-gray-700">
              <th className="text-left p-4">Nom</th>
              <th className="text-left p-4">Catégorie</th>
              <th className="text-left p-4">Prix</th>
              <th className="text-left p-4">Disponible</th>
              <th className="text-left p-4">Actions</th>
            </tr>
          </thead>
          <tbody>
            {products.map((product) => (
              <tr key={product.id} className="border-b border-gray-800">
                <td className="p-4">
                  <div>
                    <p className="font-bold">{product.name}</p>
                    {product.description && (
                      <p className="text-sm text-gray-400">{product.description}</p>
                    )}
                  </div>
                </td>
                <td className="p-4">{product.category || '-'}</td>
                <td className="p-4 font-bold text-orange-500">{product.price} F</td>
                <td className="p-4">
                  <button
                    onClick={() => toggleAvailability(product)}
                    className={`px-3 py-1 rounded text-sm font-bold min-h-[44px] ${
                      product.available ? 'bg-green-600 hover:bg-green-700' : 'bg-red-600 hover:bg-red-700'
                    }`}
                  >
                    {product.available ? 'Actif' : 'Inactif'}
                  </button>
                </td>
                <td className="p-4">
                  <div className="flex gap-2">
                    <button
                      onClick={() => openEditModal(product)}
                      className="bg-blue-600 hover:bg-blue-700 text-white px-3 py-1 rounded text-sm font-bold min-h-[44px]"
                    >
                      Modifier
                    </button>
                    <button
                      onClick={() => deleteProduct(product.id)}
                      className="bg-red-600 hover:bg-red-700 text-white px-3 py-1 rounded text-sm font-bold min-h-[44px]"
                    >
                      Supprimer
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Modal d'ajout/modification */}
      <AnimatePresence>
        {showAddModal && (
          <motion.div
            initial={shouldReduceMotion ? {} : { opacity: 0 }}
            animate={shouldReduceMotion ? {} : { opacity: 1 }}
            exit={shouldReduceMotion ? {} : { opacity: 0 }}
            transition={shouldReduceMotion ? {} : { duration: 0.15 }}
            className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50"
          >
            <motion.div
              initial={shouldReduceMotion ? {} : { scale: 0.95 }}
              animate={shouldReduceMotion ? {} : { scale: 1 }}
              exit={shouldReduceMotion ? {} : { scale: 0.95 }}
              transition={shouldReduceMotion ? {} : { duration: 0.15 }}
              className="bg-gray-900 rounded-lg p-6 max-w-md w-full"
            >
              <h2 className="text-xl font-bold mb-4">
                {editingProduct ? 'Modifier le produit' : 'Ajouter un produit'}
              </h2>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="block text-sm text-gray-400 mb-2">Nom</label>
                  <input
                    type="text"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="w-full bg-gray-800 border border-gray-700 text-white px-4 py-2 rounded-lg min-h-[44px]"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm text-gray-400 mb-2">Description</label>
                  <textarea
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    className="w-full bg-gray-800 border border-gray-700 text-white px-4 py-2 rounded-lg min-h-[100px]"
                    rows={3}
                  />
                </div>
                <div>
                  <label className="block text-sm text-gray-400 mb-2">Prix (F)</label>
                  <input
                    type="number"
                    value={formData.price}
                    onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                    className="w-full bg-gray-800 border border-gray-700 text-white px-4 py-2 rounded-lg min-h-[44px]"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm text-gray-400 mb-2">Catégorie</label>
                  <input
                    type="text"
                    value={formData.category}
                    onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                    className="w-full bg-gray-800 border border-gray-700 text-white px-4 py-2 rounded-lg min-h-[44px]"
                  />
                </div>
                <div>
                  <label className="block text-sm text-gray-400 mb-2">Image</label>
                  <div className="space-y-2">
                    <input
                      type="file"
                      accept="image/*"
                      onChange={(e) => setFormData({ ...formData, imageFile: e.target.files?.[0] || null })}
                      className="w-full bg-gray-800 border border-gray-700 text-white px-4 py-2 rounded-lg min-h-[44px]"
                    />
                    <div className="text-center text-gray-500 text-sm">ou</div>
                    <input
                      type="text"
                      value={formData.image}
                      onChange={(e) => setFormData({ ...formData, image: e.target.value })}
                      className="w-full bg-gray-800 border border-gray-700 text-white px-4 py-2 rounded-lg min-h-[44px]"
                      placeholder="https://..."
                    />
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    id="available"
                    checked={formData.available}
                    onChange={(e) => setFormData({ ...formData, available: e.target.checked })}
                    className="w-5 h-5"
                  />
                  <label htmlFor="available" className="text-sm text-gray-400">Disponible</label>
                </div>
                <div className="flex gap-4 justify-end">
                  <button
                    type="button"
                    onClick={() => {
                      setShowAddModal(false);
                      setEditingProduct(null);
                      setFormData({ name: '', description: '', price: '', category: '', image: '', imageFile: null, available: true });
                    }}
                    className="bg-gray-700 hover:bg-gray-600 px-4 py-2 rounded-lg font-bold min-h-[44px]"
                  >
                    Annuler
                  </button>
                  <button
                    type="submit"
                    className="bg-orange-500 hover:bg-orange-600 text-white px-4 py-2 rounded-lg font-bold min-h-[44px]"
                  >
                    {editingProduct ? 'Modifier' : 'Ajouter'}
                  </button>
                </div>
              </form>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
