import { FetchConfig } from "./interface";
import appConfig from "../../config/app.config";

export const Fetch = async <T>(
  fetchConfig: FetchConfig
): Promise<{
  result: T | null | any;
  code?: number;
}> => {
  try {
    const path = !!fetchConfig.params
      ? `${fetchConfig.path}${convertSearchParams(fetchConfig.params)}`
      : fetchConfig.path;
    const url = `${appConfig.apiURL}${path}`;
    const res = await fetch(url, {
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
        Authorization: fetchConfig.isBasic
          ? "Basic " + btoa("DMTUSER:DMTPASS")
          : `Bearer ${fetchConfig.token}`,
      },
      method: fetchConfig.method,
      body:
        fetchConfig.method === "POST" || fetchConfig.method === "PATCH"
          ? JSON.stringify(fetchConfig.data)
          : null,
    });
    const dataResponse = !!fetchConfig.type
      ? await res.blob()
      : await res.json();
    return {
      result: dataResponse?.result,
      code: dataResponse?.code,
    };
  } catch (error) {
    return { result: null,code: null,};
  }
};

const convertSearchParams = (param: { [key: string]: any }) => {
  if (!param || Object.keys(param).length === 0 || param.constructor !== Object)
    return "";
  const newParam = new URLSearchParams(Object.entries(param)).toString();
  return "?" + newParam;
};


