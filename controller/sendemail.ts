import { Request, Response } from "express";
import nodemailer from 'nodemailer'


const sendMail = async(req:Request,res:Response)=>{
    console.log(req.body)
    const {
        name,
        email
      }= req.body
    const html=`
    <h1>${name}</h1>
    <p>This is a user from the expense tracker app with email ${email}</p>
    <p>hello world</p>
    `
    const transporter = nodemailer.createTransport({
        host: 'smtp.ethereal.email',
        port: 587,
        auth: {
            user: 'kurtis84@ethereal.email',
            pass: 'UP3jbdjWjGyW4w6G22'
        }
    });
try {
    
    const info = await transporter.sendMail({
        from: `"${name}" <${email}>`,
        to: "kurtis84@ethereal.email", // Test email address
        subject: `Email from ${name} user of expense tracker `,
        text: `${name}  This is a user from the expense tracker app with email ${email}`,
        html: html,
      });
    console.log(`message sent : ${info.messageId}`)
} catch (error) {
    console.log(error)
    res.json({message:'message not sent'})
}
res.json({message:'message sent'})
}

export default sendMail 