import { NextRequest, NextResponse } from "next/server";
import jwt from "jsonwebtoken";
import { jwtsecret } from "./components/data";

export const config = {
  runtime: "nodejs", // Force Node.js runtime
};

import { jwtVerify } from "jose";

const jwtSecrett = new TextEncoder().encode(jwtsecret);

const tokencheck = async (token: string | undefined) => {
  if (!token) return null;
  try {
    const { payload } = await jwtVerify(token, jwtSecrett);
    return payload as { role: string };
  } catch (error) {
    console.error("JWT Verification Error:", error);
    return null;
  }
};

export async function middleware(request: NextRequest) {
  const token = request.cookies.get("token")?.value;
  const decoded = await tokencheck(token);

  if (request.nextUrl.pathname.includes("/login") && decoded?.role === "admin") {
    return NextResponse.redirect(new URL("/admin/main", request.url));
  }

  if (request.nextUrl.pathname.includes("/admin")) {
    if (!decoded || decoded.role !== "admin") {
      return NextResponse.redirect(new URL("/user/main", request.url));
    }
  }
  if (request.nextUrl.pathname.includes("/user")) {
    if (!decoded || decoded.role !== "user") {
      return NextResponse.redirect(new URL("/login", request.url));
    }
  }

  return NextResponse.next();
}

