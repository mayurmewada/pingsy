import { auth } from "@/lib/auth";
import userModel from "@/models/user_model";

const { dbConnect } = require("@/db/dbConnection");

dbConnect();

export const GET = async (request, { params }) => {
    return auth(async (decoded) => {
        try {
            const req = await request;
            const param = await params;
            const searchText = await param.searchtext;

            const searchedUsers = await userModel.find({ username: { $regex: searchText, $options: "i" }, _id: { $ne: decoded?.id } }).select("_id username");
            return Response.json({ status: 200, data: searchedUsers });
        } catch (error) {
            return Response.json({ status: 500, error });
        }
    });
};
