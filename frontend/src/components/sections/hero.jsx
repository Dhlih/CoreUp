import Footer from "../Footer";
import Link from "next/link";

export default function Hero() {
  return (
    <div>
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
            <Link
              href="/create-course"
              className="btn bg-[#3B82F6] p-6 shadow-none rounded-lg mt-[1rem]"
            >
              Learn Now →
            </Link>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
}
