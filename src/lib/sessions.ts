// import crypto from "crypto"
import { User } from "@/Model/User"
import { redisClient } from "./redis"

// Seven days in seconds
const SESSION_EXPIRATION_SECONDS = 60 * 60 * 24 * 7
const COOKIE_SESSION_KEY = "session-id"

export type Cookies = {
    set: (
        key: string,
        value: string,
        options: {
        secure?: boolean
        httpOnly?: boolean
        sameSite?: "strict" | "lax"
        path?: string
        expires?: number
        }
    ) => void
    get: (key: string) => { name: string; value: string } | undefined
    delete: (key: string) => void
}


export async function updateUserSessionData(
    user: User,
    cookies: Pick<Cookies, "get">
) {
    const sessionId = cookies.get(COOKIE_SESSION_KEY)?.value
    if (sessionId == null) return null

    await redisClient.set(`session:${sessionId}`, user, {
        ex: SESSION_EXPIRATION_SECONDS,
    })
}

export async function updateUserSessionExpiration(cookies: Pick<Cookies, "get" | "set">) {
    const sessionId = cookies.get(COOKIE_SESSION_KEY)?.value
    if (sessionId == null) return null

    const user = await getUserSessionById(sessionId)
    if (user == null) return

    await redisClient.set(`session:${sessionId}`, user, {
        ex: SESSION_EXPIRATION_SECONDS,
    })
    setCookie(sessionId, cookies)
}

function generateSecureRandomHex(bytes: number): string {
  const array = new Uint8Array(bytes);
  crypto.getRandomValues(array);
  return Array.from(array)
    .map(b => b.toString(16).padStart(2, '0'))
    .join('');
}

export async function createUserSession(user: User , cookies: Cookies) {
    // const sessionId = crypto.randomBytes(512).toString("hex").normalize()
    const sessionId = generateSecureRandomHex(512).normalize();
    await redisClient.set(`session:${sessionId}`, user , {
        ex: SESSION_EXPIRATION_SECONDS,
    })

    setCookie(sessionId, cookies)
}

export async function getUserFromSession(cookies: Pick<Cookies, "get">) {
    try {
        const sessionId = cookies.get(COOKIE_SESSION_KEY)?.value
        if (sessionId == null) return null

        return await getUserSessionById(sessionId)
    } catch (error) {
        console.error('Error getting user from session:', error)
        return null
    }
}

async function getUserSessionById(sessionId: string) {
    try {
        const rawUser = await redisClient.get(`session:${sessionId}`)
        return rawUser;
    } catch (error) {
        console.error('Error getting user session by ID:', error)
        return null
    }
}

async function setCookie(sessionId: string, cookies: Pick<Cookies, "set">) {
    cookies.set(COOKIE_SESSION_KEY, sessionId, {
        secure: process.env.NODE_ENV === 'production',
        httpOnly: true,
        sameSite: "lax",
        path: "/",
        expires: Date.now() + SESSION_EXPIRATION_SECONDS * 1000,
    })
}

export async function removeUserFromSession(
  cookies: Pick<Cookies, "get" | "delete">
) {
    const sessionId = cookies.get(COOKIE_SESSION_KEY)?.value
    if (sessionId == null) return null

    await redisClient.del(`session:${sessionId}`)
    cookies.delete(COOKIE_SESSION_KEY)
}
