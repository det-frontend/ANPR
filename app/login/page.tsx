"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Shield, Eye, EyeOff, AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useAuth } from "@/contexts/AuthContext";

export default function LoginPage() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [isSeeding, setIsSeeding] = useState(false);

  const { user, login } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (user) {
      // Redirect based on role
      if (user.role === "manager") {
        router.push("/dashboard");
      } else {
        router.push("/");
      }
    }
  }, [user, router]);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setIsLoading(true);

    try {
      const success = await login(username, password);
      if (!success) {
        setError("Invalid username or password");
      }
    } catch (error) {
      setError("Login failed. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleSeedUsers = async () => {
    setIsSeeding(true);
    try {
      const response = await fetch("/api/auth/seed", { method: "POST" });
      if (response.ok) {
        alert(
          "Default users created successfully!\n\nManager: username=manager, password=manager123\nClient: username=client, password=client123"
        );
      } else {
        alert("Failed to create default users");
      }
    } catch (error) {
      alert("Error creating default users");
    } finally {
      setIsSeeding(false);
    }
  };

  if (user) {
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-400 mx-auto mb-4"></div>
          <p className="text-gray-300">Redirecting...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-900 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <Card className="bg-gray-800 border-gray-700">
          <CardHeader className="text-center">
            <div className="flex justify-center mb-4">
              <Shield className="h-12 w-12 text-blue-400" />
            </div>
            <CardTitle className="text-2xl font-bold text-white">
              ANPR System Login
            </CardTitle>
            <p className="text-gray-400 text-sm">
              Enter your credentials to access the system
            </p>
          </CardHeader>

          <CardContent>
            <form onSubmit={handleLogin} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="username" className="text-gray-300">
                  Username
                </Label>
                <Input
                  id="username"
                  type="text"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  className="bg-gray-700 border-gray-600 text-white"
                  placeholder="Enter your username"
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="password" className="text-gray-300">
                  Password
                </Label>
                <div className="relative">
                  <Input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="bg-gray-700 border-gray-600 text-white pr-10"
                    placeholder="Enter your password"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-white"
                  >
                    {showPassword ? (
                      <EyeOff className="h-4 w-4" />
                    ) : (
                      <Eye className="h-4 w-4" />
                    )}
                  </button>
                </div>
              </div>

              {error && (
                <div className="flex items-center gap-2 p-3 bg-red-900/20 border border-red-800 rounded-lg">
                  <AlertCircle className="h-4 w-4 text-red-400" />
                  <span className="text-red-400 text-sm">{error}</span>
                </div>
              )}

              <Button
                type="submit"
                disabled={isLoading}
                className="w-full bg-blue-600 hover:bg-blue-700"
              >
                {isLoading ? "Signing In..." : "Sign In"}
              </Button>
            </form>

            {/* <div className="mt-6 pt-6 border-t border-gray-700">
              <Button
                type="button"
                variant="outline"
                onClick={handleSeedUsers}
                disabled={isSeeding}
                className="w-full bg-gray-700 hover:bg-gray-600 text-white border-gray-600"
              >
                {isSeeding ? "Creating Users..." : "Create Default Users"}
              </Button>
              <p className="text-xs text-gray-500 mt-2 text-center">
                Click to create default manager and client accounts for testing
              </p>
            </div> */}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
