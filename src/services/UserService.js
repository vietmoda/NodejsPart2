import { User } from '../models/userModel.js'
import bcrypt from 'bcrypt' //mã hóa password
import Jwt from 'jsonwebtoken'

export const createUserService = ({userName, password, name, email}) => {
    return new Promise ( async (resolve, reject) => {
        try{
            const isEmail = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(email)

            if(isEmail){

                const isCheckEmail = await User.find({email: email})
                const isCheckUsername = await User.find({userName: userName})

                if(isCheckEmail.length || isCheckUsername.length){
                    resolve({
                        status: 'err',
                        message: 'Email hoặc tên người dùng đã tồn tại'
                    })
                }

                const hashPassword = bcrypt.hashSync(password, 10); //mã hóa password
                // console.log('hashpass', hashPassword);
                const newUser = await User.create({
                    userName,
                    password: hashPassword, //lưu vào trong db là hashPassword để bảo mật
                    name,
                    email
                })
                
                resolve({
                    status: 'success',
                    message: 'Thêm thành công',
                    data: {
                        userName,
                        name,
                        email
                    }
                })
        }else{
            resolve({
                status: 'err',
                message: 'Nhập sai định dạng email'
            })
        }
        }
        catch(err){
            reject({
                status: 'err',
                message: err
            })
        }
    })
}

const generalAccessToken = (data) => {
    const access_token = Jwt.sign(data, process.env.ACCESS_TOKEN_SECRET, {expiresIn:'1m'})
    return access_token
}

const generalRefreshToken = (data) => {
    const refresh_token = Jwt.sign(data, process.env.REFRESH_TOKEN_SECRET, {expiresIn:'365d'})
    return refresh_token
}

export const loginUserService = ({userName, password}) =>{
    return new Promise (async(resolve, reject) => {
        try{
            const userDB = await User.find({userName: userName})
            // console.log('checkuser',password,  userDB[0].password, checkPassword);
            if(userDB.length>0){
                const checkPassword = bcrypt.compareSync(password, userDB[0].password)
                // console.log(checkPassword, userDB[0].password, password);
                if(checkPassword){
                    const access_token = generalAccessToken({isAdmin: userDB[0].isAdmin, _id: userDB[0]._id})
                    const refresh_token = generalRefreshToken({isAdmin: userDB[0].isAdmin, _id: userDB[0]._id})
                    resolve({
                        status: 'ok',
                        message: 'Đăng nhập thành công',
                        data: {
                            // userName: userDB[0].userName,
                            // email: userDB[0].email,
                            // name: userDB[0].name
                            access_token,
                            refresh_token
                        }
                    })
                }else{
                    resolve({
                        status: 'err',
                        message: 'Sai mật khẩu'
                    })
                }
            }else{
                resolve({
                    status: 'err',
                    message: 'Tên đăng nhập không tồn tại'
                })
            }
            
        }
        catch(err){
            reject({
                status: 'errr',
                message: err
            })
        }
    }).catch(e=>{
        // Xử lý lỗi ở đây
        console.error('Error:', e)})
}

export const userRefreshTokenService = (refreshToken) => {
    return new Promise(async(resolve, reject)=>{
        try {
            Jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET, function(err, user) {
                if(err){
                    console.error('errr: ', err)
                    resolve({
                        status: 'errr',
                        message: err
                    })
                }
                if(user){
                    console.log('users: ', user);
                    const access_token = generalAccessToken({isAdmin: user.isAdmin, _id: user._id})
                    console.log('access_token: ', access_token);
                    resolve({
                        status: 'ok',
                        data: access_token
                    })
                }
                
            })
            // console.log('token: ', refreshToken);
        } catch (error) {
            reject(error)
        }
    }).catch(e=>e)
}

export const getDetailUserService = (id) =>{
    return new Promise (async(resolve, reject) => {
        try{
            const userId = id.userId || id;
            // console.log('USERID: ', userId);
            const findUser = await User.findById(userId)
            // console.log('findUser: ', findUser);
            if(findUser){
                resolve({
                    status: 'ok',
                    data: findUser
                })
            }else{
                resolve({
                    status: 'err',
                    message: 'không tìm thấy dữ liệu'
                })
            }
        }
        catch(err){
            console.log('err:', err);
            reject({
                status: 'err',
                message: err
            })
        }
    }).catch(e => e)
}

export const searchUserService = (name) =>{
    return new Promise (async(resolve, reject) => {
        try{
            const userDB = await User.find({name})
            // console.log('userDB', userDB);
            if(userDB.length){
                resolve({
                    status: 'ok',
                    data: userDB
                })
            }else{
                resolve({
                    status: 'err',
                    message: 'Không tìm thấy dữ liệu'
                })
            }
            
        }catch(err){
            console.error('err:', err)
            reject({
                status: 'err',
                message: err
            })
        }
    }).catch(e=>e)
}

export const updateUserService = (id, data) => {
    return new Promise (async(resolve, reject) => {
        try {
                console.log('data', data.email);
                const checkDuplicateName = await User.findOne({userName: data.userName})
                const checkDuplicateEmail = await User.findOne({email: data.email})
                if(checkDuplicateName === null && checkDuplicateEmail === null){
                    const updateUser = await User.findByIdAndUpdate(id,data)
                    if(updateUser){
                        const newUser = await getDetailUserService(id)
                        resolve({
                            status: 'Cập nhật thông tin người dùng thành công',
                            data: newUser
                        })
                    }else{
                        resolve({
                            status: 'err',
                            message: 'Không tồn tại đối tượng cần sửa'
                        })
                    }
                }else{
                    resolve({
                        status: 'err',
                        message: 'Tên hoặc email trùng với người dùng đã tạo'
                    })
                }
                
        } catch (err) {
            console.error('err: ', err)
            reject({
                status: 'errrr',
                message: 'Không tìm thấy đối tượng cần sửa'
            })
        }

    }).catch(e=>e)
}

export const deleteUserService = (id) =>{
    return new Promise (async(resolve,reject) => {
        try {
            const checkId = await User.find({_id: id})
            // console.log('checkid: ', checkId.length);
            if(checkId.length){
                const deleteUser = await User.findByIdAndDelete(id)
                resolve({
                    status: 'Xóa thành công',
                    message: 'Xóa thành công '+ checkId[0].userName
                })
            }else{
                resolve({
                    status:'err',
                    message: 'Không tìm thấy người dùng để xóa'
                })
            }
        } catch (error) {
            console.error('err: ', error)
            reject({
                status: 'err',
                message: "Không tìm thấy đối tượng cần xóa"
            })
        }
    }).catch(e=>e)
}

export const getAllUserService = () =>{
    return new Promise (async(resolve, reject) => {
        try {
            const getAllUser = await User.find()
            // console.log('getAllUser: ', getAllUser);
            if(getAllUser.length){
                resolve({
                    status: 'ok',
                    data: getAllUser
                })
            }else{
                resolve({
                    status:'ok',
                    message: 'Không có dữ liệu để hiển thị'
                })
            }
            
        } catch (error) {
            reject({
                status: 'err',
                message: error
            })
        }
    })
}

export const deleteAllUserService = (ids) => {
    return new Promise (async(resolve, reject) =>{
        try {
            const deleteAllStudent = await User.deleteMany({_id: ids})
            if(deleteAllStudent.deletedCount>0){
                resolve({
                    status: 'ok',
                    message: 'Xóa thành công '+ deleteAllStudent.deletedCount+' người dùng'
                })
            }else{
                resolve({
                    status: 'ok',
                    message: 'Không có dữ liệu để xóa'
                })
            }
        } catch (error) {
            reject({
                status: 'err',
                message: error
            })
        }
    })
}