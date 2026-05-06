"use server";

import { signIn, signOut } from "@/auth"










export const login  = async () => {
    await signIn("github", { redirect: true, redirectTo: "/user-info" })
}


export const logout = async () => {

    await signOut({ redirectTo: "/"  })

}



