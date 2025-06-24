import Link from "next/link";

const CompletionPage = ({ courseTitle }) => {
  return (
    <div className="py-[2rem] flex px-32 space-x-[2rem]">
      <img src="/images/completion.png" className="w-130 h-130" alt="" />
      <div className="space-y-[0.7rem] pt-[3rem]">
        <h1 className="text-4xl font-bold">Congratulations !</h1>
        <p>
          Keep up your good work and continue learning — you're on the right
          track!
        </p>

        <div className="space-y-[1rem] mt-[1.5rem]">
          {/* level progression */}
          <div>
            <label htmlFor="" className="font-semibold text-lg">
              Level Progress
            </label>
            <div className="flex justify-between  mt-[0.5rem] text-sm">
              <span>1</span>
              <span>2</span>
            </div>
            <progress
              className="progress w-full "
              value={50}
              max={100}
            ></progress>
          </div>

          {/* course progression */}
          <div>
            <label htmlFor="" className="font-semibold text-lg">
              Course Progress
            </label>
            <div className="flex justify-between mt-[0.5rem] text-sm">
              <span>20%</span>
              <span>100%</span>
            </div>
            <progress
              className="progress w-full "
              value={50}
              max={100}
            ></progress>
          </div>

          <Link href={`/my-courses/${courseTitle}`}>
            <button className="bg-[#3B82F6] py-3 px-4 rounded-lg cursor-pointer hover:bg-[#3B82F6]/70 mt-[1.2rem]">
              Back to Course
            </button>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default CompletionPage;
