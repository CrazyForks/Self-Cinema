'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { ThemeToggle } from '@/components/theme-toggle';
import { DotPattern } from '@/components/dot-pattern';
import { apiClient } from '@/lib/api';
import { setToken } from '@/lib/auth';
import { Lock, User } from 'lucide-react';

const loginSchema = z.object({
  username: z.string().min(1, '用户名不能为空'),
  password: z.string().min(1, '密码不能为空'),
});

type LoginForm = z.infer<typeof loginSchema>;

export default function LoginPage() {
  const router = useRouter();
  const [error, setError] = useState<string>('');
  const [isLoading, setIsLoading] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginForm>({
    resolver: zodResolver(loginSchema),
  });

  const onSubmit = async (data: LoginForm) => {
    setIsLoading(true);
    setError('');

    try {
      const response = await apiClient.login(data);
      setToken(response.access_token);
      router.push('/admin/dashboard');
    } catch (error) {
      console.error('Login error:', error);
      setError('登录失败，请检查用户名和密码');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen relative overflow-hidden flex items-center justify-center p-4">
      <DotPattern />
      
      <div className="absolute top-4 right-4 z-100">
        <ThemeToggle />
      </div>
      
      <Card className="w-full max-w-md relative z-10 backdrop-blur-sm bg-background/80 border-2 hover:border-primary/50 transition-all duration-500 animate-in slide-in-from-bottom duration-1000">
        <CardHeader className="text-center relative">
          <div className="absolute -top-4 left-1/2 transform -translate-x-1/2 w-8 h-8 bg-primary rounded-full flex items-center justify-center">
            <Lock className="h-4 w-4 text-primary-foreground" />
          </div>
          <CardTitle className="text-2xl mt-4 bg-gradient-to-r from-primary to-blue-600 bg-clip-text text-transparent">
            管理员登录
          </CardTitle>
          <CardDescription>
            请输入管理员账号和密码
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="username" className="flex items-center gap-2">
                <User className="h-4 w-4" />
                用户名
              </Label>
              <Input
                id="username"
                {...register('username')}
                placeholder="请输入用户名"
                className="transition-all duration-300 focus:ring-2 focus:ring-primary/20"
              />
              {errors.username && (
                <p className="text-sm text-destructive animate-in slide-in-from-left duration-300">
                  {errors.username.message}
                </p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="password" className="flex items-center gap-2">
                <Lock className="h-4 w-4" />
                密码
              </Label>
              <Input
                id="password"
                type="password"
                {...register('password')}
                placeholder="请输入密码"
                className="transition-all duration-300 focus:ring-2 focus:ring-primary/20"
              />
              {errors.password && (
                <p className="text-sm text-destructive animate-in slide-in-from-left duration-300">
                  {errors.password.message}
                </p>
              )}
            </div>

            {error && (
              <Alert variant="destructive" className="animate-in slide-in-from-top duration-300">
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}

            <Button 
              type="submit" 
              className="w-full transition-all duration-300 hover:shadow-lg hover:scale-105" 
              disabled={isLoading}
            >
              {isLoading ? (
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin" />
                  登录中...
                </div>
              ) : (
                '登录'
              )}
            </Button>
          </form>
          
          <div className="mt-6 text-center">
            <p className="text-xs text-muted-foreground">
              默认账号: admin / admin123
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}