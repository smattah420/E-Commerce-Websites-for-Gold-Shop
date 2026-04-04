import express from 'express'
import {
  authUser,
  registerUser,
  getUsers,
  deleteUser,
  updateUserToAdmin,
} from '../controllers/userController.js'
import { protect, admin } from '../middleware/authMiddleware.js'

const router = express.Router()

router.route('/').post(registerUser).get(protect, admin, getUsers)
router.post('/login', authUser)
router.route('/:id').delete(protect, admin, deleteUser)
router.route('/:id/admin').put(protect, admin, updateUserToAdmin)

export default router
