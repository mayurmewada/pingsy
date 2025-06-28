export const POST = async (request) => {
    try {
        const reqBody = await request.json();
        const { username, email, password } = reqBody;
        console.log(reqBody, request);
        return Response?.json({ data: { username, email, password } });
    } catch (error) {
        return Response?.json({ error });
    }
};
