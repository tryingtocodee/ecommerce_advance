import ampqlib from "amqplib/callback_api"
import { emailService } from "../config/nodemailer";

const emailVerification = 'verify-email'

async function sentToQueue(queueName: string, data: any) {
    try {
        ampqlib.connect("amqp://localhost", (err0, connection) => {
            if (err0) {
                console.log("error0")
                throw err0;
            }


            connection.createChannel((err1, channel) => {
                if (err1) {
                    console.log("error1")
                    throw err1;
                }

                channel.assertQueue(queueName)

                let messageContent
                if (typeof data == 'object') {
                    messageContent = JSON.stringify(data)
                } else {
                    messageContent = data
                }

                channel.sendToQueue(queueName, Buffer.from(messageContent))
                console.log("data send ", messageContent)
            })
        })
    } catch (e: any) {
        console.log("error in sendQueue", e.message)
        return
    }
}

export async function recieveQueue() {
    try {
        ampqlib.connect("amqp://localhost", (err, connection) => {
            if (err) throw err;

            connection.createChannel((err1, channel) => {
                if (err1) throw err1;

                const queue = emailVerification

                channel.assertQueue(queue, {
                    durable: true
                })

                channel.consume(queue, function (msg) {
                    if (msg != null) {
                        try {
                            const data = JSON.parse(msg.content.toString())

                            processQueue(queue, data)

                            channel.ack(msg)
                            console.log("recieved data " , msg , data)
                        } catch (e: any) {
                            console.log("error in consume queue", e.messasge)
                            return
                        }
                    }
                })

            })
        })
    } catch (e: any) {
        console.log("error in recieve queue", e.messge)
        return

    }
}

async function processQueue(queueName: string, data: any) {
    switch (queueName) {
        case 'verify-email':
            await emailService(
                data.email,
                'Verify email',
                generateVerifyEmail(data)
            )
    }
}


export function sendingEmalVerification(data: any) {
    return sentToQueue(emailVerification, data)
}

function generateVerifyEmail(data: any) {
    return `
    Hello ${data.username}

    Please verify the email by clicking on the link 
    Link : http://localhost:4000/verify-email/${data.emailToken}
    `
}