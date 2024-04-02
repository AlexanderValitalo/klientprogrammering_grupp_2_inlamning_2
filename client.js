const BASE_URL = "https://da-demo.github.io/api/futurama/";

const API_URLS = {
  questions: `${BASE_URL}questions`,
};

// Base function for all Json API calls
async function getJson(url) {
  const response = await fetch(url);

  if (!response.ok) {
    throw new Error(`Could not get ${url}.\nStatus: ${response.status}`);
  }

  return await response.json();
}

// API calls
const API = {
  async getQuestions() {
    return await getJson(API_URLS.questions);
  },
};
