import express from 'express'
import { detailsUserController, 
        userController, 
        createUserController, 
        loginUserController, 
        searchUserController,
        updateUserController,
        deleteUserController,
        getAllUserController,
        deleteAllUserController,
        userRefreshTokenController } from '../controllers/userController.js'
import {authMiddelware} from '../middleware/authMiddleware.js'

const router = express.Router()

router.get('/getAll', authMiddelware, getAllUserController)

router.get('/search', searchUserController)

router.get('/:userId', detailsUserController)

router.patch('/update/:userId', updateUserController)

router.delete('/delete/:userId', deleteUserController)

router.delete('/deleteMany', deleteAllUserController)

router.post('/', createUserController)

router.post('/login', loginUserController)

router.post('/refreshToken', userRefreshTokenController)

router.get('/', userController)
export default router