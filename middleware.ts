import { NextRequest, NextResponse } from "next/server";
import { get } from "@vercel/edge-config";

export const config = {
  matcher: ["/((?!_next|api/auth).*)"],
};

export async function middleware(req: NextRequest) {
  try {
    const isInMaintenanceMode = await get<boolean>("isInMaintenanceMode");
    if (!isInMaintenanceMode) {
      if (req.nextUrl.pathname === "/maintenance") {
        req.nextUrl.pathname = `/`;
        return NextResponse.redirect(req.nextUrl);
      }
    } else {
      req.nextUrl.pathname = `/maintenance`;
      return NextResponse.rewrite(req.nextUrl);
    }
  } catch (error) {
    console.error(error);
  }
}
