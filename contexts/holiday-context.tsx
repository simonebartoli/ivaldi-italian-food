import React, {createContext, ReactNode, useState} from 'react';
import {NextPage} from "next";
import {gql, useQuery} from "@apollo/client";
import {AiOutlinePlus} from "react-icons/ai";
import {DateTime} from "luxon";

type ContextType = {
    holidayPeriod: boolean
}

const holidayContext = createContext<undefined | ContextType>(undefined)

type GetHolidaysType = {
    getHolidays: {
        start_date: string
        end_date: string
        reason: string | null
    }
}
const GET_HOLIDAYS = gql`
    query GET_HOLIDAYS {
        getHolidays {
            start_date
            end_date
            reason
        }
    }
`


type Props = {
    children: ReactNode
}

export const HolidayContext: NextPage<Props> = ({children}) => {
    const [holidayPeriod, setHolidayPeriod] = useState(false)
    const [holiday, setHoliday] = useState<GetHolidaysType["getHolidays"] | null>(null)
    const [closeMenu, setCloseMenu] = useState(false)

    const {} = useQuery<GetHolidaysType>(GET_HOLIDAYS, {
        fetchPolicy: "cache-and-network",
        onCompleted: (data) => {
            setHoliday(data.getHolidays)
            if(DateTime.now() >= DateTime.fromISO(data.getHolidays.start_date)) setHolidayPeriod(true)
        },
        onError: () => console.log("No Holidays Found")
    })

    const value = {holidayPeriod}
    return (
        <holidayContext.Provider value={value}>
            {
                (holiday !== null && !closeMenu) &&
                <div className="relative w-full z-50 p-4 bg-yellow-300 flex flex-col items-center justify-center gap-4 text-neutral-600">
                    <span className="text-xl text-center">Holiday Period</span>
                    <span className={"text-center"}>{`From the ${DateTime.fromISO(holiday.start_date).toLocaleString(DateTime.DATE_FULL)} to the ${DateTime.fromISO(holiday.end_date).toLocaleString(DateTime.DATE_FULL)} there will be no deliveries.`}</span>
                    <AiOutlinePlus onClick={() => setCloseMenu(true)} className="absolute right-[1%] top-[10%] text-xl rotate-45 text-red-600 cursor-pointer"/>
                </div>
            }
            {children}
        </holidayContext.Provider>
    );
};

export const useHoliday = () => {
    const context = React.useContext(holidayContext)
    if (context === undefined) {
        throw new Error('useResizer must be used within a ResizerProvider')
    }
    return context
}
