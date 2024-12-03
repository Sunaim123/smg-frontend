import axios from "@/app/utilities/axios"

export const updateUserRole = async (token, payload) => {
    const { data: response } = await axios.put("/api/user-role", payload, {
        headers: {
            "Token": token
        }
    })

    return response
}

export const getUserRole = async (token, id) => {
    const { data: response } = await axios.get("/api/user-role?id=" + id, {
        headers: {
            "Token": token
        }
    })

    return response
}