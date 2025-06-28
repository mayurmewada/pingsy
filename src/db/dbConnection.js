import mongoose from "mongoose";

export const dbConnect = async () => {
    try {
        const url = process?.env?.MONGO_URI || "";
        mongoose?.connect(url);
        const connection = mongoose?.connection;
        connection.on("connected", () => {
            console.log("✔ db connection successfull");
        });
        connection.on("error", (error) => {
            console.log("✖ db connection failed " + error);
            process.exit();
        });
    } catch (error) {
        console.log("Something went wrong when connecting to DB");
        console.log(error);
    }
};
