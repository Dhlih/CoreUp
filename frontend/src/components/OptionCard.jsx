import React from "react";

const OptionCard = ({ optionText }) => {
  return (
    <div className="flex items-center space-x-[2rem] bg-[#0F171B] p-4 rounded-lg">
      <input type="radio" name="radio-1" className="radio" />
      <p className=" opacity-80">{optionText}</p>
    </div>
  );
};

export default OptionCard;
