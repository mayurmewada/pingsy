import { auth } from "@/lib/auth";
import userModel from "@/models/user_model";

const { dbConnect } = require("@/db/dbConnection");

dbConnect();

export const GET = () => {
    return auth(async (decoded) => {
        try {
            const user = await userModel.findOne({ _id: decoded?.id }).select("request");
            const requests = user?.request || [];
            const hasUnread = requests.some((request) => request?.isUnread === true);

            return Response.json({ status: 200, data: requests, hasUnread });
        } catch (error) {
            return Response.json({ status: 500, message: error });
        }
    });
};

export const PATCH = () => {
    return auth(async (decoded) => {
        try {
            const user = await userModel.findOne({ _id: decoded?.id }).select("request");
            const requests = (user?.request || []).map((request) => ({
                ...request,
                isUnread: false,
            }));

            await userModel.findOneAndUpdate(
                { _id: decoded?.id },
                { $set: { request: requests } },
                { new: true, runValidators: true }
            );

            return Response.json({ status: 200, message: "Friend requests marked as read" });
        } catch (error) {
            return Response.json({ status: 500, message: error });
        }
    });
};
