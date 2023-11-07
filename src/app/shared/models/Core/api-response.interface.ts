export interface APIResponse<T = undefined> {
    result?: T
    success: boolean
    message: string
    statusCode: number
}

export interface APIResponseResumen<T = undefined> {
    result?: T
    success: boolean
    message: string
    statusCode: number
}

