import Link from "next/link";

const NotFound = () => {
  return (
    <div className=" w-full flex md:px-40 px-[1.5rem] py-[2rem]">
      <div className="w-full flex flex-col items-center justify-between ">
        <img
          src="/images/404.webp"
          className="w-[24rem] h-[24rem]"
          alt="404 image"
        />

        <a
          href="https://storyset.com/web"
          className="text-sm text-white/70 mt-[-1rem]"
        >
          Web illustrations by Storyset
        </a>

        <h1 className="text-2xl md:text-4xl font-bold mt-[1rem] text-center mb-[1.5rem]">
          Oops! : Page Not Found
        </h1>

        <Link
          href="/"
          className="btn bg-[#3B82F6] hover:bg-[#3B82F6]/70 rounded-lg p-6  text-white "
        >
          Back to Home
        </Link>
      </div>
    </div>
  );
};

export default NotFound;
