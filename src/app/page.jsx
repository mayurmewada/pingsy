import { cookies } from "next/headers";
import Index from ".";

const Home = async () => {
    const cookie = await cookies();
    const loggedInUserId = await cookie.get("userId");
    const pingsyCookie = await cookie.get("token");

    return <Index userId={loggedInUserId?.value || null} cookie={pingsyCookie?.value || false} />;
};

export default Home;
