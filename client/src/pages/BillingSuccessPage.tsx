import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { CheckCircle, Crown, FileText, Loader2 } from "lucide-react";
import { useEffect, useState } from "react";
import { queryClient } from "@/lib/queryClient";

export default function BillingSuccessPage() {
  const [restoredOutput, setRestoredOutput] = useState<{
    content: string;
    outputType: string;
    isTruncated: boolean;
  } | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    queryClient.invalidateQueries({ queryKey: ['/api/billing/status'] });
    queryClient.invalidateQueries({ queryKey: ['/api/user'] });
    
    // Refetch the last output after upgrade
    const fetchLastOutput = async () => {
      try {
        // Try localStorage first
        const lastOutputId = localStorage.getItem('last_output_id');
        
        if (lastOutputId) {
          const response = await fetch(`/api/output/${lastOutputId}`, {
            credentials: 'include'
          });
          if (response.ok) {
            const data = await response.json();
            setRestoredOutput({
              content: data.content,
              outputType: data.outputType,
              isTruncated: data.isTruncated
            });
            setIsLoading(false);
            return;
          }
        }
        
        // Fallback: fetch latest output
        const latestResponse = await fetch('/api/output/latest', {
          credentials: 'include'
        });
        if (latestResponse.ok) {
          const data = await latestResponse.json();
          setRestoredOutput({
            content: data.content,
            outputType: data.outputType,
            isTruncated: data.isTruncated
          });
        }
      } catch (error) {
        console.error('Failed to fetch output:', error);
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchLastOutput();
  }, []);

  const handleGoHome = () => {
    // Preserve output state in sessionStorage for HomePage to pick up
    if (restoredOutput) {
      sessionStorage.setItem('restored_output', JSON.stringify(restoredOutput));
    }
    window.location.href = '/';
  };

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
            You now have access to all Pro features including full, untruncated outputs.
          </p>
          
          {isLoading ? (
            <div className="flex items-center justify-center gap-2 py-4">
              <Loader2 className="w-4 h-4 animate-spin" />
              <span className="text-sm text-muted-foreground">Loading your content...</span>
            </div>
          ) : restoredOutput && !restoredOutput.isTruncated ? (
            <div className="bg-green-50 dark:bg-green-950 border border-green-200 dark:border-green-800 rounded-md p-3">
              <div className="flex items-center gap-2 text-green-700 dark:text-green-300">
                <FileText className="w-4 h-4" />
                <span className="text-sm font-medium">Your full output is ready!</span>
              </div>
              <p className="text-xs text-green-600 dark:text-green-400 mt-1">
                Click below to view your complete, untruncated content.
              </p>
            </div>
          ) : null}
          
          <Button 
            onClick={handleGoHome}
            className="w-full"
            data-testid="button-go-home"
          >
            {restoredOutput ? 'View Full Output' : 'Go to Dashboard'}
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
