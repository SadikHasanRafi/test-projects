import { NextRequest, NextResponse } from "next/server";
import { auth } from "./auth";
import path from "path";
import { redirect } from "next/navigation";


const protectedRoutes=[
    "/user-info"
]

export default  async function middleware (request:NextRequest) {

    const session = await auth()

    const { pathname }  = request.nextUrl

    const isProtected = protectedRoutes.some((route) => pathname.startsWith(route))

    
// Redirect unauthenticated users to home page with callbackUrl
if (isProtected && !session) {
  const loginUrl = new URL("/", request.url);
  loginUrl.searchParams.set("callbackUrl", request.nextUrl.pathname);
  return NextResponse.redirect(loginUrl);
}
    
    
    return NextResponse.next()


}