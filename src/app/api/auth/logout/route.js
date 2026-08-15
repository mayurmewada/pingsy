import { cookies } from "next/headers";

export const DELETE = async () => {
    try {
        const cookieStore = await cookies();
        await cookieStore?.delete("userId", { path: "/" });
        await cookieStore?.delete("token", { path: "/" });
        await cookieStore?.delete("publicKey", { path: "/" });
        await cookieStore?.delete("privateKey", { path: "/" });
        return Response?.json({ status: 200, message: "Logout successful" });
    } catch (error) {
        return Response?.json({ error });
    }
};
