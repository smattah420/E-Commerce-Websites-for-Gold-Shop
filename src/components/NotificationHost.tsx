import { motion, AnimatePresence } from 'framer-motion'
import { useNotification, type Notification as NotificationType } from '../store/NotificationContext'
import { X, CheckCircle, AlertCircle, Info } from 'lucide-react'

const icons = {
  success: <CheckCircle className="text-emerald-400" size={20} />,
  error: <AlertCircle className="text-rose-400" size={20} />,
  info: <Info className="text-[#d6b25e]" size={20} />,
}

const backgrounds = {
  success: 'bg-emerald-500/10 border-emerald-500/20',
  error: 'bg-rose-500/10 border-rose-500/20',
  info: 'bg-[#d6b25e]/10 border-[#d6b25e]/20',
}

export function NotificationHost() {
  const { notifications, hideNotification } = useNotification()

  return (
    <div className="fixed top-24 left-1/2 -translate-x-1/2 z-[9999] flex flex-col items-center gap-3 w-full max-w-md px-4 pointer-events-none">
      <AnimatePresence mode="popLayout">
        {notifications.map((n) => (
          <Notification key={n.id} notification={n} onHide={() => hideNotification(n.id)} />
        ))}
      </AnimatePresence>
    </div>
  )
}

function Notification({ notification, onHide }: { notification: NotificationType; onHide: () => void }) {
  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: -20, scale: 0.9 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, scale: 0.9, transition: { duration: 0.2 } }}
      className={`
        pointer-events-auto flex items-center gap-4 p-4 rounded-2xl glass border shadow-2xl backdrop-blur-xl
        ${backgrounds[notification.type]} w-full
      `}
    >
      <div className="flex-shrink-0">
        {icons[notification.type]}
      </div>
      <p className="flex-1 text-sm font-medium text-white/90 leading-tight">
        {notification.message}
      </p>
      <button
        onClick={onHide}
        className="flex-shrink-0 text-white/30 hover:text-white/60 transition-colors"
      >
        <X size={18} />
      </button>
    </motion.div>
  )
}
