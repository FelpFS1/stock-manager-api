import Fastify from "fastify";
import fastifyCors from "@fastify/cors";
import { routers } from "./routers/router";


const app = Fastify({logger:true})


const start = async () => {
    await app.register(fastifyCors)
    await app.register(routers)
    try {
        await app.listen({port:3333})
    } catch (err) {
        process.exit(1)
    }
}
start()