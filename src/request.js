import axios from "axios";
import { BASE_URL } from "./config.js";

export default axios.create({
  baseURL: BASE_URL,
});
