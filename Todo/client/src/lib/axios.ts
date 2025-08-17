import axios from "axios";
import dotenv from "dotenv"

dotenv.config();


const instance = axios.create({
    baseURL : process.env.DATABASE_URL || "http://localhost:3000/api/v1",
     withCredentials: true,
});

export default instance