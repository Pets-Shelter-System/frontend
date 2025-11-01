import hero1 from "../assets/hero1.png";
import hero2 from "../assets/hero2.jpg";
import hero3 from "../assets/hero3.jpg";
import hero4 from "../assets/hero4.jpg";

const Hero = () => {
  return (
    <section
      className="text-center py-20 relative overflow-hidden bg-cover bg-center bg-no-repeat mb-20"
      style={{
        backgroundImage: `url(${hero1})`,
        backgroundSize: "cover",
      }}
    >
      <div className="relative z-10">
        {/* Title */}
        <h1 className="font-baloo text-4xl md:text-5xl font-bold mb-12 leading-tight text-[#011749]">
          Give Love <span>. Adopt a</span> <br /> Friend For Life
        </h1>

        {/* Subtext */}
        <p className="text-[#011749] mb-10 text-lg max-w-xl mx-auto">
          Find your furry companion and change a life today
        </p>

        {/* Buttons */}
        <div className="flex justify-center gap-6 md:gap-16 mb-14 mt-10 flex-wrap">
          <button className="bg-[#011749] text-white flex items-center gap-2 px-6 py-2 rounded-full hover:scale-105 transition">
            🐾 Explore Pets
          </button>
          <button className="bg-[#011749] text-white flex items-center gap-2 px-6 py-2 rounded-full hover:scale-105 transition">
            ❤️ Donate Now
          </button>
        </div>

        {/* Images */}
        <div className="flex justify-center items-center gap-6 md:gap-10 flex-wrap">
          <img
            src={hero2}
            alt="Pet 1"
            className="rounded-2xl rotate-[-12deg] shadow-lg"
            style={{ width: "215px", height: "285px" }}
          />
          <img
            src={hero3}
            alt="Pet 2"
            className="rounded-2xl md:mt-10 shadow-lg"
            style={{ width: "286px", height: "189px" }}
          />
          <img
            src={hero4}
            alt="Pet 3"
            className="rounded-2xl rotate-[12deg] shadow-lg"
            style={{ width: "215px", height: "285px" }}
          />
        </div>
      </div>
    </section>
  );
};

export default Hero;
