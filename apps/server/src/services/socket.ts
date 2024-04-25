import { Server } from "socket.io";
import Redis from 'ioredis'
import prisma from "./prisma";
import { produceMessage } from "./kafka";

const pub = new Redis({
  host: "",
  port: 0,
  username: "default",
  password: "",
});

const sub = new Redis({
  host: "",
  port: 0,
  username: "",
  password: "",
});

class SocketService{
    private _io:Server
    constructor(){
        console.log("init socket service")
        this._io=new Server({
            cors:{
                allowedHeaders:['*'],
                origin:'*'
    
            }
        })
        sub.subscribe('MESSAGES')

      
    }

    public initListeners(){
        const io=this.io;
        console.log("Init Socket Listeners...")
        
        io.on("connect",(socket)=>{
            console.log('New Socket Connected',socket.id)
            socket.on('event:message',async({message}:{message:string})=>{
                console.log("New Message Recieved",message)
                await pub.publish('MESSAGES',JSON.stringify({message}))
            })
        })
        sub.on("message",async(channel,message)=>{
            if(channel==="MESSAGES"){
                io.emit("message",message)
                // await prisma.message.create({
                //     data:{
                //         text:message
                //     }
                // })
                await produceMessage(message)
                console.log("Message Produced to Kafka Broker")
            }
        })
    }
    get io(){
        return this._io
    }
}

export default SocketService