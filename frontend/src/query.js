import axios from "axios";

export const local_api_url = async (path, params) => {
  const url = "http://localhost:5000";

  try {
    const response = await axios.get(url + "/smarter" + path, {
      params: { ...params },
    });
    // console.log(response.data.message);
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const deploy_api_url = async (path, params) => {
  const url = import.meta.env.VITE_BE_URL;

  try {
    const response = await axios.get(url + "/smarter" + path, {
      params: { ...params },
    });
    // console.log(response.data.message);
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const blynk_get_api = async (AUTH_TOKEN, PIN) => {
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

export const blynk_update_api = async (AUTH_TOKEN, PIN, VALUE) => {
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
