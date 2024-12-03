import axios from "@/app/utilities/axios"

export const getBillingPortal = async (token) => {
  const { data: response } = await axios.get("/service/stripe/portal", {
    headers: {
      "Token": token
    }
  })

  return response
}