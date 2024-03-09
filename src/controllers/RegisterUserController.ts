import { FastifyReply, FastifyRequest } from "fastify";
import { RegisterUser } from "../services/auth/RegisterUser"; 
import bcrypt from "bcrypt";
import prismaClient from "../prisma";
import { LoginUser } from "../services/auth/LoginUser";
export class RegisterUserController {
  async handle(request: FastifyRequest, reply: FastifyReply) {
    const { name, email, password } = request.body as {
      name: string;
      email: string;
      password: string;
    };
    const userService = new RegisterUser();
    const existUser = await prismaClient.user.findFirst({
      where: {
        OR: [{ email }, { password }],
      },
    });
    if (existUser) {
      return reply.code(409).send("Usuário já cadastrado.");
    }
    const passwordHash = await bcrypt.hash(password, 10);
    const user = await userService.execute({ name, email, passwordHash });
    reply.send(user);
  }
}
