import { createApi , fetchBaseQuery } from '@reduxjs/toolkit/query/react'

const API = process.env.REACT_APP_URL;

export const dashboardApi = createApi({
    reducerPath: 'dashboardApi',
    baseQuery: fetchBaseQuery({ baseUrl: API }),
    endpoints: (builder) => ({
        getDashboard: builder.query({
            query: () => `app/controller/DashboardController.php`,
            keepUnusedDataFor: 5,
        }),
    }),
})

export const  { useGetDashboardQuery} = dashboardApi;
