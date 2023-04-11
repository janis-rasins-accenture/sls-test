interface BodyDataIF {
    message: string
    data?: string
}
export const returnData = (statusCode: number, message: string, data = '' ) => {
    const body: BodyDataIF = {
        message: message,
    }

    if (data) {
        body.data = data
    }
                
    return {
        statusCode: statusCode,
        body: JSON.stringify(
            body,
            null,
            2
        ),
    }
}