import { getRequestClientInfo } from "@/lib/auth/implementations";
import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { usersDatabase } from "../../person/register/route";
import { loginSchema } from "./validation";

export async function POST(request: NextRequest) {
	try {
		const clientInfo = getRequestClientInfo(request);
		const body = await request.json();

		// Valida os dados com Zod
		const validatedData = loginSchema.parse(body);

		// Busca o usuário pelo username ou email
		const user = usersDatabase.find(
			(u) =>
				u.username === validatedData.username ||
				u.email === validatedData.username,
		);

		// Verifica se o usuário existe e se a senha está correta
		if (!user || user.password !== validatedData.password) {
			// Log de tentativa de login falha (útil para segurança)
			console.log(
				`Tentativa de login falha - IP: ${clientInfo.ip}, User: ${validatedData.username}`,
			);

			return NextResponse.json(
				{
					error: "Credenciais inválidas",
					message: "Username/email ou senha incorretos",
				},
				{ status: 401 },
			);
		}

		// Login bem-sucedido
		console.log(
			`Login bem-sucedido - User: ${user.username}, IP: ${clientInfo.ip}`,
		);

		// Em produção, criar JWT token ou sessão aqui
		return NextResponse.json(
			{
				success: true,
				message: "Login realizado com sucesso",
				user: {
					username: user.username,
					email: user.email,
				},
				// Informações do cliente (opcional, para debug)
				clientInfo: {
					ip: clientInfo.ip,
					userAgent: clientInfo.userAgent.ua,
				},
			},
			{ status: 200 },
		);
	} catch (error) {
		// Trata erros de validação do Zod
		if (error instanceof z.ZodError) {
			return NextResponse.json(
				{
					error: "Dados inválidos",
					details: error.issues.map((err) => ({
						field: err.path.join("."),
						message: err.message,
					})),
				},
				{ status: 400 },
			);
		}

		// Outros erros
		console.error("Erro ao fazer login:", error);
		return NextResponse.json(
			{
				error: "Erro interno do servidor",
				message: "Não foi possível processar o login",
			},
			{ status: 500 },
		);
	}
}
