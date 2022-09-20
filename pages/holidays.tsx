import React, {useEffect, useMemo, useState} from 'react';
import {useRouter} from "next/router";
import {useAuth} from "../contexts/auth-context";
import {gql, useMutation, useQuery} from "@apollo/client";
import PageLoader from "../components/page-loader";
import LayoutPrivate from "../components/layout-private";
import {NextPage} from "next";
import {DateTime} from "luxon";
import {toast} from "react-toastify";
import {Bars} from "react-loader-spinner";
import "react-toastify/dist/ReactToastify.css"
import {BsFillTrashFill} from "react-icons/bs";

type HolidayType = {
    start_date: string
    end_date: string
}
type GetHolidaysType = {
    getHolidays_FULL: HolidayType[]
}
const GET_HOLIDAYS = gql`
    query GET_HOLIDAYS {
        getHolidays_FULL {
            start_date
            end_date
        }
    }
`

type CreateNewHolidayVarType = {
    data: {
        start_date: Date
        end_date: Date
    }
}
type CreateNewHolidayType = {
    createNewHoliday: boolean
}
type RemoveHolidayType = {
    removeHoliday: boolean
}
const CREATE_NEW_HOLIDAY = gql`
    mutation CREATE_NEW_HOLIDAY ($data: CreateNewHolidayInput!) {
        createNewHoliday(data: $data)
    }
`
const REMOVE_HOLIDAY = gql`
    mutation REMOVE_HOLIDAY ($data: CreateNewHolidayInput!) {
        removeHoliday(data: $data)
    }
`

const Holidays = () => {
    const router = useRouter()
    const {loading, logged, isAdmin, accessToken, functions: {handleAuthErrors}} = useAuth()
    const [holidays, setHolidays] = useState<HolidayType[]>([])

    const [startDate, setStartDate] = useState("")
    const [endDate, setEndDateDate] = useState("")
    const [buttonLoading, setButtonLoading] = useState(false)
    const [reTry, setReTry] = useState(false)
    const disabled = useMemo(() => {
        return startDate === "" || endDate === ""
    }, [startDate, endDate])
    const handleFormSubmit = () => {
        setButtonLoading(true)
        CreateNewHoliday({
            variables: {
                data: {
                    start_date: DateTime.fromISO(startDate).toJSDate(),
                    end_date: DateTime.fromISO(endDate).toJSDate()
                }
            }
        })
    }


    const {loading: queryLoading, refetch} = useQuery<GetHolidaysType>(GET_HOLIDAYS, {
        fetchPolicy: "cache-and-network",
        onCompleted: (data) => {
            setHolidays(data.getHolidays_FULL)
        }
    })
    const [CreateNewHoliday] = useMutation<CreateNewHolidayType, CreateNewHolidayVarType>(CREATE_NEW_HOLIDAY, {
        context: {
            headers: {
                authorization: "Bearer " + accessToken.token,
            }
        },
        onCompleted: () => {
            toast.success("Holiday Created")
            setStartDate("")
            setEndDateDate("")
            refetch()
            setButtonLoading(false)
        },
        onError: async (error) => {
            const result = await handleAuthErrors(error)
            if(result) {
                setReTry(true)
                return
            }
            setButtonLoading(false)
            toast.error(error.message)
        }
    })

    useEffect(() => {
        if(reTry){
            CreateNewHoliday({
                variables: {
                    data: {
                        start_date: DateTime.fromISO(startDate).toJSDate(),
                        end_date: DateTime.fromISO(endDate).toJSDate()
                    }
                }
            })
            setReTry(false)
        }
    }, [reTry])

    if(loading || queryLoading) {
        return <PageLoader display/>
    }
    if(!isAdmin || !logged) {
        router.push("/login")
        return <PageLoader display/>
    }

    return (
        <LayoutPrivate className={"self-stretch flex h-full flex-col gap-8 items-center justify-start smxl:p-8 smx:p-4 px-0 py-4"}>
            <div className="bg-neutral-100 flex xls:flex-row flex-col w-full items-center justify-between xls:gap-16 gap-10 p-8 rounded-lg shadow-lg">
                <div className="xls:w-1/3 w-full flex flex-row gap-6 items-center justify-center">
                    <span className="w-1/3">Start Date: </span>
                    <input type="date"
                           min={DateTime.now().toISODate()}
                           value={startDate}
                           onChange={(e) => setStartDate(e.target.value)}
                           className="bg-neutral-50 border-[1px] border-neutral-500 rounded-lg p-3 shadow-lg w-2/3"/>
                </div>
                <div className="xls:w-1/3 w-full flex flex-row gap-6 items-center justify-center">
                    <span className="w-1/3">End Date: </span>
                    <input type="date"
                           min={DateTime.now().plus({day: 1}).toISODate()}
                           value={endDate}
                           onChange={(e) => setEndDateDate(e.target.value)}
                           className="bg-neutral-50 border-[1px] border-neutral-500 rounded-lg p-3 shadow-lg w-2/3"/>
                </div>
                <button disabled={disabled || loading}
                        onClick={handleFormSubmit}
                        className={"flex items-center justify-center disabled:bg-neutral-500 disabled:cursor-not-allowed hover:bg-green-500 transition xls:w-1/3 w-full bg-green-standard p-3 text-center text-white text-lg rounded-lg shadow-lg"}>
                    {
                        buttonLoading ?
                        <Bars height={24} color={"white"}/> : "Add New Holiday"
                    }
                </button>
            </div>
            {
                holidays.length === 0 ?
                    <div className="text-neutral-500 w-full bg-neutral-100 p-8 flex items-center justify-center text-3xl">
                        <span>No Holidays Have Been Found</span>
                    </div>
                :
                holidays.map((_, index) =>
                    <Holiday
                        refetch={refetch}
                        key={index}
                        holiday={_}
                    />
                )
            }
        </LayoutPrivate>
    );
};

type HolidayProps = {
    holiday: HolidayType
    refetch: any
}

const Holiday: NextPage<HolidayProps> = ({holiday, refetch}) => {
    const {accessToken, functions: {handleAuthErrors}} = useAuth()

    const ON = (DateTime.now() > DateTime.fromISO(holiday.start_date) && DateTime.now() < DateTime.fromISO(holiday.end_date))
    const [reTry, setReTry] = useState(false)
    const handleFormSubmit = () => {
        RemoveHoliday({
            variables: {
                data: {
                    start_date: DateTime.fromISO(holiday.start_date).toJSDate(),
                    end_date: DateTime.fromISO(holiday.end_date).toJSDate()
                }
            }
        })
    }


    const [RemoveHoliday] = useMutation<RemoveHolidayType, CreateNewHolidayVarType>(REMOVE_HOLIDAY, {
        context: {
            headers: {
                authorization: "Bearer " + accessToken.token,
            }
        },
        onCompleted: () => {
            toast.success("Holiday Removed")
            refetch()
        },
        onError: async (error) => {
            const result = await handleAuthErrors(error)
            if(result) {
                setReTry(true)
                return
            }
            toast.error(error.message)
        }
    })


    useEffect(() => {
        if(reTry){
            RemoveHoliday({
                variables: {
                    data: {
                        start_date: DateTime.fromISO(holiday.start_date).toJSDate(),
                        end_date: DateTime.fromISO(holiday.end_date).toJSDate()
                    }
                }
            })
            setReTry(false)
        }
    }, [reTry])

    return (
        <div className="w-full text-xl p-8 rounded-lg shadow-lg bg-neutral-50 flex sm:flex-row flex-col sm:gap-0 gap-6 justify-between items-center">
            <div className="flex flex-row items-center justify-center gap-6">
                <span>{DateTime.fromISO(holiday.start_date).toLocaleString(DateTime.DATE_SHORT)}</span>
                <span>-</span>
                <span>{DateTime.fromISO(holiday.end_date).toLocaleString(DateTime.DATE_SHORT)}</span>
            </div>
            <div className="flex flex-row gap-8 items-center justify-center">
                <span className={`text-2xl font-semibold ${ON ? "text-green-standard" : "text-red-600"}`}>
                {
                    ON ? "ON" : "OFF"
                }
                </span>
                <BsFillTrashFill onClick={handleFormSubmit} className="cursor-pointer text-2xl text-red-600 hover:text-red-500 transition"/>
            </div>
        </div>
    )
}

export default Holidays;