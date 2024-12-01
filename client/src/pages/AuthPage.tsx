import { useState } from "react";
import { useUser } from "../hooks/use-user";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import type { InsertUser } from "@db/schema";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { insertUserSchema } from "@db/schema";

export default function AuthPage() {
  const [isLogin, setIsLogin] = useState(true);
  const { login, register } = useUser();
  const { toast } = useToast();

  const form = useForm<InsertUser>({
    resolver: zodResolver(insertUserSchema),
    defaultValues: {
      username: "",
      password: ""
    }
  });

  const onSubmit = async (data: InsertUser) => {
    try {
      const result = await (isLogin ? login(data) : register(data));
      if (!result.ok) {
        throw new Error(result.message);
      }
      toast({
        title: "Success",
        description: isLogin ? "Welcome back!" : "Account created successfully!",
      });
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    }
  };

  return (
    <div 
      className="min-h-screen flex items-center justify-center bg-cover bg-center"
      style={{ backgroundImage: 'url(https://images.unsplash.com/photo-1478737270239-2f02b77fc618)' }}
    >
      <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" />
      
      <Card className="w-full max-w-md relative z-10">
        <CardHeader>
          <CardTitle>{isLogin ? "Welcome Back" : "Create Account"}</CardTitle>
          <CardDescription>
            {isLogin 
              ? "Sign in to continue to your account"
              : "Sign up to start discovering podcasts"
            }
          </CardDescription>
        </CardHeader>
        
        <CardContent>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <div className="space-y-2">
              <Input
                placeholder="Username"
                {...form.register("username")}
              />
              {form.formState.errors.username && (
                <p className="text-sm text-destructive">
                  {form.formState.errors.username.message}
                </p>
              )}
            </div>
            
            <div className="space-y-2">
              <Input
                type="password"
                placeholder="Password"
                {...form.register("password")}
              />
              {form.formState.errors.password && (
                <p className="text-sm text-destructive">
                  {form.formState.errors.password.message}
                </p>
              )}
            </div>

            <Button 
              type="submit" 
              className="w-full"
              disabled={form.formState.isSubmitting}
            >
              {isLogin ? "Sign In" : "Sign Up"}
            </Button>
          </form>

          <div className="mt-4 text-center">
            <Button
              variant="link"
              onClick={() => setIsLogin(!isLogin)}
            >
              {isLogin 
                ? "Need an account? Sign up" 
                : "Already have an account? Sign in"
              }
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
