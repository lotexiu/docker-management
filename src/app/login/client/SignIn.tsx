"use client";

import * as React from "react";
import { /* useState */ } from "react";
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
import { Lock, Mail } from "lucide-react";
import { cn } from "@/lib/utils";
import { Property } from "@lotexiu/typescript/natives/object/proxy/types";

type SignInFormValues = {
  emailOrUsername: string;
  password: string;
};

type SignInProps = {
  onSwitchToSignUp?: () => void;
};

const fakeData = {
  emailOrUsername: "admin@example.com",
  password: "admin123",
};

export const SignIn = ReactWrapper(
  class SignIn extends ReactClientComponent<SignInProps> {
    form: any;
    serverMessage: string | null = null;

    onInit(): void {
      console.log("SignIn initialized");
    }

    setupHooks(): void {
      // useForm pode ser chamado aqui porque setupHooks é executado
      // dentro do contexto do wrapper funcional (hooks válidos)
      this.form = useForm<SignInFormValues>({
        defaultValues: fakeData,
        mode: "onBlur",
      });
    }

    async onSubmit(values: SignInFormValues) {
      this.serverMessage = null;
      // simulando chamada externa
      await new Promise((r) => setTimeout(r, 500));

      if (
        values.emailOrUsername === fakeData.emailOrUsername &&
        values.password === fakeData.password
      ) {
        this.serverMessage = "Login bem-sucedido";
      } else {
        this.serverMessage = "Credenciais inválidas";
      }

      // Notifica o wrapper para re-renderizar
      this.updateView();
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
              <CardTitle>Sign In</CardTitle>
              <CardDescription>Please sign in to continue.</CardDescription>
            </CardHeader>
            <CardContent>
              <Form {...form}>
                <form
                  onSubmit={form.handleSubmit(this.onSubmit)}
                  className="flex flex-col gap-4"
                >
                  <FormField
                    control={form.control}
                    name="emailOrUsername"
                    rules={{
                      required: "Campo obrigatório",
                      validate: (v: string) =>
                        v.includes("@")
                          ? /\S+@\S+\.\S+/.test(v) || "Email inválido"
                          : v.trim().length > 0 || "Usuário inválido",
                    }}
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Email ou usuário</FormLabel>
                        <FormControl>
                          <Input
                            id="email"
                            placeholder="user@gmail.com / username"
                            value={field.value}
                            onChange={(e) => field.onChange(e)}
                          >
                            <Mail className="h-4 w-4 text-foreground" />
                          </Input>
                        </FormControl>
                        <FormMessage>{form.formState.errors.emailOrUsername?.message}</FormMessage>
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

                  <div className="flex justify-center">
                    <Button
                      type="submit"
                      onClick={() => {
                        // dispara validação manual se necessário
                        form.trigger();
                      }}
                    >
                      Entrar
                    </Button>
                  </div>
                </form>
              </Form>
            </CardContent>
            <CardFooter className="flex flex-col space-y-2">
              {this.serverMessage && (
                <div className={cn(
                  "text-center text-sm mt-2",
                  this.serverMessage.includes("sucedido") ? "text-green-600" : "text-red-600"
                )}>
                  {this.serverMessage}
                </div>
              )}
              <div className="text-sm text-center">
                <p className="font-medium">Credenciais de teste:</p>
                <p>Email: admin@example.com</p>
                <p>Senha: admin123</p>
              </div>
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
            </CardFooter>
          </Card>
        </div>
      );
    }
  }
);

export default SignIn;
