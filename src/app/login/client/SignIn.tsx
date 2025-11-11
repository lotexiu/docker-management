"use client";

import * as React from "react";
import { ReactWrapper } from "@lotexiu/react/components/implementations";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Lock, Mail } from "lucide-react";
import { AuthFormBase, FormFieldConfig } from "./AuthFormBase";

// Schema de validação com Zod
const signInSchema = z.object({
  username: z.string().min(1, "Obrigatório informar usuário ou email"),
  password: z.string().min(1, "Senha obrigatória"),
});

type SignInFormValues = z.infer<typeof signInSchema>;

type SignInProps = {
  onSwitchToSignUp?: () => void;
};

export const SignIn = ReactWrapper(
  class SignIn extends ReactWrapper.ClientComponent<SignInProps> {
    form: any;
    serverMessage: string | null = null;

    onInit(): void {
      console.log("SignIn initialized");
    }

    setupHooks(): void {
      this.form = useForm<SignInFormValues>({
        resolver: zodResolver(signInSchema),
        defaultValues: {
					username: "!@gmail.com",
					password: "0",
				},
        mode: "onBlur",
      });
    }

    async onSubmit(values: SignInFormValues) {
      this.serverMessage = null;

      try {
        const response = await fetch("/api/auth/login", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(values),
        });

        const data = await response.json();

        if (response.ok) {
          this.serverMessage = data.message || "Login bem-sucedido";
        } else {
          this.serverMessage = data.message || "Credenciais inválidas";
        }
      } catch (error) {
        this.serverMessage = "Erro ao conectar com o servidor";
        console.error("Erro no login:", error);
      }

      this.updateView();
    }

    render(): React.ReactNode {
      const fields: FormFieldConfig[] = [
        {
          name: "username",
          label: "Email ou usuário",
          placeholder: "user@gmail.com / username",
          type: "text",
          icon: Mail,
        },
        {
          name: "password",
          label: "Senha",
          placeholder: "••••••••",
          type: "password",
          icon: Lock,
        },
      ];

      return (
        <AuthFormBase
          title="Sign In"
          description="Please sign in to continue."
          fields={fields}
          form={this.form}
          onSubmit={this.onSubmit}
          submitButtonText="Entrar"
          serverMessage={this.serverMessage}

          testCredentials={(
						<div className="text-sm text-center">
							<p className="font-medium">Credenciais de teste:</p>
							<p>Email: admin@example.com</p>
							<p>Senha: admin123</p>
						</div>
					)}

          footerContent={(
						<div className="text-sm text-center">
							Não tem uma conta?{" "}
							<button
								type="button"
								className="text-primary hover:underline font-medium"
								onClick={() => {
									if (this.props.onSwitchToSignUp) {
										this.props.onSwitchToSignUp();
									}
								}}
							>
								Cadastre-se aqui
							</button>
						</div>
					)}
        />
      );
    }
  }
);

export default SignIn;
