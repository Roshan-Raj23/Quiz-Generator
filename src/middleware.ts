import { NextResponse, type NextRequest } from "next/server"
import { getUserFromSession, updateUserSessionExpiration } from "./lib/sessions"

const loginRequiredRoutes = ["/take" , "/profile"]
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
  if (loginRequiredRoutes.includes(request.nextUrl.pathname)) {
    const user = await getUserFromSession(request.cookies)
    if (user == null) {
      return NextResponse.redirect(new URL("/signin", request.url))
    }
  }

  if (creatorRequiredRoutes.includes(request.nextUrl.pathname)) {
    const user = await getUserFromSession(request.cookies)
    if (user == null) {
      return NextResponse.redirect(new URL("/sign-in", request.url))
    } else if (user.isCreator == false) {
      return NextResponse.redirect(new URL("/", request.url))
    }
  }

  if (request.nextUrl.pathname.startsWith('/take-quiz/')) {
    const { pathname } = request.nextUrl;
    const pathSegments = pathname.split('/');

    if (pathSegments.length < 3) {
      return NextResponse.redirect(new URL("/take", request.url))
    }
    const id = pathSegments[2];


    const url = request.nextUrl.clone();
    url.pathname = '/api/isQuiz';

    const response = await fetch(url , {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ id }),
      });
    const data = await response.json();

    if (data.status !== 200 || !data.find){
      
      return NextResponse.redirect(new URL("/take", request.url));
    }
  }
}

export const config = {
  matcher: [
    // Skip Next.js internals and all static files, unless found in search params
    "/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)",
  ],
}
