import { cookies } from "next/headers";
import Index from ".";

const Home = async () => {
    const cookie = await cookies();
    const pingsyCookie = cookie.get("pingsy");

    return <Index cookie={pingsyCookie?.value || false} />;
};

export default Home;
