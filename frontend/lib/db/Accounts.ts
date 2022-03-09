import { MongoClient } from "mongodb"
import { v4 as makeToken } from "uuid"
import Database from "./Core"

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

const createAccount = async(email) => {
    return await Database.Execute(async(client:MongoClient) => {
        const tkn = makeToken()
        const col = client.db("Main").collection("Accounts")

        await col.insertOne({
            email: email,
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

const Accounts = {
    createAccount,
    exists,
    getToken,
    Account
}

export default Accounts