import prismaClient from "../../prisma";
interface RegisterUserProps {
  name: string;
  passwordHash: string;
  email: string;
}
class RegisterUser {
  async execute({ name, email, passwordHash }: RegisterUserProps) {
    const user = await prismaClient.user.create({
      data: {
        name,
        email,
        password: passwordHash,
      },
    });
    
    return {
      id:user.id,
      name:user.name,
      email:user.email,
      createdAt:user.createdAt,
      updatedAt:user.updatedAt
    }
  }
}

export { RegisterUser };
