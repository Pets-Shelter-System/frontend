import React, { useState } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation } from "swiper/modules";

import "swiper/css";
import "swiper/css/navigation";

import friendsImg from "../assets/friends1.jpg";

const friendsData = [
  { name: "Cockapoo", image: friendsImg },
  { name: "Cockapoo", image: friendsImg },
  { name: "Cockapoo", image: friendsImg },
  { name: "Cockapoo", image: friendsImg },
  { name: "Cockapoo", image: friendsImg },
  { name: "Cockapoo", image: friendsImg },
];

const PetCard = ({ name, image }) => {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <div
      className="bg-white rounded-xl shadow-lg border border-gray-100 overflow-hidden w-full max-w-[280px] h-[400px] transition-shadow duration-300"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div className="h-3/4 flex items-center justify-center bg-white p-4">
        <img src={image} alt={name} className="w-full h-full object-cover" />
      </div>

      <div className="h-1/4 flex flex-col items-center justify-center p-3">
        <h3 className="text-xl font-bold text-[#E7A01C] mb-4 transition-colors duration-300">
          {name}
        </h3>

        <a
          href="#"
          className={`text-sm font-medium px-4 py-2 transition-all duration-300 ease-in-out whitespace-nowrap 
                        ${
                          isHovered
                            ? "bg-[#011749] text-[#E7A01C] rounded-full"
                            : "text-[#011749] border-2 border-dashed border-[#E7A01C] rounded-full hover:border-solid"
                        }`}
        >
          Learn More
        </a>
      </div>
    </div>
  );
};

const FriendsCarousel = () => {
  return (
    <section className="bg-[#F4F4F4] py-12 sm:py-20 overflow-hidden relative">
      <div className="text-center mb-10">
        <h1 className="text-2xl font-semibold text-[#011749] inline-block mb-1">
          Our Friends Who are Looking for a House
        </h1>
        <span
          role="img"
          aria-label="paw-icon"
          className="text-[#E7A01C] text-2xl ml-2"
        >
          🐾
        </span>
      </div>

      <div className="relative max-w-5xl mx-auto px-4">
        <Swiper
          modules={[Navigation]}
          breakpoints={{
            640: { slidesPerView: 2, spaceBetween: 6 },
            768: { slidesPerView: 3, spaceBetween: 8 },
            1024: { slidesPerView: 3, spaceBetween: 8 },
          }}
          slidesPerView={1.2}
          spaceBetween={6}
          centeredSlides={true}
          loop={true}
          navigation={{
            nextEl: ".swiper-button-next-custom",
            prevEl: ".swiper-button-prev-custom",
          }}
          className="mySwiper"
        >
          {friendsData.map((friend, index) => (
            <SwiperSlide key={index} className="flex justify-center py-4">
              <PetCard name={friend.name} image={friend.image} />
            </SwiperSlide>
          ))}
        </Swiper>
      </div>
      
      <div className="absolute top-1/2 left-0 right-0 transform -translate-y-1/2 z-10">
        <div className="max-w-6xl mx-auto flex justify-between px-4 sm:px-8 lg:px-20"> 
          <button
            className="swiper-button-prev-custom w-12 h-12 bg-[#E7A01C] rounded-full shadow-lg flex items-center justify-center text-white text-3xl font-bold cursor-pointer hover:bg-yellow-700 transition-colors"
            aria-label="Previous Slide"
          >
            &#10094;
          </button>

          <button
            className="swiper-button-next-custom w-12 h-12 bg-[#E7A01C] rounded-full shadow-lg flex items-center justify-center text-white text-3xl font-bold cursor-pointer hover:bg-yellow-700 transition-colors"
            aria-label="Next Slide"
          >
            &#10095;
          </button>
        </div>
      </div>
    </section>
  );
};

export default FriendsCarousel;