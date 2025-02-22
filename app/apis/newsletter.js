import axios from "@/app/utilities/axios"

export const unsubscribeNewsletter = async (payload) => {
  const { data: response } = await axios.post("/api/newsletter/unsubscribe", payload)
  return response
}