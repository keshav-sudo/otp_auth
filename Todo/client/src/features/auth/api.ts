import { request }from "../../lib/request";

 type RegisterPayload = {
  name: string;
  email: string;
  password: string;
  role?: "USER" | "ADMIN"; 
};


export const register = async(data : RegisterPayload) => {
    return request("/register" , "POST" , data);
}


