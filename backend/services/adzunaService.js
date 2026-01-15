const axios = require("axios");

const APP_ID = process.env.ADZUNA_APP_ID;
const APP_KEY = process.env.ADZUNA_APP_KEY;
const COUNTRY = "in";

exports.fetchJobs = async (query) => {
  try {
    const url = `https://api.adzuna.com/v1/api/jobs/${COUNTRY}/search/20`;
    console.log("hii")
    const res = await axios.get(url, {
      params: {
        app_id: APP_ID,
        app_key: APP_KEY,
        what: query,
        results_per_page: 20
      }
    });

    // console.log("Adzuna status:", res.status);
    // console.log(res.data)
    return res.data.results;

  } catch (error) {
    console.error("Adzuna error:", error.response?.data || error.message);
    throw new Error("Job fetch failed");
  }
};

