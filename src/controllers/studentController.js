import { createStudentService, 
    loginStudentService ,
    getDetailStudentService, 
    searchStudentService, 
    updateStudentService,
    deleteStudentService,
    getAllStudentService,
    deleteAllStudentService} from "../services/StudentService.js"

export const studentController = (req, res) =>{
    res.send('hello student')
}

export const detailsStudentController = async (req, res) =>{
    const studentId = req.params
    console.log('studentid', studentId);
    if(studentId){
        const response = await getDetailStudentService(studentId)
        return res.json(response)
    }else{
        return res.json({
            status: 'err',
            Message: 'Id là bắt buộc'
        })
    }
}

export const createStudentController = async (req, res) =>{
    console.log('req', req.body);
    const {name, studentPassword, birthday, mssv, studentClass} = req.body
    console.log('res', name, studentPassword, birthday, mssv, studentClass);
    if(name && studentPassword && birthday && mssv && studentClass){
        const response = await createStudentService({name, studentPassword, birthday, mssv, studentClass})
        return res.json(response)
    }else{
        return res.json({
            status : "err",
            Message: "Hãy điền đầy đủ thông tin đăng ký"
        })
    }
    
}

export const loginStudentController = async (req, res) => {
    const {mssv, studentPassword} = req.body
    if(mssv && studentPassword){
        const response = await loginStudentService ({mssv, studentPassword})
        return res.json(response)
    }else{
        return res.json({
            status: 'err',
            Message: 'Hãy điền đầy đủ thông tin đăng nhập'
        })
    }
}

export const searchStudentController = async (req, res) => {
    try{
        const {name} = req.query
        // console.log('name: ', name);
        if(name){
            const response = await searchStudentService(name)
            return res.json(response)
        }else{
            return res.json({
                status: 'err',
                Message: 'Nhập tên học sinh là bắt buộc'
            })
        }
    }catch(err){
        console.error("err: ", err)
        return res.json({
            status: 'err',
            Message: err
        })
    }
}

export const updateStudentController = async (req, res) => {
    try {
        const {studentId}= req.params
        const data = req.body
        // console.log('req: ', studentId, data);
        if(studentId){
            const response = await updateStudentService(studentId, data)
            return res.json(response)
        }else{
            return res.json({
                status: 'err',
                Message: 'Không tồn tại người dùng cần cập nhật'
            })
        }
    } catch (error) {
        console.error('err: ', error)
        return res.json({
            status: 'err',
            Message: error
        })
    }
}

export const deleteStudentController = async (req, res) => {
    try {
        const {studentId} = req.params
        if(studentId){
            const response = await deleteStudentService(studentId)
            return res.status(202).json(response)
        }else{
            return res.json({
                status: 'err',
                Message: 'Chưa chọn đối tượng cần xóa'
            })
        }
    } catch (error) {
        console.error(error)
        return res.error(404).json({
            status: 'err',
            Message: error
        })
    }
}

export const getAllStudentController = async (req, res) => {
    try {
        const response = await getAllStudentService()
        return res.status(200).json(response)
    } catch (error) {
        console.error('err: ', error)
        return res.error(400).json({
            status: 'err',
            Message: error
        })
    }
}

export const deleteAllStudentController = async (req, res) => {
        const {id} = req.query
        // console.log('id: ', id);
    try {
        
        if(id){
            const response = await deleteAllStudentService(id)
            return res.status(200).json(response)
        }else{
            return res.json({
                status: 'err',
                Message: 'không có đối tượng được chọn để xóa'
            })        }
    } catch (error) {
        return res.status(400).json({
            status: 'err: ',
            Message: error
        })
    }
}