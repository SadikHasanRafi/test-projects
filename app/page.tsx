import { auth } from "@/auth";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import SignInByGithub from "@/components/ui/SignInByGithub";
import SignOutButton from "@/components/ui/SignOutButton";

export default async function Home() {
  const session = await auth();

  return (
    <div className="flex items-center justify-center min-h-screen">
      <Card className="w-full max-w-sm">
        <CardHeader>
          <CardTitle>{
              session ? `You are signed in ${session?.user?.name}` : "You are not signed in"
            }</CardTitle>
        </CardHeader>

        <CardContent>{session ? <SignOutButton /> : <SignInByGithub />}</CardContent>
      </Card>
    </div>
  );
}
