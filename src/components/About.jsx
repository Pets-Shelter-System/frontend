import aboutImg from "../assets/about1.jpg";

const About = () => {
  return (
    <section className="flex flex-col md:flex-row items-center justify-center gap-10 md:gap-16 px-6 md:px-20 py-16 bg-white">
      <div className="relative flex items-center justify-center">
        <div
          className="flex items-center justify-center"
          style={{
            width: "251px",
            height: "377px",
            borderRadius: "400px",
            background: "linear-gradient(180deg, #011749 0%, #F4F4F4 100%)",
            padding: "10px",
            boxSizing: "border-box",
          }}
        >
          <img
            src={aboutImg}
            alt="About Petopia"
            style={{
              width: "100%",
              height: "100%",
              borderRadius: "400px",
              objectFit: "cover",
              display: "block",
            }}
          />
        </div>
      </div>

      <div className="max-w-lg text-center md:text-left ">
       <div className="flex">
         <h2 className="text-3xl font-bold text-[#011749] mb-4">
          About Petopia
        </h2>
<span
                role="img"
                aria-label="paw-icon"
                className="text-orange-500 text-3xl"
              >
                🐾
              </span>
       </div>
        <p className="text-[#87898C] leading-relaxed ">
          Welcome to Petopia — a place where compassion meets care.
          Our mission is to rescue abandoned animals, provide them with proper
          shelter, and help them find loving families.
          We believe every paw deserves a chance at happiness — that’s why we
          also offer a donation system to support shelters and a shop where
          every purchase helps feed and care for pets in need.
          Together, we can build a kinder world for animals — one adoption at a
          time. ❤️
        </p>
      </div>
    </section>
  );
};

export default About;
