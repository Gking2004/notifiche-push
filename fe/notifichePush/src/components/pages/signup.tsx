import { Button } from "@/components/ui/button"
import {
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useForm } from "react-hook-form";
import * as z from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useState } from "react";
import { useAuth } from "../context/auth";
import { useNavigate } from "react-router-dom";
import CustomAlert from "../customAlert";

const signupSchema = z.object({
  username: z.string().min(1, "L'username è obbligatorio"),
  email: z.string().email("L'email non è valida"),
  password: z.string().min(6, "La password deve contenere almeno 6 caratteri"),
});

type SignupFormValues = z.infer<typeof signupSchema>;

const BASE_URL = import.meta.env.VITE_API_BASE_URL;

export function Signup() {
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const { login } = useAuth();

  const navigate = useNavigate();

  const {
    register,
    handleSubmit,
    formState: { errors, isValid },
  } = useForm<SignupFormValues>({
    resolver: zodResolver(signupSchema),
    mode: "onTouched",
    defaultValues: {
      username: "",
      email: "",
      password: "",
    },
  });

  const onSubmit = async (data: SignupFormValues) => {
    setError(null);
    setSuccess(null);
    try {
      const response = await fetch(`${BASE_URL}/auth/signup`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });
      const result = await response.json();
      if (!response.ok) {
        setError(result.message || "Errore del server");
        return;
      }
      console.log("Successo:", result);
      setSuccess("Registrazione effettuata con successo");
      login(result.username, result.token);
    } catch (err) {
      console.error(err);
      setError("Errore di connessione al server");
    }
  };

  return (
    <>
    <div className="top-0 left-1/2 -translate-x-1/2 absolute mt-5 animate-in slide-in-from-top fade-in duration-300">
            {error && (
                <CustomAlert message={error} type="error" onClose={() => setError(null)} />
            )}
        
            {success && (
                <CustomAlert message={success} type="success" onClose={() => setSuccess(null)} />
            )}
    </div>
    <Card className="w-full max-w-sm">
      <CardHeader>
        <CardTitle>Signup to your account</CardTitle>
        <CardDescription>
          Enter your email below to signup to your account
        </CardDescription>
        <CardAction>
          <Button variant="link" onClick={() => navigate("/")}>Login</Button>
        </CardAction>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit(onSubmit)}>
          <div className="flex flex-col gap-6">
            <div className="grid gap-2">
              <Label htmlFor="username">Username</Label>
              <Input
                id="username"
                type="text"
                placeholder="username"
                {...register("username")}
              />
              {errors.username && (
                <span className="text-xs text-red-500 font-medium">
                  {errors.username.message}
                </span>
              )}
            </div>
            <div className="grid gap-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                placeholder="email"
                {...register("email")}
              />
              {errors.email && (
                <span className="text-xs text-red-500 font-medium">
                  {errors.email.message}
                </span>
              )}
            </div>
            <div className="grid gap-2">
              <div className="flex items-center">
                <Label htmlFor="password">Password</Label>
                <a
                  href="#"
                  className="ml-auto inline-block text-sm underline-offset-4 hover:underline"
                >
                  Forgot your password?
                </a>
              </div>
              <Input
                id="password"
                type="password"
                {...register("password")}
              />
              {errors.password && (
                <span className="text-xs text-red-500 font-medium">
                  {errors.password.message}
                </span>
              )}
            </div>

            <CardFooter className="flex-col gap-2 p-0">
              <Button type="submit" className="w-full" disabled={!isValid}>
                Signup
              </Button>
              <Button variant="outline" className="w-full" type="button">
                Signup with Google
              </Button>
            </CardFooter>
          </div>
        </form>
      </CardContent>
    </Card>
    </>
  )
}
