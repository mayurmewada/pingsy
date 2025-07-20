import { cookies } from "next/headers";
const jwt = require("jsonwebtoken");

export const auth = async (callback) => {
    try {
        const cookieStore = await cookies();
        const token = await cookieStore.get("token")?.value;
        const userId = await cookieStore.get("userId")?.value;

        const verifyToken = await jwt.verify(token, process.env.PINGSY_JWT);

        if (!verifyToken || verifyToken?.id !== userId) {
            cookieStore.set("token", "", {
                path: "/",
                maxAge: 0,
            });
            cookieStore.set("userId", "", {
                path: "/",
                maxAge: 0,
            });
            return Response.json({
                status: 401,
                message: "Unauthorized",
            });
        }

        return callback(verifyToken);
    } catch (error) {
        return Response.json({
            status: 401,
            message: error,
        });
    }
};
