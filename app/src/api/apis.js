import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react'

const API = process.env.REACT_APP_URL;

export const apis = createApi({
    reducerPath: 'apis',
    baseQuery: fetchBaseQuery({
        baseUrl: API
    }),
    endpoints: (builder) => ({
        getDashboard: builder.query({
            query: () => `app/controller/DashboardController.php`,
            keepUnusedDataFor: 5,
        }),
        getIdConsult: builder.query({
            query: ({idConsulta,token}) => ({
                url: `/api/consult/${idConsulta}`,
                method: "GET",
                headers: {
                    'content-type': 'application/json',
                    'authorization': `Bearer ${token}`
                },
            }),
        })
    }),
})

export const { useGetDashboardQuery, useGetIdConsultQuery } = apis;
