import React from "react";
import Navbar from "../components/Navbar";
import Hero from "../components/Hero";
import About from "../components/About";
import AdoptFriend from "../components/AdoptFriend";
import FriendsCarousel from "../components/FriendsCarousel";
// import Footer from '../components/Footer'
const Home = () => {
  return (
    <div className="mb-20">
      <Navbar />
      <Hero />
      <About />
      <FriendsCarousel />
      <AdoptFriend />
    </div>
  );
};

export default Home;
