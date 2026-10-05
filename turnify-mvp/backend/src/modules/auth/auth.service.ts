import bcrypt from 'bcryptjs';
import { Role, type User } from '@prisma/client';
import { prisma } from '../../lib/prisma.js';
import { conflict, unauthorized } from '../../lib/errors.js';
import { signToken } from '../../middlewares/auth.js';
import type { LoginInput, RegisterInput } from './auth.schemas.js';

const toPublicUser = (u: User) => ({ id: u.id, name: u.name, email: u.email, phone: u.phone, role: u.role });
const session = (u: User) => ({ token: signToken(u), user: toPublicUser(u) });

export async function register(input: RegisterInput) {
  const exists = await prisma.user.findUnique({ where: { email: input.email } });
  if (exists) throw conflict('El email ya está registrado', 'EMAIL_TAKEN');

  // TODO (Sebas): crear usuario y perfil profesional en una sola transacción (prisma.$transaction).
  const user = await prisma.user.create({
    data: {
      name: input.name,
      email: input.email,
      phone: input.phone,
      passwordHash: await bcrypt.hash(input.password, 10),
      role: input.role === 'PROFESSIONAL' ? Role.PROFESSIONAL : Role.CLIENT,
    },
  });
  if (user.role === Role.PROFESSIONAL) {
    await prisma.professionalProfile.create({ data: { userId: user.id, businessName: input.name, category: 'Otro' } });
  }
  return session(user);
}

export async function login(input: LoginInput) {
  const user = await prisma.user.findUnique({ where: { email: input.email } });
  if (!user || !(await bcrypt.compare(input.password, user.passwordHash))) throw unauthorized('Credenciales incorrectas', 'INVALID_CREDENTIALS');
  return session(user);
}
