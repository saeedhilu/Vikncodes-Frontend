import React, { ReactNode, ErrorInfo } from "react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { RefreshCw } from "lucide-react";

interface ErrorBoundaryProps {
  children: ReactNode;
}

interface ErrorBoundaryState {
  hasError: boolean;
}

class ErrorBoundary extends React.Component<
  ErrorBoundaryProps,
  ErrorBoundaryState
> {
  constructor(props: ErrorBoundaryProps) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    return { hasError: true };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo): void {
    console.error("ErrorBoundary caught an error:", error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="p-8 flex justify-center items-center rounded-lg text-center h-screen">
          <Card className="bg-white max-w-lg p-10 mx-auto">
            <CardContent>
              <CardTitle className="text-2xl font-bold text-gray-900">
                Oops! Something went wrong.
              </CardTitle>
              <CardDescription className="mt-4 text-gray-700">
                We apologize for the inconvenience. Please try refreshing the
                page or going back.
              </CardDescription>
              <div className="mt-6 space-x-4">
                <Button onClick={() => window.location.reload()}>
                  <RefreshCw className="mr-2" />
                  Refresh Page
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
