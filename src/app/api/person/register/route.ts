import { NextRequest, NextResponse } from 'next/server'
import { z } from 'zod'
import { Person } from '../types'
import { personSchema } from '../validation'

const admin: Person = {
	email: '!@gmail.com',
	password: '0',
	username: 'admin'
}

// Simula um banco de dados em memória
export const usersDatabase: Person[] = [
	admin
]

export async function POST(request: NextRequest) {
	try {
		const body = await request.json()

		// Valida os dados com Zod
		const validatedData = personSchema.parse(body)

		// Verifica se o usuário já existe
		const userExists = usersDatabase.find(
			user => user.username === validatedData.username || user.email === validatedData.email
		)

		if (userExists) {
			return NextResponse.json(
				{
					error: 'Usuário já existe',
					message: userExists.username === validatedData.username
						? 'Username já está em uso'
						: 'Email já está cadastrado'
				},
				{ status: 409 }
			)
		}

		// Cria o novo usuário
		const newUser: Person = {
			username: validatedData.username,
			email: validatedData.email,
			password: validatedData.password // Em produção, fazer hash da senha!
		}

		// Adiciona à "base de dados"
		usersDatabase.push(newUser)

		// Retorna sucesso (sem expor a senha)
		return NextResponse.json(
			{
				success: true,
				message: 'Usuário registrado com sucesso',
				user: {
					username: newUser.username,
					email: newUser.email
				}
			},
			{ status: 201 }
		)
	} catch (error) {
		// Trata erros de validação do Zod
		if (error instanceof z.ZodError) {
			return NextResponse.json(
				{
					error: 'Dados inválidos',
					details: error.issues.map(err => ({
						field: err.path.join('.'),
						message: err.message
					}))
				},
				{ status: 400 }
			)
		}

		// Outros erros
		console.error('Erro ao registrar usuário:', error)
		return NextResponse.json(
			{
				error: 'Erro interno do servidor',
				message: 'Não foi possível registrar o usuário'
			},
			{ status: 500 }
		)
	}
}

// Rota GET para listar usuários (apenas para debug/teste)
export async function GET() {
	return NextResponse.json({
		count: usersDatabase.length,
		users: usersDatabase.map(user => ({
			username: user.username,
			email: user.email
			// não retorna a senha
		}))
	})
}
