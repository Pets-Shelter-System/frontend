import { useState } from "react";
import dogAdoptImg from "../assets/adoptfriend.png";

const AdoptFriend = () => {
  const [isImgHovered, setIsImgHovered] = useState(false);
  const [isBtnHovered, setIsBtnHovered] = useState(false);

  const btnBg = isBtnHovered ? "#011749" : "#F4F4F4";
  const btnColor = isBtnHovered ? "#F4F4F4" : "#011749";

  return (
    <section
      className="bg-[#F4F4F4] py-16 px-4 mt-10 sm:px-8 lg:px-20"
      style={{ minHeight: "480px" }}
    >
      <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-center justify-center "> 
        
        <div className="w-full md:w-1/2 text-center md:text-left flex flex-col justify-center order-2 md:order-1">
          <div className="mx-auto md:mx-0 w-full max-w-lg">
            
            <div className="flex items-center justify-center md:justify-start mb-4">
              <h2 className="text-4xl font-bold text-[#011749] mr-3">
                Adopt a Friend
              </h2>
              <span
                role="img"
                aria-label="paw-icon"
                className="text-orange-500 text-3xl"
              >
                🐾
              </span>
            </div>
            
            <p className="text-[#87898C] leading-relaxed text-lg mb-7">
              At Petopia, adoption means giving a second chance to a loyal
              companion. We make the process simple — browse our list of
              adorable pets, meet them, and bring home a new best friend. Each
              adoption saves a life and opens space for another rescue. Click
              the button below to explore available pets and start your
              <br />
              adoption journey today.
            </p>
          </div>
        </div>
        
        <div
          className="relative w-full max-w-xs sm:max-w-sm md:max-w-[317px] md:w-[317px] flex items-center justify-center order-1 md:order-2"
          onMouseEnter={() => setIsImgHovered(true)}
          onMouseLeave={() => {
            setIsImgHovered(false);
            setIsBtnHovered(false);
          }}
        >
          <img
            src={dogAdoptImg}
            alt="Dog for Adoption"
            className={`object-cover rounded-lg transition-all duration-300 w-full h-auto ${ 
              isImgHovered ? "blur-[1.1px]" : ""
            }`}
            style={{ maxHeight: '474px' }} 
          />
          
          <button
            onMouseEnter={() => setIsBtnHovered(true)}
            onMouseLeave={() => setIsBtnHovered(false)}
            className={`absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 px-4 py-2 rounded-full text-base font-medium transition-all duration-300 transform inline-flex whitespace-nowrap`}
            style={{
              opacity: isImgHovered ? 1 : 0,
              pointerEvents: isImgHovered ? "auto" : "none",
              scale: isImgHovered ? 1 : 0.98,
              backgroundColor: btnBg,
              color: btnColor,
              boxShadow: "0 4px 15px rgba(0,0,0,0.13)",
            }}
          >
            Find A Friend
          </button>
        </div>
      </div>
    </section>
  );
};

export default AdoptFriend;