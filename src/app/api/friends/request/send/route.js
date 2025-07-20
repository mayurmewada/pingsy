import { auth } from "@/lib/auth";
import userModel from "@/models/user_model";

const { dbConnect } = require("@/db/dbConnection");

dbConnect();

export const POST = (request) => {
    return auth(async (decoded) => {
        try {
            const req = await request.json();
            // const frienExist = await userModel.findOne({
            //     _id: req.id,
            //     friends: {
            //         $not: {
            //             $elemMatch: {
            //                 userId: decoded.id,
            //                 username: decoded.username,
            //             },
            //         },
            //     },
            // });
            const friendExist = await userModel.findOne({
                _id: decoded.id,
                friends: {
                    $elemMatch: {
                        userId: req.id,
                    },
                },
            });
            if (friendExist !== null) {
                return Response.json({ status: 400, message: "Friend already exists" });
            }
            console.log(friendExist);
            const reqSent = await userModel.updateOne(
                {
                    _id: req.id,
                    request: {
                        $not: {
                            $elemMatch: {
                                userId: decoded.id,
                                username: decoded.username,
                            },
                        },
                    },
                },
                {
                    $push: {
                        request: {
                            userId: decoded.id,
                            username: decoded.username,
                        },
                    },
                }
            );
            if (reqSent?.acknowledged) {
                if (reqSent?.modifiedCount === 1) {
                    return Response.json({ status: 200, message: "Friend request sent!", friendExist });
                } else if (reqSent?.modifiedCount === 0) {
                    return Response.json({ status: 200, message: "Friend request already sent!", friendExist });
                }
            }
        } catch (error) {
            return Response.json({ status: 500, message: error });
        }
    });
};
