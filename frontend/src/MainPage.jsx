import React, { useState, useEffect } from "react";
import { CircularProgressbar } from "react-circular-progressbar";
import "react-circular-progressbar/dist/styles.css";
import logoSmartWater from "./assets/logosmartwater.png";
import axios from "axios";
import { Chart as ChartJS } from "chart.js/auto";
import { Bar, Doughnut, Line } from "react-chartjs-2";
// import blynk from "./models/blynk_conf";
import { deploy_api_url, blynk_get_api } from "./query";
import { format } from "date-fns";

function MainPage() {
  const AUTH_TOKEN = import.meta.env.VITE_AUTH_TOKEN;
  const [get_max_uptime, set_max_uptime] = useState(0);
  const [get_uptime, set_uptime] = useState(0);
  const [get_water_volume, set_water_volume] = useState(0);
  const [get_rotation, set_rotation] = useState(0);
  const [get_total_uptime, set_total_uptime] = useState(0);
  const [get_total_water_volume, set_total_water_volume] = useState(0.0);
  const [get_max_rotation, set_max_rotation] = useState(0);
  const [get_max_water_volume, set_max_water_volume] = useState(0);
  const [get_date, set_date] = useState("");
  const [get_override_mode, set_override_mode] = useState(0);

  const [get_history, set_history] = useState([]);
  const [get_owned, set_owned] = useState([]);

  // const blynk_get_api = async (AUTH_TOKEN, PIN) => {
  //   return axios
  //     .get(`https://blynk.cloud/external/api/get?token=${AUTH_TOKEN}&v${PIN}`)
  //     .then((response) => {
  //       // console.log(`RECEIVED V${PIN}:`, response.data);
  //       return response.data;
  //     })
  //     .catch((error) => {
  //       console.error("Error: ", error);
  //       throw error;
  //     });
  // };

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

    const PIN = {
      v2: true, // MAX_ROTATION
      v4: true, // MAX_UPTIME
      v8: true, // MAX_WATER_VOLUME
      v0: true, // ROTATION
      v5: true, // UPTIME
      v1: true, // WATER_VOLUME
      v6: true, // TOTAL_WATER_VOLUME
      v3: true, // TOTAL_UPTIME
      v7: true, // DATE
      // v10: true, // OVERRIDE_MODE
    };

    const renew = setInterval(async () => {
      blynk_get_api(AUTH_TOKEN, PIN)
        .then((response) => {
          set_max_rotation(response["v2"]);
          set_max_uptime(response["v4"]);
          set_max_water_volume(response["v8"]);
          set_rotation(response["v0"]);
          set_uptime(response["v5"]);
          set_water_volume(response["v1"]);
          set_total_water_volume(response["v6"]);
          set_total_uptime(response["v3"]);
          set_date(response["v7"]);
        })
        .catch((error) => {
          console.log(error);
        });
      // set_max_rotation(await blynk_get_api(AUTH_TOKEN, 2));
      // set_max_uptime(await blynk_get_api(AUTH_TOKEN, 4));
      // set_max_water_volume(await blynk_get_api(AUTH_TOKEN, 8));
      // set_rotation(await blynk_get_api(AUTH_TOKEN, 0));
      // set_uptime(await blynk_get_api(AUTH_TOKEN, 5));
      // set_total_water_volume(await blynk_get_api(AUTH_TOKEN, 6));
      // set_total_uptime(await blynk_get_api(AUTH_TOKEN, 3));
      // set_date(await blynk_get_api(AUTH_TOKEN, 7));
      // set_override_mode(await blynk_get_api(AUTH_TOKEN, 10));
    }, 5000);

    const see_history = setInterval(() => {
      deploy_api_url("/get_all_record", {
        auth_token: AUTH_TOKEN,
      })
        .then((data) => {
          console.log(data.payload);
          set_history(data.payload);
        })
        .catch((error) => {
          console.log(error);
        });
    }, 1000);

    const test_ddown = setInterval(() => {
      deploy_api_url("/owned", {
        owner: "nahl",
      })
        .then((data) => {
          // console.log(data);
          set_owned(data.payload);
        })
        .catch((error) => {
          console.log(error);
        });
    }, 1000);

    return () => {
      clearInterval(see_history);
      clearInterval(renew);
      clearInterval(test_ddown);
    };
  }, []);

  const fmt_date = (unfmt_date) => {
    const date = new Date(unfmt_date);
    return format(date, "yyyy-MM-dd");
  };

  const dates = get_history.map((element) => fmt_date(element.date));
  const total_uptimes = get_history.map((element) => element.total_uptime);
  const total_water_volumes = get_history.map(
    (element) => element.total_water_volume
  );

  return (
    <div className="min-h-screen flex justify-center items-center shadow-[#333] p-10 font-sans">
      <div className="bg-[white] w-full max-w-[1200px] shadow-[0_4px_10px_rgba(0,0,0,0.1)] text-[#333] p-10 rounded-[15px]">
        {/* Logo */}
        <div className="flex w-auto justify-center text-center bg-white rounded mb-8 p-2.5">
          <img
            src={logoSmartWater}
            alt="SmartWater Logo"
            className="w-[150px] h-auto object-contain"
          />
        </div>
        <p className="text-[2rem] text-center font-semibold text-[#333] my-10">
          Dashboard
        </p>

        <div className="flex justify-center my-5">
          <select className="font-bold">
            {get_owned.map((element, index) => {
              return (
                <option key={index} value={element.auth_token}>
                  {element.auth_token}
                </option>
              );
            })}
          </select>
        </div>

        {/* Card Container */}
        <div className="grid gap-5 mb-10">
          {/* Total Uptime */}
          <div className="flex justify-between">
            <div className="bg-[rgba(255,255,255,0.9)] shadow-[0_4px_8px_rgba(0,0,0,0.1)] text-center transition-all duration-[0.3s] ease-[ease-in-out] p-5 rounded-[10px] border-2 border-solid border-[#ddd] hover:-translate-y-2.5 hover:shadow-[0_6px_12px_rgba(0,0,0,0.2)] bg-[#f0f8ff] w-full h-full mx-2.5">
              <h3 className="text-xl font-semibold mb-[15px]">Total Uptime</h3>
              <p>{get_total_uptime}s</p>
            </div>
            {/* Total Water Volume */}
            <div className="bg-[rgba(255,255,255,0.9)] shadow-[0_4px_8px_rgba(0,0,0,0.1)] text-center transition-all duration-[0.3s] ease-[ease-in-out] p-5 rounded-[10px] border-2 border-solid border-[#ddd] hover:-translate-y-2.5 hover:shadow-[0_6px_12px_rgba(0,0,0,0.2)] bg-[#f9f5f2] w-full h-full mx-2.5">
              <h3 className="text-xl font-semibold mb-[15px]">
                Total Water Volume
              </h3>
              <p>{get_total_water_volume}L</p>
            </div>
            {/* Real-Time Uptime */}
            <div className="bg-[rgba(255,255,255,0.9)] shadow-[0_4px_8px_rgba(0,0,0,0.1)] text-center transition-all duration-[0.3s] ease-[ease-in-out] p-5 rounded-[10px] border-2 border-solid border-[#ddd] hover:-translate-y-2.5 hover:shadow-[0_6px_12px_rgba(0,0,0,0.2)] text-xl mb-2.5 w-full h-full mx-2.5">
              <h3 className="text-xl font-semibold mb-[15px]">RT Uptime</h3>
              <span className="text-[1.5rem] font-bold text-[#007bff] block mt-2.5">
                {get_uptime}s
              </span>
            </div>
            <div className="bg-[rgba(255,255,255,0.9)] shadow-[0_4px_8px_rgba(0,0,0,0.1)] text-center transition-all duration-[0.3s] ease-[ease-in-out] p-5 rounded-[10px] border-2 border-solid border-[#ddd] hover:-translate-y-2.5 hover:shadow-[0_6px_12px_rgba(0,0,0,0.2)] text-xl mb-2.5 w-full h-full mx-2.5">
              <h3 className="text-xl font-semibold mb-[15px]">
                RT Water Volume
              </h3>
              <span className="text-[1.5rem] font-bold text-[#007bff] block mt-2.5">
                {get_water_volume}mL
              </span>
            </div>
          </div>

          {/* Servo Rotation */}
          <div className="flex justify-center">
            <div className="bg-[rgba(255,255,255,0.9)] shadow-[0_4px_8px_rgba(0,0,0,0.1)] text-center transition-all duration-[0.3s] ease-[ease-in-out] p-5 rounded-[10px] border-2 border-solid border-[#ddd] hover:-translate-y-2.5 hover:shadow-[0_6px_12px_rgba(0,0,0,0.2)] bg-[#e8f9f5] h-full w-1/2 grid">
              <p className="text-xl font-semibold mb-[15px]">Servo Rotation</p>
              <CircularProgressbar
                value={get_rotation}
                maxValue={180}
                text={get_rotation}
                className="h-[250px] w-[200px] mx-auto"
              />
            </div>
          </div>

          <div className="flex justify-between">
            {/* Max Rotation Slider */}
            <div className="bg-[rgba(255,255,255,0.9)] shadow-[0_4px_8px_rgba(0,0,0,0.1)] text-center transition-all duration-[0.3s] ease-[ease-in-out] p-5 rounded-[10px] border-2 border-solid border-[#ddd] hover:-translate-y-2.5 hover:shadow-[0_6px_12px_rgba(0,0,0,0.2)] bg-[#fff3e6] h-full w-full mx-2.5">
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
            <div className="bg-[rgba(255,255,255,0.9)] shadow-[0_4px_8px_rgba(0,0,0,0.1)] text-center transition-all duration-[0.3s] ease-[ease-in-out] p-5 rounded-[10px] border-2 border-solid border-[#ddd] hover:-translate-y-2.5 hover:shadow-[0_6px_12px_rgba(0,0,0,0.2)] bg-[#fff3e6] h-full w-full mx-2.5">
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
            <div className="bg-[rgba(255,255,255,0.9)] shadow-[0_4px_8px_rgba(0,0,0,0.1)] text-center transition-all duration-[0.3s] ease-[ease-in-out] p-5 rounded-[10px] border-2 border-solid border-[#ddd] hover:-translate-y-2.5 hover:shadow-[0_6px_12px_rgba(0,0,0,0.2)] bg-[#fff3e6] h-full w-full mx-2.5">
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
            <div className="bg-[rgba(255,255,255,0.9)] shadow-[0_4px_8px_rgba(0,0,0,0.1)] text-center transition-all duration-[0.3s] ease-[ease-in-out] p-5 rounded-[10px] border-2 border-solid border-[#ddd] hover:-translate-y-2.5 hover:shadow-[0_6px_12px_rgba(0,0,0,0.2)] bg-[#fff3e6] h-full w-full mx-2.5">
              <h3 className="text-xl font-semibold mb-[15px]">Date</h3>
              <p>{get_date}</p>
            </div>
          </div>
        </div>

        <div className="flex justify-start">
          <label className="flex items-center cursor-pointer mx-5">
            Override Mode
            <input
              type="checkbox"
              className="sr-only peer"
              onChange={(e) => {
                const a = !get_override_mode;
                set_override_mode(a);
                console.log(a);
              }}
            />
            <div className="w-14 h-8 bg-gray-300 rounded-full peer-checked:bg-green-500 transition-colors duration-300 relative mx-5"></div>
          </label>

          <label className="flex items-center cursor-pointer mx-5">
            Water Volume Mode
            <input
              type="checkbox"
              className="sr-only peer"
              defaultChecked={1}
            />
            <div className="w-14 h-8 bg-gray-300 rounded-full peer-checked:bg-green-500 transition-colors duration-300 relative mx-5"></div>
          </label>
        </div>

        {/* Chart Section */}
        <div className="text-center bg-[rgba(255,255,255,0.1)] mt-10 p-5 rounded-[10px] grid">
          <p className="text-2xl font-semibold mb-5">Usage Trends</p>
          {/* Chart content here */}
          <Bar
            className="font-mono"
            data={{
              labels: dates,
              datasets: [
                {
                  label: "Total Uptime",
                  data: total_uptimes,
                },
                {
                  label: "Total Water Volume",
                  data: total_water_volumes,
                },
              ],
            }}
          />
          {/* <div className="flex justify-center">
            <ul className="w-2/3">
              {get_history.map((element) => {
                return (
                  <li className="my-2 outline outline-1 rounded-xl flex justify-start">
                    <p className="ml-5">Date: {fmt_date(element.date)}</p>
                    <p className="ml-5">
                      Total water volume: {element.total_water_volume}mL
                    </p>
                    <p className="ml-5">
                      Total uptime: {element.total_uptime}s
                    </p>
                  </li>
                );
              })}
            </ul>
          </div> */}
        </div>
      </div>
    </div>
  );
}

export default MainPage;
