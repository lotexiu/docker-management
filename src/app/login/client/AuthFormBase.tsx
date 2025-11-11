"use client";

import * as React from "react";
import { ReactWrapper } from "@lotexiu/react/components/implementations";
import { UseFormReturn } from "react-hook-form";
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
import { cn } from "@/lib/utils";
import { LucideIcon } from "lucide-react";

export type FormFieldConfig = {
  name: string;
  label: string;
  placeholder: string;
  type?: "text" | "email" | "password";
  icon?: LucideIcon;
};

type AuthFormBaseProps = {
  title: string;
  description: string;
  fields: FormFieldConfig[];
  form: UseFormReturn<any>;
  onSubmit: (values: any) => void | Promise<void>;
  submitButtonText: string;
  serverMessage?: string | null;
  footerContent?: React.ReactNode;
  testCredentials?: React.ReactNode;
};

export const AuthFormBase = ReactWrapper(
  class AuthFormBase extends ReactWrapper.ClientComponent<AuthFormBaseProps> {
    render(): React.ReactNode {
      const {
        title,
        description,
        fields,
        form,
        onSubmit,
        submitButtonText,
        serverMessage,
        footerContent,
        testCredentials,
      } = this.props;

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
              <CardTitle>{title}</CardTitle>
              <CardDescription>{description}</CardDescription>
            </CardHeader>
            <CardContent>
              <Form {...form}>
                <form
                  onSubmit={form.handleSubmit(onSubmit)}
                  className="flex flex-col gap-4"
                >
                  {fields.map((field) => (
                    <FormField
                      key={field.name}
                      control={form.control}
                      name={field.name}
                      render={({ field: formField }) => {
                        const Icon = field.icon;
                        return (
                          <FormItem>
                            <FormLabel>{field.label}</FormLabel>
                            <FormControl>
                              <Input
                                id={field.name}
                                type={field.type || "text"}
                                placeholder={field.placeholder}
                                value={formField.value}
                                onChange={(e) => formField.onChange(e)}
                              >
                                {Icon && (
                                  <Icon className="h-4 w-4 text-foreground" />
                                )}
                              </Input>
                            </FormControl>
                            <FormMessage>
                              {form.formState.errors[field.name]?.message as string}
                            </FormMessage>
                          </FormItem>
                        );
                      }}
                    />
                  ))}

                  <div className="flex justify-center">
                    <Button
                      type="submit"
                      onClick={() => {
                        form.trigger();
                      }}
                    >
                      {submitButtonText}
                    </Button>
                  </div>
                </form>
              </Form>
            </CardContent>
            <CardFooter className="flex flex-col space-y-2">
              {serverMessage && (
                <div
                  className={cn(
                    "text-center text-sm mt-2",
                    serverMessage.includes("sucesso") || serverMessage.includes("sucedido")
                      ? "text-green-600"
                      : "text-red-600"
                  )}
                >
                  {serverMessage}
                </div>
              )}
              {testCredentials}
              {footerContent}
            </CardFooter>
          </Card>
        </div>
      );
    }
  }
);
