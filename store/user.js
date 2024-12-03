import { createSlice } from "@reduxjs/toolkit"
import * as constants from "@/utilities/constants"

const initialState = {
  user: null,
  token: null,
  warehouseUser: false,
  companyUser: false,
  customer: false,
  permissions: null,
  email: null,
}

export const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    register: (state, action) => {
      state.user = action.payload.user
      state.token = action.payload.token
    },
    login: (state, action) => {
      state.user = action.payload.user
      state.token = action.payload.token
      state.warehouseUser = constants.warehouseUser(action.payload.user.role.name)
      state.companyUser = constants.companyUser(action.payload.user.role.name)
      state.customer = constants.customer(action.payload.user.role.name)
      state.permissions = action.payload.permissions
    },
    logout: (state) => {
      state.user = null
      state.token = null
      state.warehouseUser = false
      state.companyUser = false
      state.customer = false
      state.permissions = null
    },
    profile: (state, action) => {
      state.user.name = action.payload.name
      state.user.email = action.payload.email
      state.user.mobile = action.payload.mobile
      state.user.username = action.payload.username
    },
    company: (state, action) => {
      state.user.company.name = action.payload.name
      state.user.company.email = action.payload.email
      state.user.company.mobile = action.payload.mobile
      state.user.company.payment_status = action.payload.payment_status
      state.user.company.subscription_id = action.payload.subscription_id
    },
    email: (state, action) => {
      state.email = action.payload
    },
  },
})

export const { register, login, logout, profile, company, email } = userSlice.actions
export default userSlice.reducer