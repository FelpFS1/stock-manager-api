import { FastifyReply, FastifyRequest } from "fastify";
import prismaClient from "../../prisma";
import { ParamsProps } from "../../interfaces/ParamsIdProps";
interface ProductProps {
  name: string;
  quantity: number;
  price: number;
  category: string;
  description: string;
}


export class AddProductController {
  async handle(
    request: FastifyRequest<{ Params: ParamsProps }>,
    reply: FastifyReply
  ) {
    const { name, quantity, price, category, description } =
      request.body as ProductProps;

    const user = await prismaClient.user.findUnique({
      where: { id: request.params.id },
    });

    if (!user) {
      reply.code(401).send("Usuario não encontrado!");
    }

    const product = await prismaClient.products.create({
      data: {
        name,
        quantity,
        price,
        category,
        description,
        user: {
          connect: {
            id: request.params.id,
          },
        },
      },
    });
    return product;
  }
}
