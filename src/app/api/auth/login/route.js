import { dbConnect } from "@/db/dbConnection";
import userModel from "@/models/user_model";
import { base64ToUint8Array } from "@/utils/helperFunction";
import { cookies } from "next/headers";
const argon2 = require("argon2");
const jwt = require("jsonwebtoken");

dbConnect();

export const POST = async (request) => {
    const cookieStore = await cookies();
    try {
        const reqBody = await request.json();
        const { username, password } = reqBody;

        const isUserExist = await userModel?.findOne({ username });
        if (isUserExist === null) return Response?.json({ status: 400, message: "Invalid Credentials" });

        const isPasswordVerified = await argon2.verify(isUserExist?.password, password);
        if (!isPasswordVerified) return Response?.json({ status: 400, message: "Invalid Credentials" });

        const token = await jwt.sign(
            {
                id: isUserExist?._id,
                email: isUserExist?.email,
                password: isUserExist?.password,
                username: username,
            },
            process.env.PINGSY_JWT,
            { expiresIn: "7d" }
        );
        const cookieUserId = await cookieStore?.set({
            name: "userId",
            value: isUserExist?._id,
            httpOnly: true,
            path: "/",
            secure: true,
            sameSite: "strict",
            maxAge: 60 * 60 * 24 * 7,
        });
        const cookieToken = await cookieStore?.set({
            name: "token",
            value: token,
            httpOnly: true,
            path: "/",
            secure: true,
            sameSite: "strict",
            maxAge: 60 * 60 * 24 * 7,
        });
        const cookiePublicKey = await cookieStore?.set({
            name: "publicKey",
            value: base64ToUint8Array(isUserExist?.publicKey),
            httpOnly: true,
            path: "/",
            secure: true,
            sameSite: "strict",
            maxAge: 60 * 60 * 24 * 7,
        });
        return Response?.json({ data: { token, userId: isUserExist?._id, publicKey: String(Object.values(base64ToUint8Array(isUserExist?.publicKey))), privateKey: isUserExist?.privateKey, privateKeyHelper: isUserExist?.iv } });
    } catch (error) {
        return Response?.json({ error });
    }
};
