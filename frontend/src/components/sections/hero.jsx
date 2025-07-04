"use client";

import Footer from "../Footer";
import { getSession } from "@/lib/session";
import { useEffect, useState } from "react";
import ErrorAlert from "../ErrorAlert";
import { useRouter } from "next/navigation";

export default function Hero() {
  const [user, setUser] = useState("");
  const [showAlert, setShowAlert] = useState(false);

  const router = useRouter();

  const checkSession = async () => {
    const session = await getSession;
    const user = setUser(session);

    if (!user) {
      setShowAlert(true);
      setTimeout(() => {
        setShowAlert(false);
      }, 1000);
    }

    router.push("/create-course");
  };

  return (
    <div>
      {showAlert && (
        <div className="fixed top-12 left-1/2 transform -translate-x-1/2 z-50">
          <ErrorAlert text="Login first!" />
        </div>
      )}

      <div
        className="hero min-h-screen"
        style={{
          backgroundImage: "url('/images/background.webp')",
        }}
      >
        <div className="hero-content text-center md:px-0 px-[1.5rem]">
          <div className="max-w-[600px]">
            <h1 className="md:text-5xl text-4xl font-bold leading-14">
              Experience The Excitement Of Learning Anything With CoreUp
            </h1>
            <p className="py-6  text-lg opacity-80">
              Get an automated learning roadmap, master your dream skills, and
              level up with a gamified system that makes learning more
              addictive!
            </p>
            <button
              className="btn bg-[#3B82F6] p-6 shadow-none rounded-lg mt-[1rem]"
              onClick={checkSession}
            >
              Learn Now →
            </button>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
}
