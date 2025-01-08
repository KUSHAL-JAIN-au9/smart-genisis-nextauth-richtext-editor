import { useSession } from "next-auth/react";
import Todo from "./editor/NotePicker"
import Notes from "./editor/Notes"
import UserButton from "./user-button"
import { useEffect } from "react";
import { Loader } from "lucide-react";
import { useRouter } from "next/navigation";


const HomePage = () => {
    const router = useRouter();
    const { data: session, status } = useSession();

    useEffect(() => {
        if (status === 'unauthenticated' || session === null) {

            router.push("/sign-in")
        }
    }, [status, session, router]);

    if (!session) {
        return <div className="h-screen flex  justify-center items-center"> <Loader className="size-6 mr-4 mt-4 float-right animate-spin text-white" /> </div>;
    }
    return (
        <>
            <UserButton />
            <Todo />
            <Notes />
        </>
    )
}

export default HomePage