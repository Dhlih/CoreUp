import React from "react";

const OptionCard = ({ optionText }) => {
  return (
    <div className="flex items-center space-x-[3rem] bg-[#0F171B] p-5 rounded-xl">
      <input type="radio" name="radio-1" className="radio" />
      <p className="md:text-lg text-xl opacity-80">{optionText}</p>
    </div>
  );
};

export default OptionCard;
