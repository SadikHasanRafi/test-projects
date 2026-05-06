import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function Home() {
  return (
    <div className="flex items-center justify-center min-h-screen">
      <Card className="w-full max-w-sm">
        <CardHeader>
          <CardTitle>Your are not logged in</CardTitle>
        </CardHeader>

        <CardContent>
          <Button variant="outline" className="w-full">
            Login with Github
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
