import axios from "axios";

async function createRequest({ reqHeaders, params, authToken }) {
  return axios.create({
    baseURL: `${process.env.REACT_APP_OPENSHIFT_APP_DNS}`,
    responseType: "json",
    crossdomain: true,
    headers: {
      "Content-Type": reqHeaders?.["Content-Type"] || "application/json",
      Accept: "application/json",
      Authorization: authToken,
      ...reqHeaders,
    },
    params,
  });
}

export const handleCatchBlock = (error) => {
  console.log("Something went wrong fetching apis");
};

export default async function apiHandler({
  url,
  method,
  headers: reqHeaders,
  data: jsonData,
  params,
  authToken,
}) {
  try {
    const request = await createRequest({ reqHeaders, params, authToken });
    let result = [];
    switch (method) {
      case "POST":
        result = await request.post(url, jsonData);
        break;

      case "DELETE":
        result = await request.delete(url);
        break;

      default:
        result = await request.get(url);
    }
    const { data, headers } = result;
    return { data, headers };
  } catch (error) {
    // handleCatchBlock(error);
    // window.location.href = '/caseload';
    if(error.response){
      const { data, headers } = error.response;
      return { data, headers };
    }
  
  }
}
