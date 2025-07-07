import { dbConnect } from "@/db/dbConnection";
import userModel from "@/models/user_model";
import { cookies } from "next/headers";
const argon2 = require("argon2");
const jwt = require("jsonwebtoken");

dbConnect();

export const POST = async (request) => {
    try {
        const reqBody = await request.json();
        const { username, password } = reqBody;

        const isUserExist = await userModel?.findOne({ username });
        if (isUserExist === null) return Response?.json({ status: 400, message: "Invalid Credentials" });

        const isPasswordVerified = await argon2.verify(isUserExist?.password, password);
        if (!isPasswordVerified) return Response?.json({ status: 400, message: "Invalid Credentials" });

        const token = await jwt.sign(
            {
                email: isUserExist?.email,
                password: isUserExist?.password,
                username: username,
            },
            process.env.PINGSY_JWT,
            { expiresIn: "1h" }
        );
        await cookies().set({
            name: "pingsy",
            value: token,
            httpOnly: true,
            path: "/",
            secure: true,
            sameSite: "strict",
            maxAge: 60 * 60 * 24 * 7,
        });
        return Response?.json({ data: { token } });
    } catch (error) {
        return Response?.json({ error });
    }
};
