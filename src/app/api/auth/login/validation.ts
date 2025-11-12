import z from "zod";

export const loginSchema = z.object({
	username: z.string().min(1, "Username ou email é obrigatório"),
	password: z.string().min(1, "Senha é obrigatória"),
});
