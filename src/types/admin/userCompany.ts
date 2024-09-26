import { ICountry } from '../country'
import { EUserType } from '../enums'
import { IError } from '../global'
import { IFinancialCompany } from '../payers'

export interface IUserCompany{
    email: string,
    firstname: string,
    lastname: string,
    phoneNumber: string,
    userType: EUserType,
    companyName:string,
    contactEmail:string,
    companyCif:string,
    typeCompany: string,
    ci: string,
    ciInvitation: string,
    password: string,
    pin: string,
    region:string,
    city:string,
    address:string,
    postalCode:string,
    financialCompany?:string,
    companyCountry?:string,
    regionRequired?:boolean
}

export interface ICompany {
    id: string,
    name: string,
    cif: string,
    address: string,
    contactEmail: string,
    contactName: string,
    postalCode: string,
    typeCompany: string,
    city: string,
    region: string,
    country: ICountry,
    financialCompany: IFinancialCompany,
    paymentPreferences: any,
    externalPayment: boolean
}

export interface IUserCompanyList {
    id: string,
    firstName: string,
    lastName: string,
    email: string,
    phoneNumber: string,
    active: boolean,
    roles: string[],
    ci: string,
    ciInvitation: string,
    company: ICompany,
    firstLoginAfterInvite: boolean,
    userType: EUserType
 }

export interface EditUserDTO {
    userId: string,
    editCompany?: boolean,
    userData: {
        firstname?: string,
        lastname?: string,
        email?: string,
        phoneNumber?: string,
        userType?: EUserType,
        ci: string,
        ciInvitation: string,
        password: string,
        company?: {
            name?: string,
            cif?: string,
            region?: string,
            country?: string,
            typeCompany?: string,
            city?: string,
            pin?: string,
            address?: string,
            postalCode?: string,
            financialCompany?: string
        }
    }
    selectedFinancialId?: string
    selectedCustomerId?: string
}

export interface IUserCompanyState {
    isLoadingPostUserCompany: boolean,
    isLoadingPutUserCompany: boolean,
    isLoadingDelUserCompany: boolean,
    isLoadingGetMyUsersCompany: boolean,
    isLoadingGetUserCompanyById: boolean,
    userCompanyData: IUserCompany,
    submitPost: boolean,
    submitPut: boolean,
    errorCreateUserCompany: IError[],
    errorEditUserCompany: IError[],
    myUsersCompany: IUserCompanyList[],
    userCompanyDetails: IUserCompanyList,
    editUserCompanyDetails: EditUserDTO
}
