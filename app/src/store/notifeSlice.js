import { createSlice } from '@reduxjs/toolkit'

const initialState = {
    notifications: [],
}

export const notifeSlice = createSlice({
    name: 'notification',
    initialState,
    reducers: {
        add: (state, action) => {
            state.notifications = [...state.notifications, action.payload.valor];        
        },
        clear: (state) => {
            state.notifications = [];
        }
    },
})

export const { add, clear } = notifeSlice.actions

export default notifeSlice.reducer