"use client";

import * as React from "react";
import { ReactWrapper } from "../../../../../../packages/react/dist/components/implementations";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Lock, Mail, User } from "lucide-react";
import { AuthFormBase, FormFieldConfig } from "./AuthFormBase";

// Schema de validação com Zod
const signUpSchema = z
	.object({
		username: z
			.string()
			.min(3, "Username deve ter no mínimo 3 caracteres")
			.max(20, "Username deve ter no máximo 20 caracteres")
			.regex(/^[a-zA-Z0-9_]+$/, "Apenas letras, números e underscore"),
		email: z.string().email("Email inválido").toLowerCase(),
		password: z
			.string()
			.min(6, "Senha deve ter no mínimo 6 caracteres")
			.max(100, "Senha deve ter no máximo 100 caracteres"),
		confirmPassword: z.string().min(1, "Confirmação de senha obrigatória"),
	})
	.refine((data) => data.password === data.confirmPassword, {
		message: "As senhas não coincidem",
		path: ["confirmPassword"],
	});

type SignUpFormValues = z.infer<typeof signUpSchema>;

type SignUpProps = {
	onSwitchToSignIn?: () => void;
};

export const SignUp = ReactWrapper(
	class SignUp extends ReactWrapper.Client<SignUpProps> {
		form: any;
		serverMessage: string | null = null;

		setupHooks(): void {
			this.form = useForm<SignUpFormValues>({
				resolver: zodResolver(signUpSchema),
				defaultValues: {
					username: "",
					email: "",
					password: "",
					confirmPassword: "",
				},
				mode: "onBlur",
			});
		}

		async onSubmit(values: SignUpFormValues) {
			this.serverMessage = null;

			try {
				const response = await fetch("/api/person/register", {
					method: "POST",
					headers: {
						"Content-Type": "application/json",
					},
					body: JSON.stringify({
						username: values.username,
						email: values.email,
						password: values.password,
					}),
				});

				const data = await response.json();

				if (response.ok) {
					this.serverMessage =
						data.message ||
						"Conta criada com sucesso! Faça login para continuar.";
					this.updateView();

					// Após 2 segundos, trocar para tela de login
					setTimeout(() => {
						if (this.props.onSwitchToSignIn) {
							this.props.onSwitchToSignIn();
						}
					}, 2000);
				} else {
					this.serverMessage = data.message || "Erro ao criar conta";
					this.updateView();
				}
			} catch (error) {
				this.serverMessage = "Erro ao conectar com o servidor";
				console.error("Erro no registro:", error);
				this.updateView();
			}
		}

		render(): React.ReactNode {
			const fields: FormFieldConfig[] = [
				{
					name: "username",
					label: "Nome de usuário",
					placeholder: "seu_usuario",
					type: "text",
					icon: User,
				},
				{
					name: "email",
					label: "Email",
					placeholder: "user@gmail.com",
					type: "email",
					icon: Mail,
				},
				{
					name: "password",
					label: "Senha",
					placeholder: "••••••••",
					type: "password",
					icon: Lock,
				},
				{
					name: "confirmPassword",
					label: "Confirmar Senha",
					placeholder: "••••••••",
					type: "password",
					icon: Lock,
				},
			];

			return (
				<AuthFormBase
					title="Sign Up"
					description="Create a new account to get started."
					fields={fields}
					form={this.form}
					onSubmit={this.onSubmit}
					submitButtonText="Criar Conta"
					serverMessage={this.serverMessage}
					footerContent={
						<div className="text-sm text-center">
							Já tem uma conta?{" "}
							<button
								type="button"
								className="text-primary hover:underline font-medium"
								onClick={() => {
									if (this.props.onSwitchToSignIn) {
										this.props.onSwitchToSignIn();
									}
								}}
							>
								Faça login aqui
							</button>
						</div>
					}
				/>
			);
		}
	},
);
