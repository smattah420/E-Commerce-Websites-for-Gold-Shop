import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import axios from 'axios'
import { motion, AnimatePresence } from 'framer-motion'
import { 
  Package, 
  Plus, 
  Trash2, 
  Edit3, 
  Search, 
  Loader2, 
  AlertTriangle,
  Image as ImageIcon,
  DollarSign,
  Tag,
  Layers,
  X,
  FileText,
  Star,
  RefreshCw
} from 'lucide-react'
import { useAuth } from '../store/AuthContext'
import { useNotification } from '../store/NotificationContext'

type ProductData = {
  _id: string
  name: string
  category: string
  purity: string[]
  pricePKR: number
  compareAtPKR?: number
  image: string
  images: string[]
  badge?: string
  description: string
  createdAt: string
}

const CATEGORIES = ['Necklaces', 'Earrings', 'Rings', 'Bangles', 'Challa']
const PURITIES = ['18k', '22k', '24k']
const BADGES = ['Best Seller', 'New', 'Limited']

export function AdminProductPage() {
  const { showNotification } = useNotification()
  const [products, setProducts] = useState<ProductData[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [searchTerm, setSearchTerm] = useState('')
  const [showModal, setShowModal] = useState(false)
  const [submitting, setSubmitting] = useState(false)
  const [isEditing, setIsEditing] = useState(false)
  const [editProductId, setEditProductId] = useState<string | null>(null)
  
  // Form State
  const [formData, setFormData] = useState({
    name: '',
    category: 'Necklaces',
    purity: [] as string[],
    pricePKR: 0,
    compareAtPKR: 0,
    image: '',
    badge: '',
    description: ''
  })

  const { userInfo } = useAuth()
  const navigate = useNavigate()

  useEffect(() => {
    if (!userInfo || !userInfo.isAdmin) {
      navigate('/home')
      return
    }

    fetchProducts()
  }, [userInfo, navigate])

  const fetchProducts = async () => {
    try {
      setLoading(true)
      const { data } = await axios.get('https://e-commerce-websites-for-gold-shop-production.up.railway.app/products')
      setProducts(data)
      setError(null)
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to fetch products')
    } finally {
      setLoading(false)
    }
  }

  const deleteHandler = async (id: string, name: string) => {
    if (window.confirm(`Are you sure you want to delete product "${name}"?`)) {
      try {
        const config = {
          headers: {
            Authorization: `Bearer ${userInfo?.token}`,
          },
        }
        await axios.delete(`https://e-commerce-websites-for-gold-shop-production.up.railway.app/products/${id}`, config)
        setProducts(products.filter((p) => p._id !== id))
        showNotification(`Product "${name}" deleted successfully.`, 'success')
      } catch (err: any) {
        showNotification(err.response?.data?.message || 'Failed to delete product', 'error')
      }
    }
  }

  const editHandler = (product: ProductData) => {
    setIsEditing(true)
    setEditProductId(product._id)
    setFormData({
      name: product.name,
      category: product.category,
      purity: product.purity,
      pricePKR: product.pricePKR,
      compareAtPKR: product.compareAtPKR || 0,
      image: product.image,
      badge: product.badge || '',
      description: product.description
    })
    setShowModal(true)
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: name.includes('PKR') ? Number(value) : value
    }))
  }

  const handlePurityChange = (purity: string) => {
    setFormData(prev => ({
      ...prev,
      purity: prev.purity.includes(purity) 
        ? prev.purity.filter(p => p !== purity)
        : [...prev.purity, purity]
    }))
  }

  const resetForm = () => {
    setFormData({
      name: '',
      category: 'Necklaces',
      purity: [],
      pricePKR: 0,
      compareAtPKR: 0,
      image: '',
      badge: '',
      description: ''
    })
    setIsEditing(false)
    setEditProductId(null)
  }

  const submitHandler = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (formData.purity.length === 0) {
      showNotification('Please select at least one purity level', 'error')
      return
    }

    try {
      setSubmitting(true)
      const config = {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${userInfo?.token}`,
        },
      }
      
      const productPayload = {
        ...formData,
        images: [formData.image] // Default to single image array
      }

      if (isEditing && editProductId) {
        await axios.put(`http://e-commerce-websites-for-gold-shop-production.up.railway.app/api/products/${editProductId}`, productPayload, config)
        showNotification('Product updated successfully!', 'success')
      } else {
        await axios.post('http://e-commerce-websites-for-gold-shop-production.up.railway.app/api/products', productPayload, config)
        showNotification('Product published successfully!', 'success')
      }
      
      setShowModal(false)
      resetForm()
      // Always re-fetch to ensure UI is in perfect sync
      fetchProducts()
    } catch (err: any) {
      showNotification(err.response?.data?.message || 'Operation failed', 'error')
    } finally {
      setSubmitting(false)
    }
  }

  const filteredProducts = products.filter(
    (product) =>
      product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      product.category.toLowerCase().includes(searchTerm.toLowerCase())
  )

  if (loading && products.length === 0) {
    return (
      <div className="flex h-[60vh] items-center justify-center">
        <div className="text-center">
          <Loader2 className="mx-auto h-12 w-12 animate-spin text-[#d6b25e]" />
          <p className="mt-4 text-white/60 text-lg tracking-wide uppercase">Inventory Loading...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="container-lux py-12">
      <div className="mb-12 flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
        <div>
          <div className="mb-4 flex items-center gap-3">
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-[#d6b25e]/10 border border-[#d6b25e]/30 shadow-[0_0_20px_rgba(214,178,94,0.1)]">
              <Package className="h-6 w-6 text-[#d6b25e]" />
            </div>
            <h1 className="text-4xl font-bold tracking-tight gold-text">Product Management</h1>
          </div>
          <p className="text-white/60 max-w-xl text-lg">
            Curate your luxury collection. Add new masterpieces, update inventory, or remove retired pieces from your boutique gallery.
          </p>
        </div>

        <div className="flex flex-col sm:flex-row gap-4">
          <div className="relative group min-w-[300px]">
            <Search className="absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-white/30 group-focus-within:text-[#d6b25e] transition-colors" />
            <input
              className="input pl-12 h-12 bg-white/[0.03] border-white/10 focus:border-[#d6b25e]/50"
              placeholder="Search inventory..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <button 
            onClick={() => {
              resetForm()
              setShowModal(true)
            }}
            className="btn btn-gold h-12 px-6 flex items-center justify-center gap-2 group whitespace-nowrap"
          >
            <Plus className="h-5 w-5 group-hover:rotate-90 transition-transform duration-300" />
            Add New Product
          </button>
        </div>
      </div>

      <AnimatePresence mode="wait">
        {error && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            className="mb-8 rounded-[2rem] border border-red-500/20 bg-red-500/10 p-6 flex items-center gap-4 text-red-400"
          >
            <AlertTriangle className="h-8 w-8" />
            <div>
              <h3 className="text-lg font-bold">System Error</h3>
              <p className="text-sm opacity-80">{error}</p>
            </div>
            <button onClick={fetchProducts} className="ml-auto btn !py-2 !px-4 !bg-red-500/10 hover:!bg-red-500/20">
              <RefreshCw size={14} className="mr-2" /> Retry
            </button>
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {showModal && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm"
          >
            <motion.div 
              initial={{ scale: 0.95, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.95, y: 20 }}
              className="glass w-full max-w-2xl max-h-[90vh] overflow-y-auto rounded-[2.5rem] border border-white/10 p-8 shadow-2xl relative"
            >
              <button 
                onClick={() => {
                  setShowModal(false)
                  resetForm()
                }}
                className="absolute top-6 right-6 p-2 text-white/40 hover:text-white/90 hover:bg-white/5 rounded-full transition-all"
              >
                <X size={24} />
              </button>

              <div className="mb-8">
                <h2 className="text-2xl font-bold gold-text mb-2">
                  {isEditing ? 'Refine Masterpiece Details' : 'Create New Masterpiece'}
                </h2>
                <p className="text-white/40">
                  {isEditing ? 'Modify the exquisite features of this piece.' : 'Enter the refined details of the new addition to your collection.'}
                </p>
              </div>

              <form onSubmit={submitHandler} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="text-xs font-bold uppercase tracking-widest text-[#d6b25e]">Product Name</label>
                    <div className="relative">
                      <Tag className="absolute left-4 top-4 h-4 w-4 text-white/20" />
                      <input 
                        name="name"
                        value={formData.name}
                        onChange={handleInputChange}
                        required
                        className="input pl-12 h-12 bg-white/[0.02]" 
                        placeholder="e.g. Royal Gold Necklace" 
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <label className="text-xs font-bold uppercase tracking-widest text-[#d6b25e]">Category</label>
                    <div className="relative">
                      <Layers className="absolute left-4 top-4 h-4 w-4 text-white/20" />
                      <select 
                        name="category"
                        value={formData.category}
                        onChange={handleInputChange}
                        className="input pl-12 h-12 bg-white/[0.02] appearance-none"
                      >
                        {CATEGORIES.map(c => <option key={c} value={c} className="bg-[#0f0f12]">{c}</option>)}
                      </select>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <label className="text-xs font-bold uppercase tracking-widest text-[#d6b25e]">Price (PKR)</label>
                    <div className="relative">
                      <DollarSign className="absolute left-4 top-4 h-4 w-4 text-white/20" />
                      <input 
                        type="number"
                        name="pricePKR"
                        value={formData.pricePKR}
                        onChange={handleInputChange}
                        required
                        className="input pl-12 h-12 bg-white/[0.02]" 
                        placeholder="0.00" 
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <label className="text-xs font-bold uppercase tracking-widest text-[#d6b25e]">Compare Price (PKR)</label>
                    <div className="relative">
                      <DollarSign className="absolute left-4 top-4 h-4 w-4 text-white/20" />
                      <input 
                        type="number"
                        name="compareAtPKR"
                        value={formData.compareAtPKR}
                        onChange={handleInputChange}
                        className="input pl-12 h-12 bg-white/[0.02]" 
                        placeholder="0.00" 
                      />
                    </div>
                  </div>

                  <div className="space-y-2 md:col-span-2">
                    <label className="text-xs font-bold uppercase tracking-widest text-[#d6b25e]">Gold Purity</label>
                    <div className="flex flex-wrap gap-3">
                      {PURITIES.map(p => (
                        <button
                          key={p}
                          type="button"
                          onClick={() => handlePurityChange(p)}
                          className={`px-6 py-2 rounded-xl text-sm font-bold border transition-all ${
                            formData.purity.includes(p)
                              ? 'bg-[#d6b25e] border-[#d6b25e] text-black shadow-[0_0_15px_rgba(214,178,94,0.3)]'
                              : 'bg-white/5 border-white/10 text-white/60 hover:border-white/30'
                          }`}
                        >
                          {p}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div className="space-y-2 md:col-span-2">
                    <label className="text-xs font-bold uppercase tracking-widest text-[#d6b25e]">Image URL</label>
                    <div className="relative">
                      <ImageIcon className="absolute left-4 top-4 h-4 w-4 text-white/20" />
                      <input 
                        name="image"
                        value={formData.image}
                        onChange={handleInputChange}
                        required
                        className="input pl-12 h-12 bg-white/[0.02]" 
                        placeholder="https://images.unsplash.com/..." 
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <label className="text-xs font-bold uppercase tracking-widest text-[#d6b25e]">Special Badge</label>
                    <div className="relative">
                      <Star className="absolute left-4 top-4 h-4 w-4 text-white/20" />
                      <select 
                        name="badge"
                        value={formData.badge}
                        onChange={handleInputChange}
                        className="input pl-12 h-12 bg-white/[0.02] appearance-none"
                      >
                        <option value="" className="bg-[#0f0f12]">No Badge</option>
                        {BADGES.map(b => <option key={b} value={b} className="bg-[#0f0f12]">{b}</option>)}
                      </select>
                    </div>
                  </div>

                  <div className="space-y-2 md:col-span-2">
                    <label className="text-xs font-bold uppercase tracking-widest text-[#d6b25e]">Description</label>
                    <div className="relative">
                      <FileText className="absolute left-4 top-4 h-4 w-4 text-white/20" />
                      <textarea 
                        name="description"
                        value={formData.description}
                        onChange={handleInputChange}
                        required
                        className="input pl-12 min-h-[120px] bg-white/[0.02] pt-4 resize-none" 
                        placeholder="Describe the craftsmanship and elegance of this piece..."
                      />
                    </div>
                  </div>
                </div>

                <div className="pt-4 flex gap-4">
                  <button 
                    type="button"
                    onClick={() => {
                      setShowModal(false)
                      resetForm()
                    }}
                    className="btn flex-1 h-14 rounded-2xl border-white/10 hover:bg-white/5"
                  >
                    Cancel
                  </button>
                  <button 
                    type="submit"
                    disabled={submitting}
                    className="btn btn-gold flex-1 h-14 rounded-2xl shadow-[0_10px_30px_rgba(214,178,94,0.2)]"
                  >
                    {submitting ? (
                      <div className="flex items-center gap-2">
                        <Loader2 className="h-5 w-5 animate-spin" />
                        <span>Processing...</span>
                      </div>
                    ) : isEditing ? 'Update Masterpiece' : 'Publish Product'}
                  </button>
                </div>
              </form>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="glass overflow-hidden rounded-[2.5rem] border border-white/5 shadow-2xl">
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="border-b border-white/5 bg-white/[0.02]">
                <th className="px-8 py-6 text-xs font-bold uppercase tracking-widest text-[#d6b25e]">Product Details</th>
                <th className="px-8 py-6 text-xs font-bold uppercase tracking-widest text-[#d6b25e]">Specifications</th>
                <th className="px-8 py-6 text-xs font-bold uppercase tracking-widest text-[#d6b25e]">Price</th>
                <th className="px-8 py-6 text-xs font-bold uppercase tracking-widest text-[#d6b25e] text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {filteredProducts.length > 0 ? (
                filteredProducts.map((product, idx) => (
                  <motion.tr 
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: idx * 0.03 }}
                    key={product._id} 
                    className="group hover:bg-white/[0.015] transition-colors"
                  >
                    <td className="px-8 py-6">
                      <div className="flex items-center gap-6">
                        <div className="h-20 w-20 rounded-2xl overflow-hidden border border-white/10 bg-white/5 shadow-inner">
                          <img 
                            src={product.image} 
                            alt={product.name} 
                            className="h-full w-full object-cover group-hover:scale-110 transition-transform duration-500"
                            onError={(e) => (e.currentTarget.src = 'https://via.placeholder.com/200?text=Jewellery')}
                          />
                        </div>
                        <div>
                          <p className="font-bold text-white text-lg">{product.name}</p>
                          <div className="flex items-center gap-2 mt-1.5">
                            <span className="text-xs px-2.5 py-1 rounded-full bg-[#d6b25e]/10 border border-[#d6b25e]/30 text-[#f1dc9a] font-medium">
                              {product.category}
                            </span>
                            {product.badge && (
                              <span className="text-xs px-2.5 py-1 rounded-full bg-white/5 border border-white/10 text-white/50 font-medium">
                                {product.badge}
                              </span>
                            )}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="px-8 py-6">
                      <div className="space-y-1.5">
                        <div className="flex items-center gap-2 text-sm text-white/60">
                          <Layers size={14} className="text-[#d6b25e]/60" />
                          <span>Purity: {product.purity.join(', ')}</span>
                        </div>
                        <div className="text-xs text-white/30 italic max-w-[200px] truncate">
                          {product.description}
                        </div>
                      </div>
                    </td>
                    <td className="px-8 py-6">
                      <div className="space-y-0.5">
                        <p className="text-lg font-bold gold-text">
                          {product.pricePKR.toLocaleString()} <span className="text-[10px] opacity-70">PKR</span>
                        </p>
                        {product.compareAtPKR && (
                          <p className="text-xs text-white/30 line-through">
                            {product.compareAtPKR.toLocaleString()} PKR
                          </p>
                        )}
                      </div>
                    </td>
                    <td className="px-8 py-6 text-right">
                      <div className="flex items-center justify-end gap-3">
                        <button
                          onClick={() => editHandler(product)}
                          className="btn !bg-transparent !p-2.5 !border-white/10 hover:!border-[#d6b25e]/30 hover:!bg-[#d6b25e]/10 group transition-all"
                          title="Edit Product"
                        >
                          <Edit3 className="h-4 w-4 text-white/40 group-hover:text-[#d6b25e]" />
                        </button>
                        <button
                          onClick={() => deleteHandler(product._id, product.name)}
                          className="btn !bg-transparent !p-2.5 !border-white/10 hover:!border-red-500/30 hover:!bg-red-500/10 group transition-all"
                          title="Delete Product"
                        >
                          <Trash2 className="h-4 w-4 text-white/40 group-hover:text-red-400" />
                        </button>
                      </div>
                    </td>
                  </motion.tr>
                ))
              ) : (
                <tr>
                  <td colSpan={4} className="px-8 py-24 text-center">
                    <Package className="mx-auto h-16 w-16 text-white/5 mb-6" />
                    <p className="text-white/30 text-xl font-light">No pieces found in your collection.</p>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
      
      <div className="mt-8 flex items-center gap-5 rounded-3xl border border-[#d6b25e]/20 bg-[#d6b25e]/5 p-6 shadow-[0_10px_30px_rgba(0,0,0,0.2)]">
        <AlertTriangle className="h-6 w-6 text-[#f1dc9a] shrink-0" />
        <p className="text-white/70 leading-relaxed">
          <strong className="text-[#f1dc9a]">Inventory Caution:</strong> Changes to products are reflected immediately across the storefront. 
          Deleting a product is permanent and cannot be undone. Please ensure all details are accurate before publishing.
        </p>
      </div>
    </div>
  )
}
