import userRouter from './user.js'
import studentRouter from './student.js'
import emailRouter from './email.js'
const routes = (app) => {
    app.get('/', (req, res) => {
        res.render('new')
    })
    
    app.use('/user', userRouter)

    app.use('/student', studentRouter)

    app.use('/email', emailRouter)
}
export default routes