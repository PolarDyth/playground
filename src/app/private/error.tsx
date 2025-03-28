'use client';

import { useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { AlertTriangle, Home, RefreshCcw } from 'lucide-react';
import Link from 'next/link';

export default function ErrorPage({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    // Log the error to an error reporting service
    console.error('Page error:', error);
  }, [error]);

  return (
    <div className="container flex items-center justify-center min-h-[70vh]">
      <div className="max-w-md mx-auto text-center">
        <div className="rounded-full bg-destructive/10 p-4 w-20 h-20 mx-auto mb-6 flex items-center justify-center">
          <AlertTriangle className="h-10 w-10 text-destructive" />
        </div>
        
        <h1 className="text-3xl font-bold tracking-tight mb-3">
          Something went wrong
        </h1>
        
        <p className="text-muted-foreground mb-6">
          {error.message || 'An unexpected error occurred while loading this page.'}
        </p>
        
        {error.digest && (
          <div className="p-2 bg-muted rounded-md mb-6 overflow-auto">
            <p className="text-xs text-muted-foreground font-mono">
              Error ID: {error.digest}
            </p>
          </div>
        )}
        
        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <Button onClick={reset} variant="default" className="gap-2">
            <RefreshCcw className="h-4 w-4" />
            Try again
          </Button>
          
          <Button variant="outline" asChild className="gap-2">
            <Link href="/">
              <Home className="h-4 w-4" />
              Return to home
            </Link>
          </Button>
        </div>
      </div>
    </div>
  );
}