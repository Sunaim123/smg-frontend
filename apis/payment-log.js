import axios from "@/utilities/axios"

export const getPaymentLogs = async (token, query) => {
    const { data: response } = await axios.get("api/payment-log?" + query, {
      headers: {
        "Token": token
      }
    })
  
    return response
  }