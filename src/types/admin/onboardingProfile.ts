import { IError } from '../global'

export interface IOnboardingProfileCompany {
    companyName: string,
    address: string,
    country: string,
    postalCode: string,
    city: string,
    state: string,
    sector: string,
    financialCases: string[]
}

export interface IOnboardingProfileUser {
    firstName: string,
    lastName: string,
    phoneNumber: string
}

export interface IOnboardingProfileInvoice {
    file: string,
    type: string,
    format: string,
    filename: string,
    createdAt: string,
    updatedAt: string
}

export interface IOnboardingProfileState {
    id: string,
    company: IOnboardingProfileCompany,
    user: IOnboardingProfileUser,
    email: string,
    financialCompany: string[],
    invoice?: IOnboardingProfileInvoice,
    createdAt: string,
    status: string
}

export interface IOnboardingProfilesState {
    onboardingProfiles: IOnboardingProfileState[],
    isLoadingGetOnboardingProfiles: boolean,
    onboardingProfile: IOnboardingProfileState,
    isLoadingOnboardingProfile: boolean,
    errorOnboardingProfilesData: IError[],
    count: number
}
