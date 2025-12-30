import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useAuth } from "@/hooks/use-auth";
import { Redirect } from "wouter";
import { Brain, Shield, Zap } from "lucide-react";

export default function AuthPage() {
  const { user } = useAuth();

  if (user) {
    return <Redirect to="/" />;
  }

  return (
    <div className="min-h-screen grid lg:grid-cols-2">
      <div className="flex items-center justify-center p-8">
        <Card className="w-full max-w-md">
          <CardHeader className="text-center">
            <CardTitle className="text-2xl">Welcome to TEXT MD</CardTitle>
            <CardDescription>
              Sign in with your Google account to access your intelligent text analysis tools
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <Button
              type="button"
              variant="outline"
              className="w-full h-12 text-base"
              onClick={() => window.location.href = '/auth/google'}
              data-testid="button-google-login"
            >
              <svg className="mr-3 h-5 w-5" viewBox="0 0 24 24">
                <path
                  d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                  fill="#4285F4"
                />
                <path
                  d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                  fill="#34A853"
                />
                <path
                  d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                  fill="#FBBC05"
                />
                <path
                  d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                  fill="#EA4335"
                />
              </svg>
              Sign in with Google
            </Button>
          </CardContent>
        </Card>
      </div>

      <div className="hidden lg:flex items-center justify-center p-8 bg-gradient-to-br from-blue-50 to-purple-50 dark:from-blue-900/20 dark:to-purple-900/20">
        <div className="max-w-md text-center space-y-6">
          <div className="space-y-4">
            <h1 className="text-4xl font-bold text-gray-900 dark:text-gray-100">
              TEXT MD
            </h1>
            <p className="text-lg text-gray-600 dark:text-gray-300">
              Advanced AI-powered text analysis for intelligence assessment, writing enhancement, and cognitive fingerprinting
            </p>
          </div>
          
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <Brain className="h-6 w-6 text-blue-600" />
              <span className="text-gray-700 dark:text-gray-300">Intelligence Analysis & Scoring</span>
            </div>
            <div className="flex items-center gap-3">
              <Zap className="h-6 w-6 text-purple-600" />
              <span className="text-gray-700 dark:text-gray-300">AI Detection & Humanization</span>
            </div>
            <div className="flex items-center gap-3">
              <Shield className="h-6 w-6 text-green-600" />
              <span className="text-gray-700 dark:text-gray-300">Document Security & Analysis</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
