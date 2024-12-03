import axios from "@/app/utilities/axios"

export const getPayouts = async (token, query) => {
    const { data: response } = await axios.get("/api/payouts?" + query, {
        headers: {
            "Token": token
        }
    })

    return response
}

export const getPayout = async (token, id) => {
    const { data: response } = await axios.get("/api/payout?id=" + id, {
        headers: {
            "Token": token
        }
    })

    return response
}