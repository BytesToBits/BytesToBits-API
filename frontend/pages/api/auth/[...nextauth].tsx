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
                credentials: {
                    email: { label: "Email", type: "email", placeholder: "example@email.com" },
                    password: { label: "Password", type: "password" }
                },
                async authorize(credentials, req) {
                    const account = await Accounts.exists(credentials.email)
                    const cryptr = new Cryptr(Config.secret)
                    const password = cryptr.encrypt(credentials.password)
                    const encEmail = cryptr.encrypt(credentials.email)
                    const url = process.env.NODE_ENV == "development" ? "http://localhost:3000/" : Config.url
                    
                    if (account) {
                        if (account.password == password) {
                            console.log("Success login!")
                            return account
                        } else {
                            console.log("Failed login!")
                            return res.redirect("/login?error=true")
                        }
                    } else {
                        console.log("Verification")
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
        callbacks: {
            async session({ session, user }) {

                let data = user

                if (data) {
                    if (await Accounts.exists(data.email)) {
                        data.token = await Accounts.getToken(data.email)
                    }
                    console.log(data.token)
                    data.tokenInfo = await Accounts.tokenInfo(data.token)
                }

                return data
            }
        }
    })
}