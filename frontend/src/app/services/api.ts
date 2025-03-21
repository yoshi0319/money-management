import axios from "axios";

const API_URL = process.env.API_URL;

export const fetchUser = async () => {
    try {
        const response = await axios.get(`${API_URL}/user/`)
        return response.data;
    } catch (error) {
        console.error("ユーザー情報の取得に失敗しました", error);
        throw error;
    };
}