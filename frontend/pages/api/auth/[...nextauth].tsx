import { MongoDBAdapter } from "@next-auth/mongodb-adapter"
import type { NextApiRequest, NextApiResponse } from "next"
import NextAuth from "next-auth"
import EmailProvider from "next-auth/providers/email"

import Config from "../../../config.json"
import Accounts from "../../../lib/db/Accounts"
import clientPromise from "../../../lib/mongo"

const nodemailer = require("nodemailer")

export default async function auth(req: NextApiRequest, res: NextApiResponse) {

    return await NextAuth(req, res, {
        pages: {
            signIn: "/login"
        },
        adapter: MongoDBAdapter(clientPromise),
        providers: [
            EmailProvider({
                server: Config.emailServer,
                from: Config.originMail,
                secret: Config.secret,
                maxAge:60*60*24*30
            })
        ],
        callbacks: {
            async session({ session, user }) {

                let data = user

                if (data) {
                    if (await Accounts.exists(data.email)) {
                        data.token = await Accounts.getToken(data.email)
                    } else {
                        data.token = await Accounts.createAccount(data.email)
                    }
                }

                return data
            }
        }
    })
}