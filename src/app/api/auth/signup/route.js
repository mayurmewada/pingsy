import { dbConnect } from "@/db/dbConnection";
import userModel from "@/models/user_model";
const argon2 = require("argon2");

dbConnect();

export const POST = async (request) => {
    try {
        const reqBody = await request.json();
        const { username, email, password } = reqBody;
        const isUsernameExist = await userModel?.findOne({ username });

        if (isUsernameExist) return Response?.json({ status: 400, message: "username already exist" });

        const hashedPassword = await argon2.hash(password);
        await userModel?.create({ username, email, password: hashedPassword });

        return Response?.json({ status: 200, message: "User Registered Successfully" });
    } catch (error) {
        console.log(error);
        return Response?.json({ error });
    }
};
