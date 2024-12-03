import axios from "@/app/utilities/axios"

export const getReturnCount = async (token, query) => {
  const { data: response } = await axios.get(`/service/report/returns?${query}`, {
    headers: {
      "Token": token
    }
  })

  return response
}

export const getUserCount = async (token, query) => {
  const { data: response } = await axios.get(`/service/report/users?${query}`, {
    headers: {
      "Token": token
    }
  })

  return response
}


export const getIncomeStatement = async (token, query) => {
  const { data: response } = await axios.get("service/report/income-statement?" + query, {
    headers: {
      "Token": token
    }
  })

  return response
}

export const getReturnCountValue = async (token, query) => {
  const { data: response } = await axios.get(`service/report/return?${query}`, {
    headers: {
      "Token": token
    }
  })
  return response
}

export const getFbaCount = async (token, query) => {
  const { data: response } = await axios.get(`service/report/fba?${query}`, {
    headers: {
      "Token": token
    }
  })
  return response
}

export const stripePortal = async (token) => {
  const { data: response } = await axios.get("/service/stripe/portal", {
    headers: {
      "Token": token
    }
  })
  return response
}

