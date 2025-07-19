import userModel from "@/models/user_model";

const { dbConnect } = require("@/db/dbConnection");
const { cookies } = require("next/headers");
const jwt = require("jsonwebtoken");

dbConnect();

export const GET = async (request) => {
    try {
        const cookieStore = await cookies();
        const token = await cookieStore?.get("token")?.value;
        const validToken = await jwt.verify(token, process.env.PINGSY_JWT);
        if (!validToken) {
            await cookies().set("token", "", {
                path: "/",
                maxAge: 0,
            });
            return Response.json({ status: 400, message: "Something went wrong" });
        }
        const user = await userModel.findOne({ _id: validToken.id });
        return Response.json({ status: 200, data: user?.friends });
    } catch (error) {
        console.log(error);
        return Response.json({ error });
    }
};
