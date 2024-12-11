import React, { useState, useEffect } from "react";
import { CircularProgressbar } from "react-circular-progressbar";
import "react-circular-progressbar/dist/styles.css";
import logoSmartWater from "./assets/logoSmartWater.png";
import axios from "axios";
// import blynk from "./models/blynk_conf";

function MainPage() {
  const AUTH_TOKEN = import.meta.env.VITE_AUTH_TOKEN;
  const [get_max_uptime, set_max_uptime] = useState(0);
  const [get_uptime, set_uptime] = useState(0);
  const [get_rotation, set_rotation] = useState(0);
  const [get_total_uptime, set_total_uptime] = useState(0);
  const [get_total_water_volume, set_total_water_volume] = useState(0.0);
  const [get_max_rotation, set_max_rotation] = useState(0);
  const [get_max_water_volume, set_max_water_volume] = useState(0);
  const [get_date, set_date] = useState("");

  const [get_history, set_history] = useState([]);

  const blynk_get_api = async (AUTH_TOKEN, PIN) => {
    return axios
      .get(`https://blynk.cloud/external/api/get?token=${AUTH_TOKEN}&v${PIN}`)
      .then((response) => {
        // console.log(`RECEIVED V${PIN}:`, response.data);
        return response.data;
      })
      .catch((error) => {
        console.error("Error: ", error);
        throw error;
      });
  };

  const blynk_update_api = async (AUTH_TOKEN, PIN, VALUE) => {
    return axios
      .get(
        `https://blynk.cloud/external/api/update?token=${AUTH_TOKEN}&v${PIN}=${VALUE}`
      )
      .then((response) => {
        // console.log(`SENT V${PIN}: `, VALUE);
        return VALUE;
      })
      .catch((error) => {
        console.error("Error: ", error);
        throw error;
      });
  };

  useEffect(() => {
    /** ENABLE THIS LATER */

    const renew = setInterval(async () => {
      // set_max_rotation(await blynk_get_api(AUTH_TOKEN, 2));
      // set_max_uptime(await blynk_get_api(AUTH_TOKEN, 4));
      // set_max_water_volume(await blynk_get_api(AUTH_TOKEN, 8));
      // set_rotation(await blynk_get_api(AUTH_TOKEN, 0));
      // set_uptime(await blynk_get_api(AUTH_TOKEN, 5));
      // set_total_water_volume(await blynk_get_api(AUTH_TOKEN, 6));
      // set_total_uptime(await blynk_get_api(AUTH_TOKEN, 3));
      // set_date(await blynk_get_api(AUTH_TOKEN, 7));
    }, 1000);

    const see_history = setInterval(async () => {
      // await axios
      //   .get("http://localhost:5000/smarter/get_all_record", {
      //     params: {
      //       auth_token: AUTH_TOKEN,
      //     },
      //   })
      //   .then((response) => {
      //     console.log(response.data.payload);
      //     set_history(response.data.payload);
      //   })
      //   .catch((error) => {
      //     console.log(error);
      //   });
    }, 1000);

    return () => {
      clearInterval(see_history);
      clearInterval(renew);
    };
  }, []);

  return (
    <div className="min-h-screen flex justify-center items-center shadow-[#333] p-10 font-mono">
      <div className="bg-[white] w-full max-w-[1200px] shadow-[0_4px_10px_rgba(0,0,0,0.1)] text-[#333] p-10 rounded-[15px]">
        {/* Logo */}
        <div className="flex w-auto justify-center text-center bg-white rounded mb-8 p-2.5">
          <img
            src={logoSmartWater}
            alt="SmartWater Logo"
            className="w-[150px] h-auto object-contain"
          />
        </div>
        <p className="text-[2rem] text-center font-semibold text-[#333] mb-[30px]">
          Dashboard
        </p>

        {/* Card Container */}
        <div className="grid grid-cols-[repeat(_auto-fill,minmax(280px,1fr)_)] gap-5 mb-10">
          {/* Total Uptime */}
          <div className="bg-[rgba(255,255,255,0.9)] shadow-[0_4px_8px_rgba(0,0,0,0.1)] text-center transition-all duration-[0.3s] ease-[ease-in-out] p-5 rounded-[10px] border-2 border-solid border-[#ddd] hover:-translate-y-2.5 hover:shadow-[0_6px_12px_rgba(0,0,0,0.2)] bg-[#f0f8ff]">
            <h3 className="text-xl font-semibold mb-[15px]">Total Uptime</h3>
            <p>{get_total_uptime}s</p>
          </div>

          {/* Total Water Volume */}
          <div className="bg-[rgba(255,255,255,0.9)] shadow-[0_4px_8px_rgba(0,0,0,0.1)] text-center transition-all duration-[0.3s] ease-[ease-in-out] p-5 rounded-[10px] border-2 border-solid border-[#ddd] hover:-translate-y-2.5 hover:shadow-[0_6px_12px_rgba(0,0,0,0.2)] bg-[#f9f5f2]">
            <h3 className="text-xl font-semibold mb-[15px]">
              Total Water Volume
            </h3>
            <p>{get_total_water_volume}L</p>
          </div>

          {/* Real-Time Uptime */}
          <div className="bg-[rgba(255,255,255,0.9)] shadow-[0_4px_8px_rgba(0,0,0,0.1)] text-center transition-all duration-[0.3s] ease-[ease-in-out] p-5 rounded-[10px] border-2 border-solid border-[#ddd] hover:-translate-y-2.5 hover:shadow-[0_6px_12px_rgba(0,0,0,0.2)] text-xl mb-2.5">
            <h3 className="text-xl font-semibold mb-[15px]">
              Real-Time Uptime
            </h3>
            <span className="text-[2rem] font-bold text-[#007bff] block mt-2.5">
              {get_uptime}s
            </span>
          </div>

          {/* Servo Rotation */}
          <div className="bg-[rgba(255,255,255,0.9)] shadow-[0_4px_8px_rgba(0,0,0,0.1)] text-center transition-all duration-[0.3s] ease-[ease-in-out] p-5 rounded-[10px] border-2 border-solid border-[#ddd] hover:-translate-y-2.5 hover:shadow-[0_6px_12px_rgba(0,0,0,0.2)] bg-[#e8f9f5] col-[span_2] min-h-[250px] flex justify-center items-center p-5">
            <p className="text-xl font-semibold mb-[15px]">Servo Rotation</p>
            <CircularProgressbar
              value={get_rotation}
              maxValue={180}
              text={get_rotation}
            />
          </div>

          {/* Max Rotation Slider */}
          <div className="bg-[rgba(255,255,255,0.9)] shadow-[0_4px_8px_rgba(0,0,0,0.1)] text-center transition-all duration-[0.3s] ease-[ease-in-out] p-5 rounded-[10px] border-2 border-solid border-[#ddd] hover:-translate-y-2.5 hover:shadow-[0_6px_12px_rgba(0,0,0,0.2)] bg-[#fff3e6]">
            <h3 className="text-xl font-semibold mb-[15px]">Max Rotation</h3>
            <input
              type="range"
              min="0"
              max="180"
              value={get_max_rotation}
              onChange={async (e) => {
                set_max_rotation(e.target.value);
                await blynk_update_api(AUTH_TOKEN, 2, e.target.value);
              }}
              className="w-[90%] h-2 appearance-none mx-0 my-2.5 rounded-[5px]"
            />
            <p>{get_max_rotation}°</p>
          </div>

          {/* Max Uptime Slider */}
          <div className="bg-[rgba(255,255,255,0.9)] shadow-[0_4px_8px_rgba(0,0,0,0.1)] text-center transition-all duration-[0.3s] ease-[ease-in-out] p-5 rounded-[10px] border-2 border-solid border-[#ddd] hover:-translate-y-2.5 hover:shadow-[0_6px_12px_rgba(0,0,0,0.2)] bg-[#fff3e6]">
            <h3 className="text-xl font-semibold mb-[15px]">Max Uptime</h3>
            <input
              type="range"
              min="0"
              max="3600"
              value={get_max_uptime}
              onChange={async (e) => {
                set_max_uptime(e.target.value);
                await blynk_update_api(AUTH_TOKEN, 4, e.target.value);
              }}
              className="w-[90%] h-2 appearance-none mx-0 my-2.5 rounded-[5px]"
            />
            <p>{get_max_uptime}s</p>
          </div>

          {/* Max Water Volume Slider */}
          <div className="bg-[rgba(255,255,255,0.9)] shadow-[0_4px_8px_rgba(0,0,0,0.1)] text-center transition-all duration-[0.3s] ease-[ease-in-out] p-5 rounded-[10px] border-2 border-solid border-[#ddd] hover:-translate-y-2.5 hover:shadow-[0_6px_12px_rgba(0,0,0,0.2)] bg-[#fff3e6]">
            <h3 className="text-xl font-semibold mb-[15px]">
              Max Water Volume
            </h3>
            <input
              type="range"
              min="0"
              max="100000"
              value={get_max_water_volume}
              onChange={async (e) => {
                set_max_water_volume(e.target.value);
                await blynk_update_api(AUTH_TOKEN, 8, e.target.value);
              }}
              className="w-[90%] h-2 appearance-none mx-0 my-2.5 rounded-[5px]"
            />
            <p>{get_max_water_volume}mL</p>
          </div>

          <div className="bg-[rgba(255,255,255,0.9)] shadow-[0_4px_8px_rgba(0,0,0,0.1)] text-center transition-all duration-[0.3s] ease-[ease-in-out] p-5 rounded-[10px] border-2 border-solid border-[#ddd] hover:-translate-y-2.5 hover:shadow-[0_6px_12px_rgba(0,0,0,0.2)] bg-[#fff3e6]">
            <h3 className="text-xl font-semibold mb-[15px]">Date</h3>
            <p>{get_date}</p>
          </div>
        </div>

        {/* Button On/Off */}
        {/* <div className="button-container">
          <button
            className={`button-control ${isOn ? "on" : "off"}`}
            onClick={toggleButton}
          >
            {isOn ? "Turn Off" : "Turn On"}
          </button>
        </div> */}

        {/* Date Picker */}
        {/* <div className="date-picker-container">
          <input type="date" className="date-picker" />
        </div> */}

        {/* Chart Section */}
        <div className="text-center bg-[rgba(255,255,255,0.1)] mt-10 p-5 rounded-[10px]">
          <p className="text-2xl font-semibold mb-5">Usage Trends</p>
          <p>{get_history.length}</p>
          {/* Chart content here */}
          <ul>
            {get_history.map((item, index) => {
              <li>
                <p>pro</p>;
              </li>;
            })}
          </ul>
        </div>
      </div>
    </div>
  );
}

export default MainPage;
