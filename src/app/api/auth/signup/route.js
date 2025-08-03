import { dbConnect } from "@/db/dbConnection";
import userModel from "@/models/user_model";
const argon2 = require("argon2");

dbConnect();

export const POST = async (request) => {
    try {
        const reqBody = await request.json();
        const { values, key } = reqBody;
        const isUsernameExist = await userModel?.findOne({ username: values?.username });

        if (isUsernameExist) return Response?.json({ status: 400, message: "username already exist" });

        const hashedPassword = await argon2.hash(values?.password);
        await userModel?.create({ username: values?.username, email: values?.email, password: hashedPassword, privateKey: key?.privateKey, publicKey: JSON.stringify(key?.publicKey), iv: key?.iv });

        return Response?.json({ status: 200, message: "User Registered Successfully" });
    } catch (error) {
        console.log(error);
        return Response?.json({ error });
    }
};
