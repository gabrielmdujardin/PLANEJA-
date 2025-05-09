import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"

// Rotas que não precisam de autenticação
const publicRoutes = ["/", "/login", "/register", "/about", "/pricing", "/help", "/contact", "/terms", "/privacy"]

export function middleware(request: NextRequest) {
  // Verificar se o usuário está autenticado
  const isAuthenticated = request.cookies.has("planeja_plus_user")
  const path = request.nextUrl.pathname

  // Se o usuário não estiver autenticado e tentar acessar uma rota protegida
  if (!isAuthenticated && !publicRoutes.includes(path) && !path.includes("/_next")) {
    return NextResponse.redirect(new URL("/login", request.url))
  }

  // Se o usuário estiver autenticado e tentar acessar login ou register
  if (isAuthenticated && (path === "/login" || path === "/register")) {
    return NextResponse.redirect(new URL("/dashboard", request.url))
  }

  return NextResponse.next()
}

export const config = {
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico).*)"],
}
