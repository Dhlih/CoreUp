import Image from "next/image";
import Link from "next/link";

const NotFound = () => {
  return (
    <div className="h-screen w-full flex items-center justify-center px-[2rem]">
      <div className="max-w-[1300px] w-full flex md:flex-row flex-col items-center justify-between gap-8">
        {/* Text side */}
        <div className="space-y-[1rem] md:order-1 order-2 text-center md:text-left">
          <p className="font-medium text-xl">404 Error!</p>
          <h1 className="text-5xl font-bold">Oops! : Page Not Found</h1>
          <p className="text-xl">
            Halaman ini tidak tersedia. Silakan periksa kembali alamat URL
          </p>

          <Link href="/my-course">
            <button className="btn bg-[#3B82F6] text-lg rounded-lg p-6 mt-[1rem] text-white">
              Back to Home
            </button>
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
