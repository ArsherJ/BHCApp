'use client'
import Image from "next/image";
import Navbar from "./components/Navbar";
import AuthCard from "./components/modals/AuthModal";
import NewsUpdate from "./components/NewsUpdate";
import Hero from "./components/Hero";
import About from "./components/About";
import { useDispatch, useSelector } from "react-redux";
import { IRoot } from "./redux/interfaces";
//@ts-ignore
import axios from "axios";
import useVerification from "./hooks/api-hooks/useVerification";
import GlobalLoader from "./components/loaders/GlobalLoader";

export default function Home() {
  axios.defaults.withCredentials = true;
  const { isLoadingVerification } = useVerification();
  const showAuthModal = useSelector(
    (state: IRoot) => state.authModal.showModal
  );
  const userDetails = useSelector(
    (state: IRoot) => state.userDetails.userDetails
  );
  const globalLoading = useSelector(
    (state: IRoot) => state.globalLoading.globalLoading
  );

  return (
    <main className="flex min-h-screen flex-col" data-theme="lemonade">
      <Navbar />
      <Hero />
      <NewsUpdate />
      <About />
      {showAuthModal && <AuthCard />}
      {globalLoading && <GlobalLoader/>}
    </main>
  );
}
