import * as EmailValidator from "email-validator"
import InvalidFormat from "../../graphql/errors/invalid_format";

type LoginInfo = {
    email: string,
    password: string
}
export const loginVal = ({email, password}: LoginInfo) => {
    const OK = EmailValidator.validate(email) && password.length >= 8;
    if(!OK) throw new InvalidFormat("LoginSection Parameters Not Valid")
}