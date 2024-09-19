import { z } from "zod";
import { USER_ROLE, USER_STATUS } from "./user.constant";

const createAdminValidations = z.object({
    name: z.string(),
    role: z.nativeEnum(USER_ROLE).optional(),
    email: z.string().email(),
    phone: z.number().max(11).optional(),
    password: z.string(),
    status: z.nativeEnum(USER_STATUS).default(USER_STATUS.ACTIVE),
  });
const updateUserValidations = z.object({
  body: z.object({
    name: z.string().optional(),
    role: z.nativeEnum(USER_ROLE).optional(),
    status: z.nativeEnum(USER_STATUS).optional(),
  }),
});

export const UserValidations = {
  createAdminValidations,
  updateUserValidations,
};