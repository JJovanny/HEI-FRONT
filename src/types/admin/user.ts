export interface IAdminUser {
    email: string,
    firstName: string,
    lastName: string,
    roles: string [],
    financialCompany?: any
}

export interface IAdminUserState {
    accessToken: string,
    refreshToken: string,
    page: number,
    count: number,
    limit: number,
    isLoadingGetAdminUser: false
    userData: IAdminUser
}
