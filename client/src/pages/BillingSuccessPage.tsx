import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { CheckCircle, Crown } from "lucide-react";
import { useEffect } from "react";
import { queryClient } from "@/lib/queryClient";

export default function BillingSuccessPage() {
  useEffect(() => {
    queryClient.invalidateQueries({ queryKey: ['/api/billing/status'] });
    queryClient.invalidateQueries({ queryKey: ['/api/user'] });
  }, []);

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <Card className="max-w-md w-full">
        <CardHeader className="text-center">
          <div className="flex justify-center mb-4">
            <div className="w-16 h-16 bg-green-100 dark:bg-green-900 rounded-full flex items-center justify-center">
              <CheckCircle className="w-10 h-10 text-green-600 dark:text-green-400" />
            </div>
          </div>
          <CardTitle className="text-2xl">Welcome to Pro!</CardTitle>
        </CardHeader>
        <CardContent className="text-center space-y-4">
          <div className="flex items-center justify-center gap-2">
            <Crown className="w-5 h-5 text-yellow-500" />
            <span className="font-medium">Your subscription is now active</span>
          </div>
          <p className="text-muted-foreground">
            You now have access to all Pro features. Thank you for your support!
          </p>
          <Button 
            onClick={() => window.location.href = '/'}
            className="w-full"
            data-testid="button-go-home"
          >
            Go to Dashboard
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
