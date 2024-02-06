import express from 'express'
import { createStudentController, 
        detailsStudentController, 
        studentController, 
        loginStudentController, 
        searchStudentController, 
        updateStudentController,
        deleteStudentController,
        getAllStudentController,
        deleteAllStudentController } from '../controllers/studentController.js'
import { authStudentMiddelware } from '../middleware/authMiddleware.js'

const router = express.Router()

router.get('/search', searchStudentController)

router.get('/getAll', authStudentMiddelware, getAllStudentController)

router.get('/:studentId', detailsStudentController)

router.patch('/update/:studentId', updateStudentController)

router.delete('/delete/:studentId', deleteStudentController)

router.delete('/deleteMany', deleteAllStudentController)

router.post('/', createStudentController)

router.post('/login', loginStudentController)

router.get('/', studentController)
export default router