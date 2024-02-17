import {sendEmailService} from '../services/EmailService.js'


export const sendEmailController = async (req, res) => {
    try {
        const {email} = req.body
    // console.log('email: ', email);
        const response = await sendEmailService(email)
        res.status(200).json(response)
    } catch (error) {
        console.error('err: ', error)
        res.status(400).json({
            status: 'errr',
            Message: error
        })
    }
    
}
