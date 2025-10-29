import logo from "../assets/logo.png";
import bgImg from "../assets/Abstract geometric elegant blue modern pattern colorful background _ Premium Vector.jpeg.jpg"

const AuthLayout = ({ children }) => {
  return (
    <div
      className="min-h-screen w-full flex items-center justify-center"
      style={{
        backgroundImage: `url(${bgImg})`,
        // backgroundSize: "cover",
        // backgroundRepeat: 'no-repeat',
        // backgroundPosition: "center",
        objectFit: 'cover',
        width: '100%',
        // filter: 'blur(0px)',
        height: '100vh'
      }}
    >
      <div className="flex w-[90%] max-w-5xl bg-white/80 rounded-3xl shadow-2xl items-center justify-between overflow-hidden">
        <div className="flex-1 hidden md:flex justify-center items-center bg-[#152441] h-full py-16">
          <img
            src={logo}
            alt="PETOPIA Logo"
            className="w-[280px] h-auto opacity-90"
          />
        </div>
        <div className="flex-1 flex justify-center items-center px-8 py-8">
          {children}
        </div>
      </div>
    </div>
  );
};

export default AuthLayout;
