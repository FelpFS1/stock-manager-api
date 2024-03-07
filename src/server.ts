import Fastify from "fastify";
import fastifyCors from "@fastify/cors";
import { routers } from "./routers/router";


const app = Fastify({logger:true})


const start = async () => {
    await app.register(fastifyCors);
    await app.register(routers);
    try {
        await app.listen(3333, '0.0.0.0'); // Alteração feita para ouvir em todos os IPs disponíveis
        console.log(`Server listening at http://0.0.0.0:3333`);
    } catch (err) {
        console.error(err);
        process.exit(1);
    }
};

start();