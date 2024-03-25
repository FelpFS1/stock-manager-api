import fastify, { FastifyReply, FastifyRequest } from "fastify";
import bcrypt from "bcrypt";
import prismaClient from "../../prisma";
import jwt from "jsonwebtoken";

export class LoginUser {
  async handle(request: FastifyRequest, reply: FastifyReply) {
    const { email, password } = request.body as {
      email: string;
      password: string;
    };
    const user = await prismaClient.user.findFirst({ where: { email } });

    if (!user) return reply.send({ message: "Usuário não encontrado!" });

    const matchPassword = await bcrypt.compare(password, user.password);

    if (!matchPassword) {
      return reply.send({ message: "Senha invalida!" });
    }
    const token = jwt.sign(
      { userId: user.id },
      process.env.JWT_SECRET as string,
      { expiresIn: "60m" }
    );
    return { token };
  }

  async getUser(request: FastifyRequest, reply: FastifyReply) {
    const tokenHeader = request.headers["authorization"];
    const token = tokenHeader && tokenHeader.split(" ")[1];

    if (!token) {
      reply.code(401).send({ message: "Token JWT não fornecido" });
      return;
    }

    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET as string) as {
        userId: string;
      };
      const userLogged = await prismaClient.user.findMany({
        where: { id: decoded.userId },
        include: { Products: true },
      });
      return [
        {
          id: userLogged[0].id,
          email: userLogged[0].email,
          products: userLogged[0].Products,
          createdAt: userLogged[0].createdAt,
        },
      ];
    } catch (error) {
      return{ message: "Token inválido" }
      
    }
  }
}
