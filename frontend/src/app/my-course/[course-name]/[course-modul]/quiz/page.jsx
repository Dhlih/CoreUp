import { LuClock5 } from "react-icons/lu";

const Quiz = () => {
  return (
    <div className="max-w-[1350px] mx-auto mt-[5rem] pb-[5rem]">
      <div className="flex items-center justify-between">
        <h1 className="font-medium text-3xl ">Quiz</h1>

        {/* timer */}
        <div className="flex items-center space-x-[0.8rem] bg-[#0F171B] px-10 py-3 rounded-full">
          <LuClock5 />
          <span>02:05</span>
        </div>
      </div>

      {/* progress */}
      <div className="my-[1rem]">{/* <span>Pertanyaan 4/5</span> */}</div>

      {/* question */}
      <p className="text-3xl font-bold max-w-[80%] leading-12">
        Lorem ipsum dolor, sit amet consectetur adipisicing elit. Adipisci
        explicabo qui temporibus ea nemo sunt delectus rerum dolores labore hic?
      </p>

      {/* answer option */}
      <div className="mt-[2rem] rounded-md space-y-[2rem]">
        <div className="flex items-center space-x-[3rem] bg-[#0F171B] p-5 rounded-xl">
          <input type="radio" name="radio-1" className="radio" />
          <p className="text-lg">
            Lorem ipsum dolor, sit amet consectetur adipisicing elit.
            Perspiciatis, ipsum.
          </p>
        </div>

        <div className="flex items-center space-x-[3rem] bg-[#0F171B] p-5 rounded-xl">
          <input type="radio" name="radio-1" className="radio" />
          <p className="text-lg">
            Lorem ipsum dolor, sit amet consectetur adipisicing elit.
            Perspiciatis, ipsum.
          </p>
        </div>

        <div className="flex items-center space-x-[3rem] bg-[#0F171B] p-5 rounded-xl">
          <input type="radio" name="radio-1" className="radio" />
          <p className="text-lg">
            Lorem ipsum dolor, sit amet consectetur adipisicing elit.
            Perspiciatis, ipsum.
          </p>
        </div>

        <div className="flex items-center space-x-[3rem] bg-[#0F171B] p-5 rounded-xl">
          <input type="radio" name="radio-1" className="radio" />
          <p className="text-lg">
            Lorem ipsum dolor, sit amet consectetur adipisicing elit.
            Perspiciatis, ipsum.
          </p>
        </div>
      </div>

      <div className="flex justify-between items-center mt-[3rem]">
        <button className="btn bg-[#3B82F6] py-6 px-12 rounded-lg text-lg  max-w-[200px]">
          Previous
        </button>
        <button className="btn bg-[#3B82F6] py-6 px-12 rounded-lg text-lg  max-w-[200px]">
          Next
        </button>
      </div>
    </div>
  );
};

export default Quiz;
