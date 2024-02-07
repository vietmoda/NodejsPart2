import Jwt from 'jsonwebtoken'

export const authMiddelware =(req, res, next) =>{
    console.log('req.header: ', req.headers)
    const token = req.headers.token.split(' ')[1]

    if(!token){
        return res.status(404).json({
            message: 'Không có token'
        })
    }

    Jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, function(err, user) {
        console.error('errr: ', err)
        if(err){
            return res.status(404).json({
                message: 'người dùng này không có quyền hoặc hết thời gian truy cập, yêu cầu đăng nhập lại'
            })
        }
        console.log('user: ', user);
        if(user.isAdmin){
            console.log("user.isadmin", user.isAdmin);
            next()
        }else{
            return res.status(404).json({
                message: 'người dùng này không có quyền hoặc hết thời gian truy cập, yêu cầu đăng nhập lạii'
            })
        }
    });
    // next()
}

export const authStudentMiddelware = (req, res, next) => {
    // console.log('req.headers: ', req.headers);
    const token = req.headers.token.split(' ')[1]
    // console.log('acces_token: ', token);

    if(!token){
        return res.status(404).json({
            message: 'Không có token'
        })
    }

    Jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, function(err, student) {
        if (err) {
            console.error('err: ', err)
          return res.status(400).json({
            status: 'errr',
            message: 'Tài khoản không được cấp quyền hoặc hết thời gian đăng nhập, hãy đăng nhập lại'
          })
        }
        console.log('student: ', student);

        if(student.isAdmin){
            next()
        }else{
            return res.status(400).json({
                status: 'err',
                message: 'Tài khoản không được cấp quyền hoặc hết thời gian đăng nhập, hãy đăng nhập lại'
            })
        }
      });
      
}