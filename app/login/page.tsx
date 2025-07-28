"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Eye, EyeOff, Shield } from "lucide-react";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    if (!email || !password) {
      setError("Please enter both email and password.");
      return;
    }
    setLoading(true);
    // Placeholder for actual authentication logic
    setTimeout(() => {
      setLoading(false);
      if (email === "admin@example.com" && password === "password") {
        alert("Login successful! (Demo only)");
      } else {
        setError("Invalid email or password.");
      }
    }, 1000);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-900 via-gray-800 to-blue-900">
      <Card className="w-full max-w-md bg-gray-800 border-gray-700 shadow-2xl">
        <CardHeader className="flex flex-col items-center gap-2">
          <div className="flex items-center justify-center w-14 h-14 rounded-full bg-blue-700 mb-2">
            <Shield className="h-8 w-8 text-white" />
          </div>
          <CardTitle className="text-white text-2xl text-center">
           Role Based Login
          </CardTitle>
          <div className="text-gray-400 text-sm text-center w-full">
            Welcome to the ANPR Vehicle Management System
          </div>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <Label htmlFor="email" className="text-gray-300">
                Email
              </Label>
              <Input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="bg-gray-700 border-gray-600 text-white"
                autoComplete="email"
                required
                placeholder="you@email.com"
              />
            </div>
            <div>
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
                  autoComplete="current-password"
                  required
                  placeholder="Your password"
                />
                <button
                  type="button"
                  className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-400 hover:text-white"
                  tabIndex={-1}
                  onClick={() => setShowPassword((v) => !v)}
                  aria-label={showPassword ? "Hide password" : "Show password"}
                >
                  {showPassword ? (
                    <EyeOff className="h-5 w-5" />
                  ) : (
                    <Eye className="h-5 w-5" />
                  )}
                </button>
              </div>
            </div>
            {error && (
              <div className="text-red-400 text-sm bg-red-900/20 p-2 rounded border border-red-800">
                {error}
              </div>
            )}
            <Button
              type="submit"
              className="w-full bg-blue-600 hover:bg-blue-700"
              disabled={loading}
            >
              {loading ? "Logging in..." : "Login"}
            </Button>
            {/* <div className="flex items-center my-2">
              <div className="flex-1 h-px bg-gray-700" />
              <span className="mx-2 text-gray-500 text-xs">or</span>
              <div className="flex-1 h-px bg-gray-700" />
            </div>
            <Button
              type="button"
              variant="outline"
              className="w-full border-gray-600 text-gray-200 hover:bg-gray-700"
              onClick={() => {
                setEmail("admin@example.com");
                setPassword("password");
                setError("");
              }}
            >
              Demo Login
            </Button> */}
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
