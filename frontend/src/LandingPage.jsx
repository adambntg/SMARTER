import React from "react";
import axios from "axios";
import Navbar from "./components/Navbar.jsx";
import Footer from "./components/Footer.jsx";
import logoSmartWater from "./assets/logosmartwater.png"; // Ensure the correct logo image is available
import BGlanding from "./assets/BGlanding.jpg"; // Ensure the correct logo image is available
import Adam from "./assets/Adam.jpg";
import Aqshal from "./assets/Aqshal.jpg";
import Cecep from "./assets/Cecep.jpg";
import { local_api_url } from "./query.js";

export default function LandingPage() {
  const vrombop = local_api_url("/login", {
    username: "nahl",
    password: "root",
  });

  console.log(vrombop);
  console.log("TEST");

  return (
    <>
      <Navbar transparent />
      <main>
        <div
          className="relative pt-16 pb-32 flex content-center items-center justify-center"
          style={{
            minHeight: "100vh", // Make sure the background takes up the full height of the viewport
          }}
        >
          <div
            className="absolute top-0 w-full h-full bg-center bg-cover"
            style={{
              backgroundImage: `url(${BGlanding})`,
              backgroundSize: "cover", // Ensure the background image covers the full section
              backgroundPosition: "center center", // Keep the image centered
            }}
          >
            <span
              id="blackOverlay"
              className="w-full h-full absolute opacity-75 bg-black"
            ></span>
          </div>
          <div className="container relative mx-auto">
            <div className="items-center flex flex-wrap">
              <div className="w-full lg:w-6/12 px-4 ml-auto mr-auto text-center">
                <div className="pr-12">
                  <h1 className="text-white font-semibold text-5xl">
                    Welcome to Smart Water
                  </h1>
                  <p className="mt-4 text-lg text-gray-300">
                    "Thank you for joining Smart Water! Together, we're making a
                    difference by conserving Earth's precious water resources.
                    Enjoy the journey of smarter, sustainable living!"
                  </p>
                </div>
              </div>
            </div>
          </div>

          <div
            className="top-auto bottom-0 left-0 right-0 w-full absolute pointer-events-none overflow-hidden"
            style={{ height: "70px" }}
          >
            <svg
              className="absolute bottom-0 overflow-hidden"
              xmlns="http://www.w3.org/2000/svg"
              preserveAspectRatio="none"
              version="1.1"
              viewBox="0 0 2560 100"
              x="0"
              y="0"
            >
              <polygon
                className="text-gray-300 fill-current"
                points="2560 0 2560 100 0 100"
              ></polygon>
            </svg>
          </div>
        </div>

        <section className="pb-20 -mt-24 bg-gray-300">
          <div className="container mx-auto px-4">
            <div className="flex flex-wrap">
              <div className="lg:pt-12 pt-6 w-full md:w-4/12 px-4 text-center">
                <div className="relative flex flex-col min-w-0 break-words bg-sky-200 w-full mb-8 shadow-lg rounded-lg">
                  <div className="px-4 py-5 flex-auto">
                    <div className="text-white p-3 text-center inline-flex items-center justify-center w-12 h-12 mb-5 shadow-lg rounded-full  bg-green-400">
                      <i className="fas fa-chart-line" />
                    </div>
                    <p className="mt-2 mb-4 text-gray-600">
                      Water Usage Monitoring and Controlling
                    </p>
                  </div>
                </div>
              </div>

              <div className="w-full md:w-4/12 px-4 text-center">
                <div className="relative flex flex-col min-w-0 break-words bg-sky-200 w-full mb-8 shadow-lg rounded-lg">
                  <div className="px-4 py-5 flex-auto">
                    <div className="text-white p-3 text-center inline-flex items-center justify-center w-12 h-12 mb-5 shadow-lg rounded-full  bg-green-400">
                      <i className="fas fa-tint" />
                    </div>
                    <p className="mt-2 mb-4 text-gray-600">
                      Efficient Water Usage
                    </p>
                  </div>
                </div>
              </div>

              <div className="pt-6 w-full md:w-4/12 px-4 text-center">
                <div className="relative flex flex-col min-w-0 break-words bg-sky-200 w-full mb-8 shadow-lg rounded-lg">
                  <div className="px-4 py-5 flex-auto">
                    <div className="text-white p-3 text-center inline-flex items-center justify-center w-12 h-12 mb-5 shadow-lg rounded-full bg-green-400">
                      <i className="fas fa-leaf" />
                    </div>
                    <p className="mt-2 mb-4 text-gray-600">
                      Contribution to UI GreenMetric
                    </p>
                  </div>
                </div>
              </div>
            </div>

            <div className="flex flex-wrap items-center mt-500 bg-teal-200">
              <div className="w-full md:w-5/12 px-4 mr-auto ml-auto">
                <h3 className="text-gray-700 text-3xl mb-2 font-semibold leading-normal">
                  Thank you for saving the water from earth!
                </h3>
              </div>

              <div className="w-full md:w-4/12 px-4 mr-auto ml-auto ">
                <div className="relative flex flex-col min-w-0 break-words bg-black w-full mb-6 shadow-lg rounded-lg ">
                  <img
                    alt="..."
                    //Ini nanti tempat buat naro chartnya//
                    src="https://images.unsplash.com/photo-1522202176988-66273c2fd55f?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=1051&q=80"
                    className="w-full align-middle rounded-t-lg"
                  />
                  <blockquote className="relative p-8 mb-4">
                    <svg
                      preserveAspectRatio="none"
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 583 95"
                      className="absolute left-0 w-full block"
                      style={{
                        height: "95px",
                        top: "-94px",
                      }}
                    >
                      <polygon
                        points="-30,95 583,95 583,65"
                        className="text-pink-100 fill-current"
                      ></polygon>
                    </svg>
                    <h4 className="text-xl font-bold text-white">
                      Total Water Volume
                    </h4>
                  </blockquote>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className="pt-20 pb-48 bg-teal-600">
          <div className="container mx-auto px-4">
            <div className="flex flex-wrap justify-center text-center mb-24">
              <div className="w-full lg:w-6/12 px-4">
                <h2 className="text-4xl font-semibold text-white">
                  Here are our developers
                </h2>
                <p className="text-lg leading-relaxed m-4 text-gray-800 text-5xl font-semibold">
                  3 Undergraduate Students majoring in Computer Engineering at
                  the University of Indonesia
                </p>
              </div>
            </div>
            <div className="flex flex-wrap justify-center">
              {/* Aqshal */}
              <div className="w-full md:w-6/12 lg:w-3/12 lg:mb-0 mb-12 px-4">
                <div className="px-6">
                  <img
                    alt="Aqshal"
                    src={Aqshal}
                    className="shadow-lg rounded-full max-w-full mx-auto"
                    style={{ maxWidth: "200px" }}
                  />
                  <div className="pt-6 text-center">
                    <h5 className="text-xl font-bold text-white">
                      Aqshal Ilham S
                    </h5>
                    <p className="mt-1 text-sm text-gray-700 uppercase font-semibold">
                      Frontend Developer
                    </p>
                    <div className="mt-6"></div>
                  </div>
                </div>
              </div>

              {/* Nahl */}
              <div className="w-full md:w-6/12 lg:w-3/12 lg:mb-0 mb-12 px-4">
                <div className="px-6">
                  <img
                    alt="Nahl Syahreza"
                    src={Cecep} // Menggunakan gambar Cecep
                    className="shadow-lg rounded-full max-w-full mx-auto"
                    style={{ maxWidth: "200px" }}
                  />
                  <div className="pt-6 text-center">
                    <h5 className="text-xl font-bold text-white">
                      Nahl Syahreza
                    </h5>
                    <p className="mt-1 text-sm text-gray-700 uppercase font-semibold">
                      Hardware Design
                    </p>
                    <div className="mt-6"></div>
                  </div>
                </div>
              </div>

              {/* Adam */}
              <div className="w-full md:w-6/12 lg:w-3/12 lg:mb-0 mb-12 px-4">
                <div className="px-6">
                  <img
                    alt="Adam"
                    src={Adam}
                    className="shadow-lg rounded-full max-w-full mx-auto"
                    style={{ maxWidth: "200px" }}
                  />
                  <div className="pt-6 text-center">
                    <h5 className="text-xl font-bold text-white">
                      Adam Bintang
                    </h5>
                    <p className="mt-1 text-sm text-gray-700 uppercase font-semibold">
                      Backend Developer
                    </p>
                    <div className="mt-6"></div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
