import instance from "@/utils/AxiosInstance";

const LoginService = async ({loginData} : any ) => {

    const response = await instance.post("user/login/", loginData);
    return response.data;
};

export default LoginService;