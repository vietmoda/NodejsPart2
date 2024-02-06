import { json } from 'express';
import {Student} from '../models/studentModel.js'
import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken'

export const createStudentService = ({name, studentPassword, birthday, mssv, studentClass}) => {
    return new Promise(async (resolve, reject) => {
        try{
            const isCheckMssv = /^[A-Z]{3}\d{5}$/.test(mssv)
            console.log('ischeckmssv', isCheckMssv);
            if(isCheckMssv) {
                const checkName = await Student.find({name: name})
                const checkMssv = await Student.find({mssv: mssv})
                console.log('checkmssv', checkMssv);
                if(checkName.length || checkMssv.length){
                    resolve({
                        status: 'err',
                        message: 'Tên đăng nhập hoặc mã sinh viên không khả dụng'
                    })   
                }
                const hashPassword = bcrypt.hashSync(studentPassword, 10)
                const newStudent = await Student.create({
                    name,
                    studentPassword: hashPassword,
                    birthday,
                    mssv,
                    studentClass})
                resolve({
                    status: 'ok',
                    message: "thêm thành công",
                    data: {
                        name,
                        birthday,
                        mssv,
                        studentClass
                    }
                })
                
            }else{
                resolve({
                    status: 'err',
                    message: 'Mã sinh viên không đúng'
                })
            }
            
        }
        catch(err){
            console.error('lỗi: ', err);
            reject({
                status: 'err',
                message: err
            })
        }
    })
}

export const loginStudentService = ({mssv, studentPassword}) => {
    return new Promise (async(resolve, reject) => {
        try{
            const mssvDB = await Student.find({mssv: mssv})
            if(mssvDB.length){
                const checkPassword = bcrypt.compareSync(studentPassword, mssvDB[0].studentPassword)
                if(checkPassword){
                    const access_token = jwt.sign({isAdmin: mssvDB[0].isAdmin, _id: mssvDB[0]._id},'access token student', {expiresIn:'60m'});
                    resolve({
                        status: 'ok',
                        message: 'đăng nhập thành công',
                        data: {
                            access_token
                            // name: mssvDB[0].name,
                            // mssv: mssvDB[0].mssv,
                            // class: mssvDB[0].studentClass
                        }
                    })
                }else{
                    resolve({
                        status: 'err',
                        message: 'mật khẩu sai'
                    })
                }
            }else{
                resolve({
                    status: 'err',
                    message: 'Sai mã sinh viên'
                })
            }
        }catch(err){
            console.log('lỗi: ', err);
            reject ({
                status: 'err',
                message: err
            })
        }
    })
}

export const getDetailStudentService = (id) => {
    return new Promise (async(resolve, reject) => {
        try{
        const studentId = id.studentId || id
        const findStudent = await Student.findById(studentId)
        if(findStudent){
            resolve({
                status: 'ok',
                data: findStudent
            })
        }else{
            resolve({
                status: 'err',
                message: 'khong co data'
            })
        }
        }
        catch(err){
            reject({
                status: 'err',
                message: err
            })
        }
        
    }).catch(e=>e)
}

export const searchStudentService = (name) => {
    return new Promise (async(resolve, reject) => {
        try{
            const nameDB = await Student.find({name})
        // console.log('nameDB: ', nameDB);
            if(nameDB.length){
                resolve({
                    status: 'ok',
                    data: nameDB
                })
            }else{
                resolve({
                    status: 'err',
                    message: 'Không tìm thấy dữ liệu'
                })
            }
        }catch(err){
            console.error('err: ', err)
            reject({
                status: 'err',
                message: err
            })
        }
        
    })
}

export const updateStudentService = (id, data) => {
    return new Promise (async(resolve, reject) => {
        try {
            const checkName = await Student.findOne({name: data.name})
            const checkMssv = await Student.findOne({mssv: data.mssv})
            if(checkMssv === null && checkName === null){
                const updateStudent = await Student.findByIdAndUpdate(id, data)
                if(updateStudent){
                    const newStudent = await getDetailStudentService(id)
                    resolve({
                        status: 'Cập nhật thông tin sinh viên thành công',
                        data: newStudent
                    })
                }else{
                    resolve({
                        status: 'err',
                        message: 'lỗi'
                    })
                }
            }else{
                resolve({
                    status: 'err',
                    message: 'Tên đăng nhập hoặc mã sinh viên đã tồn tại'
                })
            }
        } catch (error) {
            console.error('err: ', error)
            reject({
                status: 'err',
                message: error
            })
        }
    })
}

export const deleteStudentService = (id) =>{
    return new Promise (async(resolve, reject)=>{
        try {
            const checkId = await Student.find({_id: id})
            if (checkId.length) {
                const deleteStudent = await Student.findByIdAndDelete(id)
                resolve({
                    status: 'ok',
                    message: 'Xóa thành công '+ checkId[0].name
                })
            }else{
                resolve({
                    status: 'err',
                    message: 'Không tìm thấy đối tượng cần xóa'
                })
            }
        } catch (error) {
            console.error('err: ', error)
            reject({
                status: 'err',
                message: 'Không tìm thấy đối tượng cần xóa'
            })
        }
    }).catch(e=>e)
}

export const getAllStudentService = () =>{
    return new Promise (async(resolve, reject)=>{
        try {
            const allStudent = await Student.find()
            resolve({
                status: 'ok',
                data: allStudent
            })
        } catch (error) {
            console.error('err: ', error)
            reject({
                status: 'err',
                message: error
            })
        }
    }).catch(e=>e)
}

export const deleteAllStudentService = (ids) =>{
    return new Promise (async(resolve, reject) => {
        try {
            const deleteManyStudent = await Student.deleteMany({ _id: ids })
            // console.log('deletteManyStudent: ', deleteManyStudent);
            if (deleteManyStudent.deletedCount>0) {
                resolve({
                    status: 'ok',
                    message: 'Đã xóa thành công ' + deleteManyStudent.deletedCount +' học sinh'
                })
            }else{
                resolve({
                    status: 'err',
                    message: 'Không tìm được đối tượng để xóa hic'
                })
            }
        } catch (error) {
            console.error('err: ', error)
            reject({
                status: 'err',
                message: 'Không tìm thấy đối tượng cần xóa'
            })
        }
    }).catch(e=>e)
}