import React, {useEffect, useRef, useState} from 'react';
import {useResizer} from "../contexts/resizer-context";
import {useLayoutContext} from "../contexts/layout-context";
import NameSurname from "../components/signup/nameSurname";
import EmailDob from "../components/signup/emailDob";
import Password from "../components/signup/password";
import {gql, useMutation} from "@apollo/client";
import 'react-responsive-modal/styles.css';
import SecurityModal from "../components/securityModal";
import {toast} from "react-toastify";
import {useAuth} from "../contexts/auth-context";
import PageLoader from "../components/page-loader";
import {useRouter} from "next/router";

const CREATE_NEW_USER = gql`
    mutation CREATE_NEW_USER ($data: CreateNewUserInput!) {
        createNewUser(data: $data)
    }
`
type CreateNewUserType = {
    createNewUser: string
}


const Signup = () => {
    const {loading, logged} = useAuth()
    const router = useRouter()
    const [redirectTo, setRedirectTo] = useState<string | null>(null)

    const fullPageRef = useRef<HTMLDivElement>(null)
    const {heightPage} = useResizer()
    const {navHeight} = useLayoutContext()

    const firstSectionRef = useRef<HTMLDivElement>(null)
    const secondSectionRef = useRef<HTMLDivElement>(null)
    const thirdSectionRef = useRef<HTMLDivElement>(null)
    const refs = useRef([firstSectionRef, secondSectionRef, thirdSectionRef])

    const [name, setName] = useState("")
    const [surname, setSurname] = useState("")
    const [email, setEmail] = useState("")
    const [dob, setDob] = useState("")
    const [password, setPassword] = useState("")
    const [confirmPassword, setConfirmPassword] = useState("")

    const [modalOpen, setModalOpen] = useState(false)
    const [sixDigitCode, setSixDigitCode] = useState("")
    const [formLoading, setFormLoading] = useState(false)

    const [createNewUser] = useMutation(CREATE_NEW_USER, {
        onCompleted: (data: CreateNewUserType) => {
            setFormLoading(false)
            setModalOpen(true)
            setSixDigitCode(data.createNewUser)
        },
        onError: (error) => {
            setFormLoading(false)
            toast.error(error.message)
        }
    })

    useEffect(() => {
        if(fullPageRef.current !== null && navHeight !== undefined){
            fullPageRef.current.style.minHeight = `${heightPage - navHeight}px`
        }
    }, [heightPage, navHeight])

    useEffect(() => {
        const {cart, orders} = router.query
        if(cart !== undefined) setRedirectTo("cart")
        else if(orders !== undefined) setRedirectTo("orders")
    }, [router])

    const moveNext = (oldRef: number, newRef: number) => {
        const disappearingSection = refs.current[oldRef].current
        const appearingSection = refs.current[newRef].current

        if(disappearingSection !== null && appearingSection !== null){
            disappearingSection.classList.toggle("animate-slideLeft")
            appearingSection.classList.toggle("hidden")
            appearingSection.classList.toggle("animate-comeFromRight")
            setTimeout(() => {
                disappearingSection.classList.toggle("hidden")
                disappearingSection.classList.remove("animate-slideLeft")
                appearingSection.classList.remove("hidden")
                appearingSection.classList.remove("animate-comeFromRight")
            }, 500)
        }
    }
    const moveBack = (oldRef: number, newRef: number) => {
        const disappearingSection = refs.current[oldRef].current
        const appearingSection = refs.current[newRef].current

        if(disappearingSection !== null && appearingSection !== null){
            disappearingSection.classList.toggle("animate-slideRight")
            appearingSection.classList.toggle("hidden")
            appearingSection.classList.toggle("animate-comeFromLeft")
            setTimeout(() => {
                disappearingSection.classList.toggle("hidden")
                disappearingSection.classList.remove("animate-slideRight")
                appearingSection.classList.remove("hidden")
                appearingSection.classList.remove("animate-comeFromLeft")
            }, 500)
        }
    }

    const handleSubmitForm = () => {
        const data = {
            name: name,
            surname: surname,
            email: email,
            dob: dob,
            password: password
        }
        setFormLoading(true)
        createNewUser({
            variables: {
                data: data
            }
        })
    }

    if(loading) return <PageLoader display/>
    if(logged) {
        router.push( redirectTo !== null ? `/${redirectTo}` : "/account")
        return <PageLoader display/>
    }

    return (
        <main ref={fullPageRef} className="overflow-hidden flex flex-col gap-16 items-center justify-center p-8">
            <SecurityModal
                modalOpen={modalOpen}
                setModalOpen={setModalOpen}
                sixDigitCode={sixDigitCode}
                content={{
                    title: "🎉 Your Registration is almost completed",
                    description: "To complete your registration you need to confirm your email."
                }}
            />
            <h2 className="text-4xl">Signup</h2>
            <div className="flex flex-row overflow-x-hidden overflow-y-clip gap-12 items-center justify-center w-full relative">
                <NameSurname name={name} surname={surname}
                             setName={setName} setSurname={setSurname}
                             ref={firstSectionRef}
                             moveNext={moveNext}/>

                <EmailDob dob={dob} email={email}
                          setDob={setDob} setEmail={setEmail}
                          ref={secondSectionRef}
                          moveNext={moveNext} moveBack={moveBack}/>

                <Password password={password} confirmPassword={confirmPassword}
                          setPassword={setPassword} setConfirmPassword={setConfirmPassword}
                          ref={thirdSectionRef}
                          loading={formLoading}
                          handleSubmitForm={handleSubmitForm}
                          moveBack={moveBack}/>
            </div>
        </main>
    );
};

export default Signup;