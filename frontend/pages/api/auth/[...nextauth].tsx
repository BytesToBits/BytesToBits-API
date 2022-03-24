import { MongoDBAdapter } from "@next-auth/mongodb-adapter"
import type { NextApiRequest, NextApiResponse } from "next"
import NextAuth from "next-auth"
import CredentialsProvider from "next-auth/providers/credentials"
import Cryptr from "cryptr"

import Config from "../../../config.json"
import Accounts from "../../../lib/db/Accounts"
import clientPromise from "../../../lib/mongo"

import emailStyle from "../../../styles/emailStyle"

import SendGrid from "@sendgrid/mail"
SendGrid.setApiKey(Config.emailServer.auth.pass)

const nodemailer = require("nodemailer")

export default async function auth(req: NextApiRequest, res: NextApiResponse) {

    return await NextAuth(req, res, {
        adapter: MongoDBAdapter(clientPromise),
        pages: {
            signIn: "/login"
        },
        providers: [
            CredentialsProvider({
                name: "credentials",
                credentials: {
                    email: { label: "Email", type: "email", placeholder: "example@email.com" },
                    password: { label: "Password", type: "password" }
                },
                async authorize(credentials, req) {
                    const account = await Accounts.exists(credentials.email)
                    const cryptr = new Cryptr(Config.secret)
                    const encEmail = cryptr.encrypt(credentials.email)
                    const url = process.env.NODE_ENV == "development" ? "http://localhost:3000/" : Config.url
                    
                    if (account) {
                        const password = cryptr.decrypt(account.password)
                        if (credentials.password == password) {
                            return {
                                ...account,
                                _id: null
                            }
                        } else {
                            res.redirect("/login?error=true")
                            return null
                        }
                    } else {
                        const code = await Accounts.requestVerification(credentials.email, password)

                        const message = {
                            to: credentials.email,
                            from: "noreply@bytestobits.dev",
                            subject: "BytesToBits API - Create Your Account",
                            html: emailStyle(credentials?.email, url, code),
                        }

                        SendGrid.send(message).then(() => console.log("Email Sent"))

                        res.redirect("/verify?email=" + encEmail)
                        return null
                    }
                }
            })
        ],
        jwt: {
            secret: Config.secret,
            encryption: true,
            maxAge: 30*24*60*60
        },
        secret: Config.secret,
        session: {
            strategy: "jwt"
        },
        callbacks: {
            async jwt({ token, user }) {

                if (user) {
                    token.user = user
                }

                return token
            },
            async session({ session, token }) {
                session = token.user

                if (session) {
                    if (await Accounts.exists(session.email)) {
                        session.token = await Accounts.getToken(session.email)
                    }
                    session.tokenInfo = await Accounts.tokenInfo(session.token)
                    if(session.tokenInfo) {
                        const endpoints = [...new Set(session.tokenInfo.actions.map(ac => ac.endpoint))]
                        const actions = endpoints.map(ep => [ep, session.tokenInfo.actions.filter(e => e.endpoint == ep).length])
                        session.tokenInfo.actions = JSON.stringify(actions)
                    }
                }

                return session
            }
        }
    })
}