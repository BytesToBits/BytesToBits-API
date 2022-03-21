import { MongoClient } from "mongodb"
import { v4 as makeToken } from "uuid"
import Database from "./Core"
import Cryptr from "cryptr"
import Config from "../../config.json"

class Account {
    public token: string
    
    constructor(token) {
        this.token = token
    }

    public async newToken() {
        return await Database.Execute(async(client:MongoClient) => {
            const tkn = makeToken()

            const col = client.db("Main").collection("Accounts")

            await col.updateOne({
                token: this.token
            }, {
                $set: {
                    token: tkn
                }
            })

            this.token = tkn

            return tkn
        })
    }
}

const clearVerifyTimeouts = async() => {
    await Database.Execute(async(client: MongoClient) => {
        const col = client.db("Main").collection("Verifications")
        const docs = await col.find({}).toArray()

        docs.forEach(doc => {
            if ((new Date()) - doc.date > 60*60*1000) {
                col.deleteMany({email: doc.email})
            }
        })
    })
}

const requestVerification = async(email, password) => {
    await clearVerifyTimeouts()
    return await Database.Execute(async(client:MongoClient) => {
        let code = makeToken().split("-")[0].toUpperCase()
        const col = client.db("Main").collection("Verifications")

        const exists = await col.findOne({email: email})

        if (!exists) {
            await col.insertOne({ email: email, password: password, code: code, date: new Date()})
        } else {
            code = exists.code
        }

        return code
        
    })
}

const checkVerification = async(email, code) => {
    await clearVerifyTimeouts()
    return await Database.Execute(async(client:MongoClient) => {
        const col = client.db("Main").collection("Verifications")

        const exists = await col.findOne({email: email})

        if (!exists) return false

        if (exists.code !== code) return false

        await createAccount(email, exists.password)

        await col.deleteMany({ email: email })

        return true
        
    })
}

const createAccount = async(email, password) => {
    return await Database.Execute(async(client:MongoClient) => {
        const tkn = makeToken()
        const col = client.db("Main").collection("Accounts")

        await col.insertOne({
            email: email,
            password: password,
            token: tkn
        })

        return tkn
    })
}

const exists = async(email) => {
    return await Database.Execute(async(client:MongoClient) => {
        const col = client.db("Main").collection("Accounts")
        
        return await col.findOne({
            email: email
        })
    })
}

const getToken = async(email) => {
    const hasToken = await exists(email)

    if (!hasToken) return null

    return await Database.Execute(async(client:MongoClient) => {
        const col = client.db("Main").collection("Accounts")
        
        const data = await col.findOne({
            email: email
        })

        return data.token
    })
}

const tokenInfo = async(token) => {
    return await Database.Execute(async(client:MongoClient) => {
        const col = client.db("API").collection("tokens")

        const data = await col.findOne({
            token: token
        })

        if (!data) return {}

        return {
            ...data,
            actions: data.actions.map(action => ({
                ...action,
                date: action.date.toString()
            })),
            ratelimited: data.ratelimited.toString()
        }
    })
}

const Accounts = {
    createAccount,
    exists,
    getToken,
    Account,
    tokenInfo,
    requestVerification,
    checkVerification
}

export default Accounts