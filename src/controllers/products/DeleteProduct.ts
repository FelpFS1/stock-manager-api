import { FastifyReply, FastifyRequest } from "fastify";
import prismaClient from "../../prisma";
import { ParamsProps } from "../../interfaces/ParamsIdProps";
export class DeleteProduct{
    async handle(request:FastifyRequest<{Params:ParamsProps}>, reply:FastifyReply){
        const paramsId = request.params.id
        const product = await prismaClient.products.findMany({where:{
            id:paramsId
        }})
        console.log(product);
        
        if(product.length < 1){
            return reply.code(500).send({message:'Product not found!'})
        }

        await prismaClient.products.delete({where:{id:paramsId}})
        reply.send("Product deletado!")
    }
}