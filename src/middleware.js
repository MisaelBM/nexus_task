import { NextResponse } from 'next/server'
 
export function middleware(request) {
  // Pegar o token do localStorage
  const token = request.cookies.get('auth_token')
 
  // Rotas protegidas
  const protectedPaths = ['/pages/frame', '/pages/calendar', '/pages/dashboard']
  
  const isProtectedPath = protectedPaths.some(path => 
    request.nextUrl.pathname.startsWith(path)
  )
  
  // Se for uma rota protegida e não tiver token, redirecionar para login
  if (isProtectedPath && !token) {
    return NextResponse.redirect(new URL('/login', request.url))
  }
  
  // Se estiver logado e tentar acessar login/register, redirecionar para o frame
  if (token && (request.nextUrl.pathname === '/login' || request.nextUrl.pathname === '/register')) {
    return NextResponse.redirect(new URL('/pages/frame', request.url))
  }
  
  return NextResponse.next()
}
