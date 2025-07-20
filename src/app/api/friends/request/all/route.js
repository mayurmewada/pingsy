import { auth } from "@/lib/auth";
import userModel from "@/models/user_model";

const { dbConnect } = require("@/db/dbConnection");

dbConnect();

export const GET = () => {
    return auth(async (decoded) => {
        try {
            const request = await userModel.find({ _id: decoded?.id }).select("request");
            return Response.json({ status: 200, data: request?.[0]?.request });
        } catch (error) {
            return Response.json({ status: 500, message: error });
        }
    });
};
