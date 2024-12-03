import axios from "@/app/utilities/axios"

export const getCategories = async (token, query) => {
  const { data: response } = await axios.get("/api/categories?" + query, {
    headers: {
      "Token": token
    }
  })

  return response
}