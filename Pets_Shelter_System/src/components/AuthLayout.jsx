import logo from "../assets/logo.png";
import bgImg from "../assets/background.jpg";
import { motion, AnimatePresence } from "framer-motion";
import login from "../pages/Login.jsx";
const AuthLayout = ({ children }) => {
 const childType = children?.type?.displayName || children?.type?.name || "";
const isSignUp = childType.toLowerCase() === "signup";

  return (
    <div
      className="min-h-screen w-full flex items-center justify-center"
      style={{
        backgroundImage: `url(${bgImg})`,
        backgroundSize: "cover",
        backgroundRepeat: 'no-repeat',
        // backgroundPosition: "center",
        objectFit: 'cover',
        width: '100%',
        // filter: 'blur(0px)',
        height: '100vh'
      }}
    >
   

<div className="flex justify-center items-center h-fit  ">
  <div className={`flex w-[100%] max-w-5xl h-[500px] rounded-3xl bg-white   overflow-hidden 
        ${isSignUp ? "flex-row-reverse" : "flex-row"}`}>
    
    {/* النصف الأول: اللوجو */}
    <div className="w-1/2 flex justify-center items-center bg-[#011749]">
      <motion.img
              key={isSignUp ? "logo-right" : "logo-left"}
              src={logo}
              alt="PETOPIA Logo"
              className="w-[280px] h-auto opacity-90"
              initial={{ opacity: 0, x: isSignUp ? 50 : -50 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: isSignUp ? -50 : 50 }}
              transition={{ duration: 0.6, ease: "easeInOut" }}
            />
    </div>

    {/* النصف الثاني: الأطفال */}
    <div className="w-1/2 flex justify-center items-center">
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
