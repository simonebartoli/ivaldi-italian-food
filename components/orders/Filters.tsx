import React from 'react';

const Filters = () => {
    return (
        <div className="smxl:p-0 p-4 my-8 w-full flex lg:flex-row lg:gap-0 gap-10 flex-col justify-center items-center">
            <div className="xls:w-2/5 lg:w-1/2 w-full flex flex-col justify-center lg:items-center items-start gap-8">
                <span className="text-xl">Price Range:</span>
                <div className="flex flex-col gap-4 w-full">
                    <div className="flex smxl:flex-row flex-col smxl:gap-6 gap-2 smxl:items-center items-start justify-between">
                        <span>Minimum Price: </span>
                        <input type="number" placeholder="Minimum Price..." className="smxl:w-1/2 w-full p-2 text-lg rounded-lg border-[1px] border-neutral-500"/>
                    </div>
                    <div className="flex smxl:flex-row flex-col smxl:gap-6 gap-2 smxl:items-center items-start justify-between">
                        <span>Maximum Price: </span>
                        <input type="number" placeholder="Maximum Price..."  className="smxl:w-1/2 w-full p-2 text-lg rounded-lg border-[1px] border-neutral-500"/>
                    </div>
                </div>
            </div>
            <div className="xls:w-2/5 lg:w-1/2 w-full flex flex-col justify-center lg:items-center items-start gap-8">
                <span className="text-xl">Date Range:</span>
                <div className="flex flex-col gap-4 w-full">
                    <div className=" flex smxl:flex-row flex-col smxl:gap-6 gap-2 smxl:items-center items-start lg:justify-center justify-between">
                        <span>Start Date: </span>
                        <input type="date" className="smxl:w-1/2 w-full p-2 text-lg rounded-lg border-[1px] border-neutral-500"/>
                    </div>
                    <div className="flex smxl:flex-row flex-col smxl:gap-6 gap-2 smxl:items-center items-start lg:justify-center justify-between">
                        <span>End Date:&nbsp;&nbsp;</span>
                        <input type="date" className="smxl:w-1/2 w-full p-2 text-lg rounded-lg border-[1px] border-neutral-500"/>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Filters;