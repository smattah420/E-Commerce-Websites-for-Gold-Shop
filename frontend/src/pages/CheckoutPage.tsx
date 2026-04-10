import { useState } from 'react'
import { Link } from 'react-router-dom'
import { products } from '../lib/catalog'
import { formatPKR } from '../lib/format'
import { useStore } from '../store/StoreContext'
import { useNotification } from '../store/NotificationContext'
import axios from 'axios'

export function CheckoutPage() {
  const { subtotal, cart, clearCart } = useStore()
  const { showNotification } = useNotification()
  const shipping = cart.length ? 2500 : 0
  const total = subtotal + shipping

  const [placed, setPlaced] = useState(false)
  const [loading, setLoading] = useState(false)
  const [form, setForm] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    address: '',
    city: '',
    postalCode: '',
    paymentMethod: 'Cash on Delivery',
    cardNumber: '',
    cardName: '',
    cardExpiry: '',
    cardCVV: '',
    transactionRef: '',
  })

  const updateForm = (key: string, val: string) => setForm((prev) => ({ ...prev, [key]: val }))

  // Guard: redirect if cart is empty and order not placed
  if (!placed && cart.length === 0) {
    return (
      <div className="glass rounded-2xl p-8 text-center">
        <h1 className="text-4xl">Your Cart is Empty</h1>
        <p className="mt-2 text-sm text-white/65">
          Please add items to your cart before checking out.
        </p>
        <Link className="btn btn-gold mt-5" to="/products">
          Shop Now
        </Link>
      </div>
    )
  }

  const handleOrder = async () => {
    if (!form.firstName || !form.phone || !form.address) {
      showNotification('Please fill in required fields (First Name, Phone, Address)', 'error')
      return
    }

    if (form.paymentMethod === 'Card' && (!form.cardNumber || !form.cardExpiry || !form.cardCVV)) {
      showNotification('Please fill in all Card details', 'error')
      return
    }

    if (form.paymentMethod === 'Bank Transfer' && !form.transactionRef) {
      showNotification('Please provide your Bank Transfer Transaction Reference Number', 'error')
      return
    }

    const payload = {
      customer: {
        firstName: form.firstName,
        lastName: form.lastName,
        email: form.email,
        phone: form.phone,
        address: form.address,
        city: form.city,
        postalCode: form.postalCode,
      },
      items: cart.map((i) => ({
        productId: i.productId,
        qty: i.qty,
        purity: i.purity ?? '',
        size: i.size ?? '',
      })),
      total,
      paymentMethod: form.paymentMethod,
      paymentDetails: {
        cardLast4: form.paymentMethod === 'Card' ? form.cardNumber.slice(-4) : undefined,
        transactionRef: form.paymentMethod === 'Bank Transfer' ? form.transactionRef : undefined,
      },
    }

    setLoading(true)
    try {
      const res = await axios.post('http://e-commerce-websites-for-gold-shop-production.up.railway.app/api/orders', payload)
      console.log('Order saved:', res.data)
      clearCart()
      setPlaced(true)
      showNotification('Order placed successfully!', 'success')
    } catch (error: any) {
      console.error('Order error:', error?.response?.data ?? error)
      showNotification(
        `Order failed: ${error?.response?.data?.message ?? 'Please check your connection.'}`,
        'error'
      )
    } finally {
      setLoading(false)
    }
  }

  if (placed) {
    return (
      <div className="glass rounded-2xl p-8 text-center">
        <h1 className="text-4xl">Order Placed Successfully ✅</h1>
        <p className="mt-2 text-sm text-white/65">
          Thank you for shopping with Al Majeed Jewellers. We will contact you shortly.
        </p>
        <Link className="btn btn-gold mt-5" to="/home">
          Back to Home
        </Link>
      </div>
    )
  }

  return (
    <div className="grid gap-6 lg:grid-cols-[1fr_380px]">
      {/* ── Customer Details ── */}
      <section className="glass rounded-2xl p-5">
        <h1 className="text-4xl">Checkout</h1>
        <div className="mt-5 grid gap-3 md:grid-cols-2">
          <input
            className="input"
            placeholder="First Name *"
            value={form.firstName}
            onChange={(e) => updateForm('firstName', e.target.value)}
          />
          <input
            className="input"
            placeholder="Last Name"
            value={form.lastName}
            onChange={(e) => updateForm('lastName', e.target.value)}
          />
          <input
            className="input md:col-span-2"
            placeholder="Email Address"
            value={form.email}
            onChange={(e) => updateForm('email', e.target.value)}
          />
          <input
            className="input md:col-span-2"
            placeholder="Phone Number *"
            value={form.phone}
            onChange={(e) => updateForm('phone', e.target.value)}
          />
          <input
            className="input md:col-span-2"
            placeholder="Street Address *"
            value={form.address}
            onChange={(e) => updateForm('address', e.target.value)}
          />
          <input
            className="input"
            placeholder="City"
            value={form.city}
            onChange={(e) => updateForm('city', e.target.value)}
          />
          <input
            className="input"
            placeholder="Postal Code"
            value={form.postalCode}
            onChange={(e) => updateForm('postalCode', e.target.value)}
          />
        </div>

        {/* Payment Method */}
        <div className="mt-5 rounded-xl border border-white/10 bg-white/5 p-4">
          <p className="text-sm uppercase tracking-[0.15em] text-white/55">Payment Method</p>
          <div className="mt-3 grid gap-2 sm:grid-cols-3">
            <button
              type="button"
              className={`btn ${form.paymentMethod === 'Card' ? 'btn-gold' : ''}`}
              onClick={() => updateForm('paymentMethod', 'Card')}
            >
              Card
            </button>
            <button
              type="button"
              className={`btn ${form.paymentMethod === 'Bank Transfer' ? 'btn-gold' : ''}`}
              onClick={() => updateForm('paymentMethod', 'Bank Transfer')}
            >
              Bank Transfer
            </button>
            <button
              type="button"
              className={`btn ${form.paymentMethod === 'Cash on Delivery' ? 'btn-gold' : ''}`}
              onClick={() => updateForm('paymentMethod', 'Cash on Delivery')}
            >
              Cash on Delivery
            </button>
          </div>

          {/* Conditional Payment Details */}
          <div className="mt-4 animate-in fade-in slide-in-from-top-2 duration-300">
            {form.paymentMethod === 'Card' && (
              <div className="grid gap-3 rounded-xl border border-white/10 bg-white/[0.02] p-4">
                <p className="text-xs font-bold uppercase tracking-widest text-[#d6b25e]">Card Details</p>
                <input
                  className="input !bg-white/5"
                  placeholder="Cardholder Name"
                  value={form.cardName}
                  onChange={(e) => updateForm('cardName', e.target.value)}
                />
                <input
                  className="input !bg-white/5"
                  placeholder="Card Number (0000 0000 0000 0000)"
                  value={form.cardNumber}
                  onChange={(e) => updateForm('cardNumber', e.target.value)}
                />
                <div className="grid grid-cols-2 gap-3">
                  <input
                    className="input !bg-white/5"
                    placeholder="Expiry (MM/YY)"
                    value={form.cardExpiry}
                    onChange={(e) => updateForm('cardExpiry', e.target.value)}
                  />
                  <input
                    className="input !bg-white/5"
                    placeholder="CVV"
                    value={form.cardCVV}
                    onChange={(e) => updateForm('cardCVV', e.target.value)}
                    type="password"
                    maxLength={4}
                  />
                </div>
              </div>
            )}

            {form.paymentMethod === 'Bank Transfer' && (
              <div className="grid gap-4 rounded-xl border border-white/10 bg-white/[0.02] p-5">
                <div>
                  <p className="text-xs font-bold uppercase tracking-widest text-[#d6b25e] mb-2">Our Bank Details</p>
                  <div className="space-y-1 text-sm text-white/70">
                    <p><span className="text-white/40">Bank:</span> Meezan Bank Limited</p>
                    <p><span className="text-white/40">Account Name:</span> Al Majeed Jewellers</p>
                    <p><span className="text-white/40">Account Number:</span> 0101-0203040506</p>
                    <p><span className="text-white/40">IBAN:</span> PK71 MEZN 0001 0102 0304 0506</p>
                  </div>
                </div>
                
                <div className="border-t border-white/5 pt-4">
                  <p className="text-xs font-bold uppercase tracking-widest text-white/40 mb-3">After transfer, paste your Transaction ID below:</p>
                  <input
                    className="input !bg-white/5 !border-[#d6b25e]/30"
                    placeholder="Transaction Reference Number"
                    value={form.transactionRef}
                    onChange={(e) => updateForm('transactionRef', e.target.value)}
                  />
                  <p className="mt-2 text-[10px] text-white/30 italic">Note: Your order will be processed after payment verification.</p>
                </div>
              </div>
            )}

            {form.paymentMethod === 'Cash on Delivery' && (
              <div className="rounded-xl border border-[#d6b25e]/20 bg-[#d6b25e]/5 p-5 text-center">
                <p className="text-sm text-[#f1dc9a]">You will pay the total amount at the time of delivery.</p>
                <p className="mt-1 text-[11px] text-white/40">Available across all major cities in Pakistan.</p>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* ── Order Summary Sidebar ── */}
      <aside className="glass h-fit rounded-2xl p-5">
        <h2 className="text-3xl">Order Summary</h2>

        {/* Cart Items List */}
        <div className="mt-4 space-y-3">
          {cart.map((item) => {
            const p = products.find((x) => x.id === item.productId)
            if (!p) return null
            return (
              <div
                key={`${item.productId}-${item.purity}-${item.size}`}
                className="flex items-center gap-3 border-b border-white/10 pb-3"
              >
                <img src={p.image} alt={p.name} className="h-14 w-14 rounded-xl object-cover" />
                <div className="flex-1 text-sm">
                  <p className="font-medium text-white/90">{p.name}</p>
                  <p className="text-xs text-white/50">
                    {[item.purity, item.size && `Size ${item.size}`].filter(Boolean).join(' · ')}
                  </p>
                  <p className="text-xs text-white/60">Qty: {item.qty}</p>
                </div>
                <p className="text-sm font-semibold text-white/90">
                  {formatPKR(p.pricePKR * item.qty)}
                </p>
              </div>
            )
          })}
        </div>

        {/* Totals */}
        <div className="mt-4 space-y-2 text-sm">
          <div className="flex justify-between text-white/70">
            <span>Subtotal</span>
            <span>{formatPKR(subtotal)}</span>
          </div>
          <div className="flex justify-between text-white/70">
            <span>Shipping</span>
            <span>{formatPKR(shipping)}</span>
          </div>
          <div className="flex justify-between border-t border-white/10 pt-2 font-semibold text-white/95">
            <span>Total</span>
            <span>{formatPKR(total)}</span>
          </div>
        </div>

        <button
          className="btn btn-gold mt-5 w-full"
          onClick={handleOrder}
          disabled={loading}
        >
          {loading ? 'Processing...' : 'Place Order'}
        </button>
      </aside>
    </div>
  )
}
