"use client";
import { SessionProvider } from "next-auth/react"
import UserButton from "@/components/user-button";
import Notes from "@/components/editor/Notes";
import Todo from "@/components/editor/NotePicker";
import { Provider } from 'react-redux';
import store from "./redux/store";


const Home = () => {
  return (
    <div>
      <Provider store={store}>
        <SessionProvider>
          <main className="bg-slate-950 w-full min-h-screen pb-10">
            <UserButton />
            <Todo />
            <Notes />
          </main>
        </SessionProvider>
      </Provider>

    </div >
  );
};

export default Home;