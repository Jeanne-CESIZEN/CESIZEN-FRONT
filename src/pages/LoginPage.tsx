import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { ShieldAlert, LogIn, Eye, EyeOff } from "lucide-react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { login } from "../api/auth";
import { useAuth } from "../hooks/useAuth";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";

const loginSchema = z.object({
  email: z.email("Email invalide"),
  password: z.string().min(1, "Mot de passe requis"),
});

type LoginFormData = z.infer<typeof loginSchema>;

type ErrorType = "credentials" | "forbidden" | "network" | null;

export default function LoginPage() {
  const navigate = useNavigate();
  const { setAuth } = useAuth();
  const [showPassword, setShowPassword] = useState(false);
  const [errorType, setErrorType] = useState<ErrorType>(null);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
  });

  async function onSubmit(data: LoginFormData) {
    setErrorType(null);

    try {
      const { token, refreshToken, user } = await login(data.email, data.password);

      if (user.role !== "ADMIN") {
        setErrorType("forbidden");
        return;
      }

      setAuth(token, refreshToken, user);
      navigate("/");
    } catch (err: unknown) {
      const status = (err as { response?: { status?: number } })?.response
        ?.status;
      if (status === 401 || status === 400) {
        setErrorType("credentials");
      } else if (status === 403) {
        setErrorType("forbidden");
      } else {
        setErrorType("network");
      }
    }
  }

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      {/* Background decoration */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-96 h-96 rounded-full bg-primary/10 blur-3xl" />
        <div className="absolute -bottom-40 -left-40 w-96 h-96 rounded-full bg-secondary/10 blur-3xl" />
      </div>

      <div className="relative w-full max-w-md">
        {/* Card */}
        <div className="bg-white rounded-3xl shadow-xl shadow-primary/10 p-8">
          {/* Logo */}
          <div className="flex justify-center mb-8">
            <img src="/logo-hor.png" alt="Cesi Zen" className="h-10 w-auto" />
          </div>

          <div className="mb-6">
            <h1 className="text-xl font-bold text-gray-800">
              Espace administrateur
            </h1>
            <p className="text-sm text-gray-500 mt-1">
              Connectez-vous pour accéder au tableau de bord
            </p>
          </div>

          {/* Error messages */}
          {errorType === "credentials" && (
            <div className="mb-5 flex items-start gap-3 bg-red-50 border border-red-100 text-red-700 rounded-xl px-4 py-3 text-sm">
              <ShieldAlert size={18} className="mt-0.5 shrink-0" />
              <span>
                Identifiants incorrects. Vérifiez votre email et mot de passe.
              </span>
            </div>
          )}

          {errorType === "forbidden" && (
            <div className="mb-5 flex items-start gap-3 bg-purple-50 border border-primary/20 text-secondary rounded-xl px-4 py-3 text-sm">
              <ShieldAlert size={18} className="mt-0.5 shrink-0 text-primary" />
              <div>
                <p className="font-medium text-primary">Accès refusé</p>
                <p className="mt-0.5 text-gray-600">
                  Cet espace est réservé aux administrateurs. Votre compte ne
                  dispose pas des droits nécessaires.
                </p>
              </div>
            </div>
          )}

          {errorType === "network" && (
            <div className="mb-5 flex items-start gap-3 bg-red-50 border border-red-100 text-red-700 rounded-xl px-4 py-3 text-sm">
              <ShieldAlert size={18} className="mt-0.5 shrink-0" />
              <span>Une erreur est survenue. Veuillez réessayer.</span>
            </div>
          )}

          {/* Form */}
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <div className="space-y-1.5">
              <Label htmlFor="email">Adresse email</Label>
              <Input
                id="email"
                type="email"
                autoComplete="email"
                placeholder="admin@example.com"
                aria-invalid={!!errors.email}
                {...register("email")}
              />
              {errors.email && (
                <p className="text-xs text-destructive">
                  {errors.email.message}
                </p>
              )}
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="password">Mot de passe</Label>
              <div className="relative">
                <Input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  autoComplete="current-password"
                  placeholder="••••••••"
                  aria-invalid={!!errors.password}
                  className="pr-10"
                  {...register("password")}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword((v) => !v)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                >
                  {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
              {errors.password && (
                <p className="text-xs text-destructive">
                  {errors.password.message}
                </p>
              )}
            </div>

            <Button
              type="submit"
              disabled={isSubmitting}
              size="lg"
              className="w-full mt-2"
            >
              {isSubmitting ? (
                <span className="h-4 w-4 rounded-full border-2 border-white/30 border-t-white animate-spin" />
              ) : (
                <LogIn size={16} />
              )}
              {isSubmitting ? "Connexion…" : "Se connecter"}
            </Button>
          </form>
        </div>
      </div>
    </div>
  );
}
