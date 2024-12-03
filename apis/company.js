import axios from "@/utilities/axios"

export const createCompany = async (token, payload) => {
  const { data: response } = await axios.post("/api/company", payload, {
    headers: {
      "Token": token
    }
  })

  return response
}

export const updateCompany = async (token, payload) => {
  const { data: response } = await axios.put("/api/company", payload, {
    headers: {
      "Token": token
    }
  })

  return response
}

export const deleteCompany = async (token, id) => {
  const { data: response } = await axios.delete("/api/company/" + id, {
    headers: {
      "Token": token
    }
  })

  return response
}

export const getCompanies = async (token, query) => {
  const { data: response } = await axios.get("/api/companies?" + query, {
    headers: {
      "Token": token
    }
  })

  return response
}

export const getCompany = async (token, id) => {
  const { data: response } = await axios.get("/api/company?id=" + id, {
    headers: {
      "Token": token
    }
  })

  return response
}

export const stripeOnboarding = async (token, payload) => {
  const { data: response } = await axios.post("/api/stripe/connect-account", payload, {
    headers: {
      "Token": token
    }
  })
  return response
}
