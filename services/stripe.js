import axios from "@/utilities/axios"

export const subscribe = async (token, payload) => {
  const { data: response } = await axios.post("/service/stripe/subscribe", payload, {
    headers: {
      "Token": token
    }
  })
  if (!response.status) throw new Error(response.message)
}