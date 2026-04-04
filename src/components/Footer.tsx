import { Camera, Mail, Phone } from 'lucide-react'
import { Link } from 'react-router-dom'

export function Footer() {
  return (
    <footer className="mt-16 border-t border-white/10">
      <div className="container-lux grid gap-10 py-12 md:grid-cols-4">
        <div className="md:col-span-2">
          <h3 className="font-serif text-2xl text-white/95">
            Al Majeed <span className="gold-text">Jewellers</span>
          </h3>
          <p className="mt-3 max-w-xl text-sm text-white/65">
            Luxury gold jewellery crafted for modern elegance—premium finishes,
            timeless silhouettes, and a shopping experience designed for comfort.
          </p>
          <div className="mt-6 flex flex-wrap gap-2">
            <span className="chip">Cash on Delivery</span>
            <span className="chip">Certified Purity</span>
            <span className="chip">Fast Delivery</span>
          </div>
        </div>

        <div>
          <h4 className="text-sm font-semibold tracking-wide text-white/90">
            Shop
          </h4>
          <ul className="mt-3 space-y-2 text-sm text-white/65">
            <li>
              <Link className="hover:text-white/90 transition" to="/products">
                All Products
              </Link>
            </li>
            <li>
              <Link
                className="hover:text-white/90 transition"
                to="/products?category=Necklaces"
              >
                Necklaces
              </Link>
            </li>
            <li>
              <Link
                className="hover:text-white/90 transition"
                to="/products?category=Earrings"
              >
                Earrings
              </Link>
            </li>
            <li>
              <Link
                className="hover:text-white/90 transition"
                to="/products?category=Rings"
              >
                Rings
              </Link>
            </li>
          </ul>
        </div>

        <div>
          <h4 className="text-sm font-semibold tracking-wide text-white/90">
            Contact
          </h4>
          <ul className="mt-3 space-y-3 text-sm text-white/65">
            <li className="flex items-center gap-2">
              <Phone size={16} className="text-white/60" />
              <span>+92 3273757876</span>
            </li>
            <li className="flex items-center gap-2">
              <Mail size={16} className="text-white/60" />
              <span>attahsyedmd735@gmail.com</span>
            </li>
            <li className="flex items-center gap-2">
              <Camera size={16} className="text-white/60" />
              <span>@almajeedjewellers</span>
            </li>
          </ul>
        </div>
      </div>

      <div className="border-t border-white/10 py-5">
        <div className="container-lux flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <p className="text-xs text-white/50">
            © {new Date().getFullYear()} Al Majeed Jewellers. All rights reserved.
          </p>
          <div className="flex gap-4 text-xs text-white/55">
            <a className="hover:text-white/90 transition" href="#">
              Privacy
            </a>
            <a className="hover:text-white/90 transition" href="#">
              Returns
            </a>
            <a className="hover:text-white/90 transition" href="#">
              Terms
            </a>
          </div>
        </div>
      </div>
    </footer>
  )
}

