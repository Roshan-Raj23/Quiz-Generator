import { NextResponse, type NextRequest } from "next/server"
import { getUserFromSession, updateUserSessionExpiration } from "./lib/sessions"
import { User } from "./Model/User"

const noLoginRequiredRoutes = ["/signin" , "/signup"]
const loginRequiredRoutes = ["/take" , "/profile"];
const creatorRequiredRoutes = ["/create" , "/my-quizzes"]

export async function middleware(request: NextRequest) {
  const response = (await middlewareAuth(request)) ?? NextResponse.next()

  await updateUserSessionExpiration({
    set: (key, value, options) => {
      response.cookies.set({ ...options, name: key, value })
    },
    get: key => request.cookies.get(key),
  })

  return response
}

async function middlewareAuth(request: NextRequest) {

  try { 
    // Skip middleware for API routes to avoid conflicts
    if (request.nextUrl.pathname.startsWith('/api/')) {
      return null
    }

    const user = await getUserFromSession(request.cookies) as User;
    if (noLoginRequiredRoutes.includes(request.nextUrl.pathname)) {
      if (user) {
        return NextResponse.redirect(new URL("/", request.url))
      }
    }

    if (loginRequiredRoutes.includes(request.nextUrl.pathname)) {
      if (user == null) {
        return NextResponse.redirect(new URL("/signin", request.url))
      }
    }
  
    if (creatorRequiredRoutes.includes(request.nextUrl.pathname)) {
      if (user == null) {
        return NextResponse.redirect(new URL("/signin", request.url))
      } else if (user.isCreator == false) {
        return NextResponse.redirect(new URL("/", request.url))
      }
    }
  
    if (request.nextUrl.pathname.startsWith('/take-quiz/')) {
      if (user == null) {
        return NextResponse.redirect(new URL("/signin", request.url))
      }
  
      const { pathname } = request.nextUrl;
      const pathSegments = pathname.split('/');
  
      if (pathSegments.length < 3) {
        return NextResponse.redirect(new URL("/take", request.url))
      }
    }
  } catch (err) {
    console.error('Middleware error:', err)
    return null
  }

}

export const config = {
  matcher: [
    // // Skip Next.js internals and all static files, unless found in search params
    // "/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)",

    
    // Skip Next.js internals, API routes, and all static files
    "/((?!_next|api|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)",
  ],
}
