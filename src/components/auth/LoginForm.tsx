import { useState } from "react";
import { useAuth } from "@/lib/auth";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { toast } from "sonner";
import { LockIcon, LogInIcon } from "lucide-react";

export function LoginForm() {
  const [apiUrl, setApiUrl] = useState("");
  const [apiKey, setApiKey] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const { login } = useAuth();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!apiUrl || !apiKey) {
      toast.error("Please enter both API URL and API Key");
      return;
    }

    setIsLoading(true);

    try {
      const success = await login(apiUrl, apiKey);

      if (success) {
        toast.success("Login successful");
      } else {
        toast.error("Invalid API URL or API Key");
      }
    } catch (error) {
      toast.error("An error occurred during login");
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Card className="w-full max-w-md mx-auto shadow-lg animate-fade-in">
      <CardHeader className="space-y-1">
        <div className="flex items-center justify-center w-12 h-12 mx-auto mb-4 rounded-full bg-primary/10">
          <LockIcon className="w-6 h-6 text-primary" />
        </div>
        <CardTitle className="text-2xl font-bold text-center">
          Welcome Back
        </CardTitle>
        <CardDescription className="text-center">
          Enter your credentials to access the dashboard
        </CardDescription>
      </CardHeader>
      <form onSubmit={handleSubmit}>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="apiUrl">API URL</Label>
            <Input
              id="apiUrl"
              type="url"
              placeholder="Enter your API URL"
              value={apiUrl}
              onChange={(e) => setApiUrl(e.target.value)}
              required
              className="transition-all duration-200 ease-in-out"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="apiKey">API Key</Label>
            <Input
              id="apiKey"
              type="password"
              autoComplete="off"
              placeholder="Enter your API Key"
              value={apiKey}
              onChange={(e) => setApiKey(e.target.value)}
              required
              className="transition-all duration-200 ease-in-out"
            />
          </div>
        </CardContent>
        <CardFooter>
          <Button
            type="submit"
            className="w-full transition-all duration-200 ease-in-out"
            disabled={isLoading}
          >
            {isLoading ? (
              <span className="flex items-center">
                <span className="w-4 h-4 mr-2 border-2 border-white border-t-transparent rounded-full animate-spin" />
                Logging in...
              </span>
            ) : (
              <span className="flex items-center">
                <LogInIcon className="w-4 h-4 mr-2" />
                Log In
              </span>
            )}
          </Button>
        </CardFooter>
      </form>
    </Card>
  );
}
