import {
  FastifyInstance,
  FastifyPluginOptions,
  FastifyRequest,
  FastifyReply,
} from "fastify";
import { RegisterUserController } from "../controllers/RegisterUserController";
import { LoginUser } from "../services/auth/LoginUser";
import { AddProductController } from "../controllers/products/AddProductController";
import prismaClient from "../prisma";
import { ParamsProps } from "../interfaces/ParamsIdProps";
import { DeleteProduct } from "../controllers/products/DeleteProduct";

export async function routers(
  fastify: FastifyInstance,
  options: FastifyPluginOptions
) {
  fastify.get("/", async (request: FastifyRequest<{Params:ParamsProps}>, reply: FastifyReply) => {
    const params = request.params
    const users = await prismaClient.products.findMany();

   return users
  });
  fastify.post(
    "/register",
    async (request: FastifyRequest, reply: FastifyReply) => {
      return new RegisterUserController().handle(request, reply);
    }
  );
  fastify.post(
    "/login",
    async (request: FastifyRequest, reply: FastifyReply) => {
      return new LoginUser().handle(request, reply);
    }
  );

  fastify.post(
    "/product/:id",
    async (
      request: FastifyRequest<{ Params: ParamsProps }>,
      reply: FastifyReply
    ) => {
      return new AddProductController().handle(request, reply);
    }
  );

  fastify.delete("/product/:id",async(request:FastifyRequest<{Params:ParamsProps}>,reply:FastifyReply)=>{

    return new DeleteProduct().handle(request,reply)

  })

  fastify.post("/authorization",async (request,reply)=>{
    return new LoginUser().getUser(request,reply)
  })
}
