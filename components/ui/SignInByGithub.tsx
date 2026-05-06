"use client";

import { Button } from "./button";
import { login } from "@/lib/actions/auth.action";

export default function SignInByGithub() {
  return (
    <Button variant="outline" className="w-full" onClick={()=>login()}>
      Login with Github
    </Button>
  );
}
