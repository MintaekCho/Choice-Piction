import { getServerSession } from "next-auth";
import { GET as authOptions } from "@/app/api/auth/[...nextauth]/route";

export const SessionProvider = async () => {
    const session = await getServerSession(authOptions);
    console.log(session);
    return { session };
}
