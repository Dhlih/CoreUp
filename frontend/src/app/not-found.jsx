import Image from "next/image";
import Link from "next/link";

const NotFound = () => {
  return (
    <div className=" w-full flex px-40 py-[2rem]">
      <div className="w-full flex md:flex-row flex-col items-center justify-between ">
        {/* Text side */}
        <div className="md:order-1 order-2 text-center md:text-left">
          <p className="font-medium text-lg">404 Error!</p>
          <h1 className="text-4xl font-bold mt-[0.5rem]">
            Oops! : Page Not Found
          </h1>
          <p className="text-lg mt-[1rem]">
            Halaman ini tidak tersedia. Silakan periksa kembali alamat URL
          </p>

          <Link
            href="/"
            className="btn bg-[#3B82F6] hover:bg-[#3B82F6]/70 rounded-lg p-6 mt-[1.5rem] text-white"
          >
            Back to Home
          </Link>
        </div>

        {/* Image side */}
        <Image
          src="/images/404.png"
          width={500}
          height={500}
          alt="404 image"
          className="md:order-2 order-1"
        />
      </div>
    </div>
  );
};

export default NotFound;
