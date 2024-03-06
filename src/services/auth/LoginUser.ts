import fastify, { FastifyReply, FastifyRequest } from "fastify";
import bcrypt from "bcrypt";
import prismaClient from "../../prisma";
import jwt  from "jsonwebtoken";

export class LoginUser {
  async handle(request: FastifyRequest, reply: FastifyReply) {
    const { email, password } = request.body as {
      email: string;
      password: string;
    };
    const user = await prismaClient.user.findFirst({where:{email}})

    if(!user)
    return reply.code(401).send("Email não existe no banco de dados!")

    const matchPassword = await bcrypt.compare(password,user.password)
    console.log(matchPassword)

    if(!matchPassword){
      return reply.code(401).send("Senha invalida!")
    }
    const token = jwt.sign({userId:user.id},process.env.JWT_SECRET as string,{expiresIn:'7d'})
    
    return {
      token,
      id:user.id,
      name:user.name,
      email:user.email,
      createdAt:user.createdAt,
      updatedAt:user.updatedAt}
    
  }

  async getUser(request:FastifyRequest,reply:FastifyReply){
    const tokenHeader = request.headers['authorization']
  

    const token = tokenHeader && tokenHeader.split(' ')[1]
    
    
    if (!token) {
        reply.code(401).send({ message: 'Token JWT não fornecido' });
        return;
    }

    try {
        const decoded= jwt.verify(token, process.env.JWT_SECRET as string) as {userId:string};
        console.log(token);
        const userLogged = prismaClient.user.findMany({where:{id:decoded.userId}})
        return userLogged
    } catch (error) {
        console.error('Erro ao verificar token JWT:', error);
        reply.code(403).send("Token JWT inválido"); // Código de status 403 para token inválido
    }

}
}
