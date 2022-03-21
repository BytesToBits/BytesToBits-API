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
            // CredentialsProvider({
            //     server: Config.emailServer,
            //     from: Config.originMail,
            //     secret: Config.secret,
            //     maxAge:60*60*24*30
            // })
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
                            return res.redirect("/login?error=true")
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

                        return res.redirect("/verify?email=" + encEmail)
                    }
                }
            })
        ],
        jwt: {
            secret: Config.secret,
            encryption: true
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

                let data = token.user

                if (data) {
                    if (await Accounts.exists(data.email)) {
                        data.token = await Accounts.getToken(data.email)
                    }
                    data.tokenInfo = await Accounts.tokenInfo(data.token)
                }

                return data
            }
        }
    })
}