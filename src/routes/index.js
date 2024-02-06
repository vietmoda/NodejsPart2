import userRouter from './user.js'
import studentRouter from './student.js'
const routes = (app) => {
    app.get('/', (req, res) => {
        res.render('new')
    })
    
    app.use('/user', userRouter)

    app.use('/student', studentRouter)
}
export default routes