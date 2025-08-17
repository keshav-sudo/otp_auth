import instance from "./axios";

type Method = "GET" | "POST" | "PUT" |"DELETE" | "PATCH";

export const request = async <T>(
    url : string,
    method : Method,
    data?: any
): Promise<T> => {
    const res = await instance.request<T>({
        url ,
        method ,
        data
    });
    return res.data;
}