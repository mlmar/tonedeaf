import { get } from "./HTTPService.js";

const DEMO = './demo';

export const getDemo = async () => {
  try {
    const response = await get(DEMO);
    return response;
  } catch(error) {
    console.warn("Error getting demo");
    console.error(error);
    return null;
  }
}