"use client";
import { SessionProvider } from "next-auth/react"
import { Provider } from 'react-redux';
import store from "./redux/store";
import HomePage from "@/components/HomePage";


const Home = () => {

  return (
    <div>
      <Provider store={store}>
        <SessionProvider>
          <main className="bg-slate-950 w-full min-h-screen pb-10">
            <HomePage />
          </main>
        </SessionProvider>
      </Provider>

    </div >
  );
};

export default Home;