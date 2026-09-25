import React from "react";
import NavigationBar from "../Components/NavigationBar";
import Hero from "../Components/Hero";
import Services from "../Components/Services";
import About from "../Components/About";
import Barbers from "../Components/Barbers";
import Booking from "../Components/Bookings";

const HomePage = () => {
  return (
    <div>
      <NavigationBar />
      <main>
        <Hero />
        <Services />
        <About />
        <Barbers />
        <Booking />
      </main>
    </div>
  );
};

export default HomePage;
