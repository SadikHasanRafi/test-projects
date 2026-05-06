import { auth, signOut } from "@/auth";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter } from "@/components/ui/card";

export default async function UserProfileCard() {
  const session = await auth();

  const name = session?.user?.name ?? "Unknown User";
  const image = session?.user?.image ?? "https://avatar.vercel.sh/user";
  const email = session?.user?.email ?? "No email";
  const id = session?.user?.id ?? "No ID";

  const initials = name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);

  return (
    <div className="flex min-h-screen items-center justify-center bg-zinc-100 p-4">
      <Card className="w-full max-w-sm rounded-2xl border border-zinc-200 shadow-sm">
        <CardContent className="flex flex-col items-center gap-4 pt-8 text-center">
          {/* Avatar */}
          <Avatar className="h-24 w-24 border-4 border-white shadow">
            <AvatarImage src={image} alt={name} />
            <AvatarFallback className="text-lg font-semibold">{initials}</AvatarFallback>
          </Avatar>

          {/* User Info */}
          <div className="space-y-1">
            <h2 className="text-xl font-semibold text-zinc-900">{name}</h2>

            <p className="text-sm text-zinc-500">{email}</p>

            <p className="text-xs text-zinc-400 break-all">ID: {id}</p>
          </div>
        </CardContent>

        {/* Logout Button */}
        <CardFooter className="pb-6">
          <form
            className="w-full"
            action={async () => {
              "use server";
              await signOut();
            }}>
            <Button type="submit" className="w-full rounded-xl" variant="destructive">
              Logout
            </Button>
          </form>
        </CardFooter>
      </Card>
    </div>
  );
}
