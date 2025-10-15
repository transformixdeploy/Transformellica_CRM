import { axiosResponseStatus } from "@/lib/constants";
import { AxiosError } from "@/lib/types";

function getErrorMessage(error: AxiosError): string{
    return (
        error.response.data.status === axiosResponseStatus.FAIL ? 
            error.response.data.data!.message : error.response.data.message!
    )

}

export {
    getErrorMessage
}