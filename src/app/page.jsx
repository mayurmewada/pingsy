import { cookies } from "next/headers";
import Index from ".";

const Home = async () => {
    const cookie = await cookies();
    const loggedInUserId = await cookie.get("userId");
    const token = await cookie.get("token");
    const privateKey = await cookie.get("privateKey");
    const publicKey = await cookie.get("publicKey");

    return <Index userId={loggedInUserId?.value || null} cookie={token?.value || false} privateKey={privateKey?.value || null} publicKey={publicKey?.value || null} />;
};

export default Home;
