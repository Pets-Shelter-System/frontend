import React from "react";
import Navbar from "../components/Navbar";
import Hero from "../components/Hero";
import About from "../components/About";
import AdoptFriend from "../components/AdoptFriend";
import FriendsCarousel from "../components/FriendsCarousel";
import Recommended from "../components/Recommended";
import Footer from "../components/Footer";
// import Footer from '../components/Footer'
const Home = () => {
  return (
    <div className="   flex flex-col gap-28 w-screen overflow-x-hidden ">
       
      <Hero />
      <About />
      <FriendsCarousel />
      <AdoptFriend />
      <Recommended />
       
    </div>
  );
};

export default Home;
