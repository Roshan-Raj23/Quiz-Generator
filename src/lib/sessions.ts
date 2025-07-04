import crypto from "crypto"
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

export async function createUserSession(user: User , cookies: Cookies) {
    const sessionId = crypto.randomBytes(512).toString("hex").normalize()
    await redisClient.set(`session:${sessionId}`, user , {
        ex: SESSION_EXPIRATION_SECONDS,
    })

    setCookie(sessionId, cookies)
}

export async function getUserFromSession(cookies: Pick<Cookies, "get">) {
    const sessionId = cookies.get(COOKIE_SESSION_KEY)?.value
    if (sessionId == null) return null

    return getUserSessionById(sessionId)
}

async function getUserSessionById(sessionId: string) {
    const rawUser = await redisClient.get(`session:${sessionId}`)
    return rawUser;
}

async function setCookie(sessionId: string, cookies: Pick<Cookies, "set">) {
    cookies.set(COOKIE_SESSION_KEY, sessionId, {
        secure: true,
        httpOnly: true,
        sameSite: "lax",
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
