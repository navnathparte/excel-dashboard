import { AppDataSource } from "../config/database";
import { User, UserRole } from "../entities/User";
import { hashPassword, comparePassword } from "../utils/password";
import { generateToken } from "../utils/jwt";

const userRepository = AppDataSource.getRepository(User);

export class AuthService {
  async register(data: {
    fullName: string;
    email: string;
    password: string;
    role?: UserRole;
  }) {
    const exists = await userRepository.findOne({
      where: { email: data.email },
    });

    if (exists) {
      throw new Error("Email already exists");
    }

    const user = userRepository.create({
      fullName: data.fullName,
      email: data.email,
      password: await hashPassword(data.password),
      role: data.role || UserRole.USER,
    });

    await userRepository.save(user);

    return user;
  }

  async login(email: string, password: string) {
    const user = await userRepository.findOne({
      where: { email },
    });

    if (!user) {
      throw new Error("Invalid credentials");
    }

    const valid = await comparePassword(password, user.password);

    if (!valid) {
      throw new Error("Invalid credentials");
    }

    const token = generateToken(user);

    return {
      token,
      user,
    };
  }
}
