import { auth } from "@/auth";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

import SignInByGithub from "@/components/ui/SignInByGithub";
import SignOutButton from "@/components/ui/SignOutButton";

export default async function Home() {
  const session = await auth();

  return (
    <div className="flex items-center justify-center min-h-screen bg-muted/40 px-4">
      <Card className="w-full max-w-sm shadow-lg border">
        <CardHeader className="space-y-1">
          <CardTitle className="text-2xl font-bold">{session ? `Welcome ${session?.user?.name}` : "Login to your account"}</CardTitle>

          <CardDescription>{session ? "You are successfully signed in." : "Enter your email and password below"}</CardDescription>
        </CardHeader>

        <CardContent>
          {session ? (
            <div className="flex flex-col gap-4">
              <div className="rounded-lg border bg-muted p-3 text-sm">
                Signed in as <span className="font-medium">{session?.user?.email}</span>
              </div>

              <SignOutButton />
            </div>
          ) : (
            <form className="space-y-5">
              {/* Email */}
              <div className="grid gap-2">
                <Label htmlFor="email">Email</Label>

                <Input id="email" type="email" placeholder="m@example.com" />
              </div>

              {/* Password */}
              <div className="grid gap-2">
                <div className="flex items-center justify-between">
                  <Label htmlFor="password">Password</Label>

                  <a href="#" className="text-sm text-muted-foreground hover:underline">
                    Forgot password?
                  </a>
                </div>

                <Input id="password" type="password" placeholder="Enter your password" />
              </div>
            </form>
          )}
        </CardContent>

        {!session && (
          <CardFooter className="flex flex-col gap-3">
            {/* Later you can add email/password login button here */}

            <SignInByGithub />
          </CardFooter>
        )}
      </Card>
    </div>
  );
}
