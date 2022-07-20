import React, {useRef} from 'react';
import {BiArrowToBottom} from "react-icons/bi";
import {NextPage} from "next";

type Props = {
    order: string
    setOrder: React.Dispatch<React.SetStateAction<string>>
    setRender: React.Dispatch<React.SetStateAction<boolean>>
}

const OrderBy: NextPage<Props> = ({order, setOrder, setRender}) => {
    const orderFilterRef = useRef<HTMLDivElement>(null)

    const handleContextMenu = () => {
        if(orderFilterRef.current !== null){
            orderFilterRef.current.classList.toggle("animate-slideUp")
            orderFilterRef.current.classList.toggle("animate-slideDown")
            if(orderFilterRef.current.classList.contains("hidden"))
                orderFilterRef.current.classList.toggle("hidden")
            else
                setTimeout(() => orderFilterRef.current!.classList.toggle("hidden"), 250)
        }
    }
    const handleContextMenuOptionClick = (id: string) => {
        setOrder(id)
        setRender(true)
    }

    return (
        <div onClick={handleContextMenu} className="relative grow cursor-pointer xls:flex basis-1/4 hidden flex-row gap-4 items-center justify-center mdxl:text-xl md:text-lg text-base p-3 bg-white rounded-lg border-[1px] border-neutral-400">
            <span>Order By: </span>
            <span className="font-semibold">{order}</span>
            <BiArrowToBottom/>
            <div ref={orderFilterRef} className="hidden animate-slideUp flex mt-4 border-[1px] rounded-b-lg border-neutral-500 bg-white absolute top-full left-0 flex-col items-center w-full shadow-lg">
                {order !== "Most Relevant" && <span onClick={() => handleContextMenuOptionClick("Most Relevant")} className="w-full text-center p-4 hover:bg-neutral-100">Most Relevant</span>}
                {order !== "Price Ascending" && <span onClick={() => handleContextMenuOptionClick("Price Ascending")} className="w-full text-center p-4 hover:bg-neutral-100">Price Ascending</span>}
                {order !== "Price Descending" && <span onClick={() => handleContextMenuOptionClick("Price Descending")} className="w-full text-center p-4 hover:bg-neutral-100">Price Descending</span>}
                {order !== "Higher Discounts" && <span onClick={() => handleContextMenuOptionClick("Higher Discounts")} className="w-full text-center p-4 hover:bg-neutral-100 rounded-b-lg">Higher Discounts</span>}
            </div>
        </div>
    );
};

export default OrderBy;