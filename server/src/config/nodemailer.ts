import nodemailer from "nodemailer"

export const emailService = async(mailTo : string , subject : string , text : string) => {
    try {
        const mailSender = nodemailer.createTransport({
            service : "gmail",
            auth : {
                user : process.env.GMAIL_USER,
                pass : process.env.GMAIL_PASS
            }
        })

        await mailSender.verify()
        console.log("smtp connection established ")
        

        const res = await mailSender.sendMail({
           
            from : process.env.GMAIL_USER,
            to : mailTo,
            subject : subject ,
            text : text ,
           
        })
        console.log("email send")
        return res
    } catch (e : any) {
        console.log("error in email service" , e.message)
        return 
    }
}