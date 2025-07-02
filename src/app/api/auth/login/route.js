import { dbConnect } from "@/db/dbConnection";
import userModel from "@/models/user_model";
const argon2 = require("argon2");
const jwt = require("jsonwebtoken");

dbConnect();

export const POST = async (request) => {
    try {
        const reqBody = await request.json();
        const { username, password } = reqBody;

        const isUserExist = await userModel?.findOne({ username });
        if (!isUserExist) Response?.json({ status: 400, message: "Invalid Credentials" });

        const isPasswordVerified = await argon2.verify(isUserExist?.password, password);
        if (!isPasswordVerified) Response?.json({ status: 400, message: "Invalid Credentials" });

        const token = await jwt.sign(
            {
                email: isUserExist?.email,
                password: isUserExist?.password,
                username: username,
            },
            process.env.PINGSY_JWT,
            { expiresIn: "1h" }
        );
        
        return Response?.json({ data: { token } });
    } catch (error) {
        return Response?.json({ error });
    }
};
