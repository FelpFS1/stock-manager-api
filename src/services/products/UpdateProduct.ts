import { FastifyReply, FastifyRequest } from "fastify";
import prismaClient from "../../prisma";
import { ParamsProps } from "../../interfaces/ParamsIdProps";
import { ProductProps } from "../../interfaces/ProductProps";

interface ParamasIdProps{
    productId :string,
    userId:string
}
export class UpdateProduct{
    async handle(request:FastifyRequest<{Params:ParamasIdProps}>, reply:FastifyReply){
        const {productId, userId}= request.params
        console.log(productId);
        
        const { name, quantity, price, category, description,updatedAt } =
      request.body as ProductProps;
        const product = await prismaClient.products.findFirst({where:{
            id:productId,
            userId:userId
        }})
        
        
        if(!product){
            return reply.code(500).send({message:'Product not found!'})
        }

        const productUpdate = await prismaClient.products.update({
            where:{
                id:productId
            },
            data: {
                name,
                quantity,
                price,
                category,
                description,
                updatedAt,
                user: {
                  connect: {
                    id: userId,
                  },
                },
              },
        })
        return {message:'Sucess',product:productUpdate}
    }
}