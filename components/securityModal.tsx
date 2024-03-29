import React, {useState} from 'react';
import Modal from "react-responsive-modal";
import {NextPage} from "next";
import {useRouter} from "next/router";
import {gql, useMutation} from "@apollo/client";
import {useAuth} from "../contexts/auth-context";
import {SERVER_ERRORS_ENUM} from "../enums/SERVER_ERRORS_ENUM";
import {toast} from "react-toastify";
import {Bars} from "react-loader-spinner";
import 'react-toastify/dist/ReactToastify.css';

type Props = {
    modalOpen: boolean
    setModalOpen: React.Dispatch<React.SetStateAction<boolean>>
    sixDigitCode: string
    content: {
        title: string
        description: string
    }
}

const CHECK_RECOVER_TOKEN_STATUS = gql`
    mutation CHECK_RECOVER_TOKEN_STATUS {
        checkRecoverTokenStatus
    }
`

const SecurityModal: NextPage<Props> = ({modalOpen, setModalOpen, sixDigitCode, content}) => {
    const router = useRouter()
    const {functions: {generateAccessToken}} = useAuth()

    const [checkRecoverTokenStatus] = useMutation(CHECK_RECOVER_TOKEN_STATUS, {
        onCompleted: () => {
            setLoading(false)
            generateAccessToken()
        },
        onError: (error) => {
            console.log(error.graphQLErrors)
            setLoading(false)
            const graphqlError = error.graphQLErrors[0].extensions.type as string
            if(graphqlError === SERVER_ERRORS_ENUM.TOKEN_NOT_AUTHORIZED) toast.error("Click on the link sent to your email first")
            else toast.error("There is a problem with your request, try to login to solve it.")
        }
    })
    const [loading, setLoading] = useState(false)

    const handleButtonProceedClick = () => {
        setLoading(true)
        checkRecoverTokenStatus()
    }

    return (
        <Modal open={modalOpen}
               onClose={() => {
                   setModalOpen(false)
                   router.push("/login")
               }}
               center
               focusTrapped
               closeOnOverlayClick={false}
        >
            <div className="smxl:p-12 p-3 w-full flex flex-col items-center gap-12">
                <h2 className="text-center font-semibold smxl:text-3xl text-2xl text-green-standard">{content.title}</h2>
                <div className="flex flex-col items-center gap-6">
                    <p className="text-lg text-center leading-8">
                        {content.description}
                    </p>
                    <span className="border-t-[1px] border-black w-full"/>
                    <span className="text-center font-semibold text-lg">What to Do?</span>
                    <p className="smxl:text-lg text-base text-center leading-8">
                        Leave this window open, check your inbox (also the &quot;spam&quot; folder) and click the button in it.
                        Then click the button below &quot;Proceed&quot;.
                    </p>
                    <button
                        onClick={handleButtonProceedClick}
                        disabled={loading}
                        className="disabled:cursor-not-allowed disabled:bg-neutral-300 disabled:text-black mt-4 flex items-center justify-center text-lg p-4 text-center bg-green-standard hover:bg-green-500 transition rounded-lg shadow-lg smxl:w-1/2 w-full text-white">
                        {!loading ? "Proceed" : <Bars height={24} color={"white"}/>}
                    </button>
                    <span className="border-t-[1px] border-black w-full"/>
                    <div className="w-full p-8 bg-neutral-100 gap-14 flex flex-col gap-6 items-center">
                        <div className="flex md:flex-row flex-col items-center justify-center gap-8">
                            <span className="text-center smxl:text-lg text-base">The email sent should contain this code: </span>
                            <span className="uppercase p-4 bg-neutral-300 text-4xl text-black font-semibold">{sixDigitCode}</span>
                        </div>
                        <span className="text-xl text-center leading-8">If it does not contain the code,&nbsp;
                            <span className="font-semibold text-red-600">DISCARD THE EMAIL</span>
                            </span>
                    </div>
                </div>
            </div>
        </Modal>
    );
};

export default SecurityModal;