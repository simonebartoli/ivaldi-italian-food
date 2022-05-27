import moment from "moment";

const responseCreator = (status: string, message: string, property: string, propertyValue: any) => {
    return {
        status: status,
        time: moment().toString(),
        message: message,
        [property]: propertyValue
    }
}

export default responseCreator