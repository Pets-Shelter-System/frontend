import logo from "../assets/logo.png";
import bgImg from "../assets/background.jpg";
import { motion, AnimatePresence } from "framer-motion";

const AuthLayout = ({ children }) => {
  const childType = children?.type?.displayName || children?.type?.name || "";
  const isSignUp = childType.toLowerCase() === "signup";

  return (
    <div
      className="min-h-screen w-full flex items-center justify-center bg-cover bg-no-repeat bg-center"
      style={{
        backgroundImage: `url(${bgImg})`,
      }}
    >
      <div className="flex justify-center items-center w-full px-4 py-6">
        <div
          className={`flex flex-col md:flex-row ${
            isSignUp ? "md:flex-row-reverse" : "md:flex-row"
          } 
          w-full max-w-5xl md:h-[500px] bg-white rounded-3xl shadow-2xl 
          max-h-[90vh] overflow-auto md:overflow-hidden`}
        >
          {/* الجزء الأول: اللوجو */}
          <div className="w-full md:w-1/2 flex justify-center items-center bg-[#011749] py-8 md:py-0">
            <motion.img
              key={isSignUp ? "logo-right" : "logo-left"}
              src={logo}
              alt="PETOPIA Logo"
              className="w-[180px] md:w-[280px] h-auto opacity-90"
              initial={{ opacity: 0, x: isSignUp ? 50 : -50 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: isSignUp ? -50 : 50 }}
              transition={{ duration: 0.6, ease: "easeInOut" }}
            />
          </div>

          {/* الجزء الثاني: الفورم */}
          <div className="w-full md:w-1/2 flex justify-center items-center py-6 md:py-0 px-4">
            <AnimatePresence mode="wait">
              <motion.div
                key={childType}
                className="w-full max-w-md"
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -30 }}
                transition={{ duration: 0.5, ease: "easeOut" }}
              >
                {children}
              </motion.div>
            </AnimatePresence>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AuthLayout;
