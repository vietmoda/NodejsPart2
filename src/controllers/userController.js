import { response } from 'express';
import { createUserService, 
    loginUserService, 
    getDetailUserService, 
    searchUserService, 
    updateUserService,
    deleteUserService,
    getAllUserService,
    deleteAllUserService,
    userRefreshTokenService} from '../services/UserService.js'

export const userController = (req, res) =>{
    res.send('hello user')
}

export const detailsUserController = async (req, res) =>{
    const userId = req.params;
    // console.log(userId);
    if(userId){
        const response = await getDetailUserService(userId)
        return res.json(response)
    }else{
        return res.json({
            status: 'err',
            message: 'id là bắt buộc'
        })
    }
}

export const createUserController = async (req, res) =>{
    // console.log('req.body', req.body);
    const {userName, password, name, email} = req.body

        if(userName && password && name && email){
           const response = await createUserService({userName, password, name, email})
           return res.json(response)
        }else{
            return res.json({
                status: 'err',
                message: 'thong tin bat buoc phai nhap day du'
            })
        }
}

export const loginUserController = async (req, res) =>{
    // console.log('req.body', req.body);
    const {userName, password} = req.body

        if(userName && password){
           const response = await loginUserService({userName, password})
           return res.json(response)
        }else{
            return res.json({
                status: 'err',
                message: 'Thông tin đăng nhập phải điền đầy đủ tên và mật khẩu'
            })
        }
}

export const userRefreshTokenController = async (req, res) => {
    try {
        const token = req.headers
        const refreshToken = token.refresh_token.split(' ')[1]
        // console.log('Token: ', token);
        // console.log('refreshToken: ', refreshToken);
        if(refreshToken){
            const response = await userRefreshTokenService(refreshToken)
            return res.status(200).json(response)
        }else{
            return res.json({
                status: 'err',
                message: 'Không có refresh token'
            })
        }
    } catch (error) {
        console.error('err: ', error)
        return res.status(400).json({
            status: 'errr',
            message: error
        })
    }
}

export const searchUserController = async (req, res) => {
    try{
        const {name} = req.query
        console.log('name: ', req.query)
        if(name){
            const response = await searchUserService(name)
            return res.json(response)
        }else{
            return res.json({
                status:'err',
                message: 'Không được để trống tên người dùng'
            })
        }
    }catch(err){
        console.error('err: ', err)
        return res.json({
            status: 'err',
            message: err
        })
    }
}

export const updateUserController = async (req, res) => {
    try{
        const {userId} = req.params
        const data = req.body
        console.log('data', data, userId);
        if(userId){
            const response = await updateUserService(userId, data)
            return res.json(response)
        }else{
            return res.json({
                status: 'err',
                message: 'Không tồn tại dữ liệu để cập nhập'
            })
        }
    }catch(err){
        console.error('err: ', err)
        return res.json({
            status: 'err',
            message: err
        })
    }
}

export const deleteUserController = async (req, res) => {
try {
    const {userId} = req.params
    // console.log('userId', userId);
    if(userId){
        const response = await deleteUserService(userId)
        return res.status(202).json(response)
    }else{
        return res.json({
            status: 'err',
            message: 'Không tìm thấy đối tượng cần xóa'
        })
    }
} catch (error) {
    console.error('err: ', error)
    return res.error(404).json({
        status: 'err',
        message: error
    })
}
}

export const getAllUserController = async (req, res) => {
    const response = await getAllUserService()
    return res.json(response)
}

export const deleteAllUserController = async (req, res) => {
    const {id} = req.query
    try {
        if (id) {
            const response = await deleteAllUserService(id)
            return res.json(response)
        }else{
            return res.json({
                status: 'err',
                message: 'Không có người dùng để xóa'
            })
        }
    } catch (error) {
        return res.status(400).json({
            status: 'err',
            message: error
        })
    }
}