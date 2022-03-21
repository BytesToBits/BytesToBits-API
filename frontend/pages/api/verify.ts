import { NextApiRequest, NextApiResponse } from "next";
import Accounts from "../../lib/db/Accounts";
import Config from "../../config.json"
import Cryptr from "cryptr"

const verifyAccount = async(req: NextApiRequest, res : NextApiResponse) => {
    if (req.method === "POST") {
        const body = JSON.parse(req.body)

        if (!body.email || !body.code) {
            return res.status(400).json({message: "bad request"})
        }
        const cryptr = new Cryptr(Config.secret)
        const email = cryptr.decrypt(body.email)

        console.log(body.code)

        const Pass = await Accounts.checkVerification(email, body.code)

        return res.json({ pass: Pass })
    } else {
        res.status(405).json({
            message: "method not allowed"
        })
    }
}

export default verifyAccount 