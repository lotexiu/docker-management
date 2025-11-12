import z from "zod";

export const personSchema = z.object({
	username: z
		.string()
		.min(3, "Username deve ter no mínimo 3 caracteres")
		.max(20, "Username deve ter no máximo 20 caracteres")
		.regex(
			/^[a-zA-Z0-9_]+$/,
			"Username deve conter apenas letras, números e underscore",
		),
	email: z.email("Email inválido").toLowerCase(),
	password: z
		.string()
		.min(6, "Senha deve ter no mínimo 6 caracteres")
		.max(100, "Senha deve ter no máximo 100 caracteres"),
});
