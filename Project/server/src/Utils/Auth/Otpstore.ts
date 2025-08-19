import redisClient from "../RedisClient.ts";
const OTP_EXPIRY_SECONDS = 300;


export const saveOtpToRedis = async (email: string, otp:string): Promise<void>=>{
 const key = `otp:${email}`;
 await redisClient.set(key, otp, "EX", OTP_EXPIRY_SECONDS);
};


export const getOtpFromRedis = async(email: string): Promise<string | null> => {
    const key = `otp:${email}`;
    const otp = await redisClient.get(key);
    return otp;
};




export const verifyOtp = async (email: string, inputOtp: string): Promise<boolean> => {
    const  storeOtp = await getOtpFromRedis(email);
    if(!storeOtp) return false;
    return storeOtp === inputOtp;
}