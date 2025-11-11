"use client";

import * as React from "react";
import { ReactWrapper } from "@lotexiu/react/components/implementations";
import { ReactClientComponent } from "@lotexiu/react/components/ReactComponent/ReactClientComponent";
import { useForm } from "react-hook-form";
import {
  Form,
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Lock, Mail, User } from "lucide-react";
import { cn } from "@/lib/utils";
import { Property } from "@lotexiu/typescript/natives/object/proxy/types";

type SignUpFormValues = {
  username: string;
  email: string;
  password: string;
  confirmPassword: string;
};

type SignUpProps = {
  onSwitchToSignIn?: () => void;
};

export const SignUp = ReactWrapper(
  class SignUp extends ReactClientComponent<SignUpProps> {
    form: any;
    serverMessage: string | null = null;

    setupHooks(): void {
      this.form = useForm<SignUpFormValues>({
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
      
      // Simulando chamada externa
      await new Promise((r) => setTimeout(r, 500));

      // Validação simples
      if (values.password !== values.confirmPassword) {
        this.serverMessage = "As senhas não coincidem";
        this.updateView();
        return;
      }

      this.serverMessage = "Conta criada com sucesso! Faça login para continuar.";
      this.updateView();

      // Após 2 segundos, trocar para tela de login
      setTimeout(() => {
        if (this.props.onSwitchToSignIn) {
          this.props.onSwitchToSignIn();
        }
      }, 2000);
    }

    render(): React.ReactNode {
      const form = this.form;

      return (
        <div
          className={cn(
            "absolute w-full h-full",
            "content-center justify-items-center",
            "flex items-center justify-center"
          )}
        >
          <Card className="w-[40%] min-w-sm max-w-4xl">
            <CardHeader>
              <CardTitle>Sign Up</CardTitle>
              <CardDescription>Create a new account to get started.</CardDescription>
            </CardHeader>
            <CardContent>
              <Form {...form}>
                <form
                  onSubmit={form.handleSubmit(this.onSubmit)}
                  className="flex flex-col gap-4"
                >
                  <FormField
                    control={form.control}
                    name="username"
                    rules={{
                      required: "Nome de usuário obrigatório",
                      minLength: { value: 3, message: "Mínimo 3 caracteres" },
                      pattern: {
                        value: /^[a-zA-Z0-9_]+$/,
                        message: "Apenas letras, números e underscore",
                      },
                    }}
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Nome de usuário</FormLabel>
                        <FormControl>
                          <Input
                            id="username"
                            placeholder="seu_usuario"
                            value={field.value}
                            onChange={(e) => field.onChange(e)}
                          >
                            <User className="h-4 w-4 text-foreground" />
                          </Input>
                        </FormControl>
                        <FormMessage>{form.formState.errors.username?.message}</FormMessage>
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="email"
                    rules={{
                      required: "Email obrigatório",
                      pattern: {
                        value: /\S+@\S+\.\S+/,
                        message: "Email inválido",
                      },
                    }}
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Email</FormLabel>
                        <FormControl>
                          <Input
                            id="email"
                            type="email"
                            placeholder="user@gmail.com"
                            value={field.value}
                            onChange={(e) => field.onChange(e)}
                          >
                            <Mail className="h-4 w-4 text-foreground" />
                          </Input>
                        </FormControl>
                        <FormMessage>{form.formState.errors.email?.message}</FormMessage>
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="password"
                    rules={{
                      required: "Senha obrigatória",
                      minLength: { value: 6, message: "Mínimo 6 caracteres" },
                    }}
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Senha</FormLabel>
                        <FormControl>
                          <Input
                            id="password"
                            type="password"
                            placeholder="••••••••"
                            value={field.value}
                            onChange={(e) => field.onChange(e)}
                          >
                            <Lock className="h-4 w-4 text-foreground" />
                          </Input>
                        </FormControl>
                        <FormMessage>{form.formState.errors.password?.message}</FormMessage>
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="confirmPassword"
                    rules={{
                      required: "Confirmação de senha obrigatória",
                      validate: (value: string) => {
                        const password = form.getValues("password");
                        return value === password || "As senhas não coincidem";
                      },
                    }}
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Confirmar Senha</FormLabel>
                        <FormControl>
                          <Input
                            id="confirmPassword"
                            type="password"
                            placeholder="••••••••"
                            value={field.value}
                            onChange={(e) => field.onChange(e)}
                          >
                            <Lock className="h-4 w-4 text-foreground" />
                          </Input>
                        </FormControl>
                        <FormMessage>{form.formState.errors.confirmPassword?.message}</FormMessage>
                      </FormItem>
                    )}
                  />

                  <div className="flex justify-center">
                    <Button
                      type="submit"
                      onClick={() => {
                        form.trigger();
                      }}
                    >
                      Criar Conta
                    </Button>
                  </div>
                </form>
              </Form>
            </CardContent>
            <CardFooter className="flex flex-col space-y-2">
              {this.serverMessage && (
                <div className={cn(
                  "text-center text-sm mt-2",
                  this.serverMessage.includes("sucesso") ? "text-green-600" : "text-red-600"
                )}>
                  {this.serverMessage}
                </div>
              )}
              <div className="text-sm text-center text-muted-foreground">
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
            </CardFooter>
          </Card>
        </div>
      );
    }
  }
)