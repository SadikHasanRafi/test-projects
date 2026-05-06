"use client";

import { useRouter } from "next/navigation";
import { Button } from "./button";
import { logout } from "@/lib/actions/auth.action";

export default function SignOutButton() {

  


  return (
    <Button variant="outline" className="w-full" onClick={()=>logout()}>
      Logout
    </Button>
  )
}
