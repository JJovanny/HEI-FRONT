import { IUser } from 'src/types/user'

export default class UserManager {
  static getId = (data: IUser) => {
    return data?.id ? data.id : ''
  }

  static getFirstName = (data: IUser) => {
    return data?.firstName ? data.firstName : ''
  }

  static getBankInformation = (data: IUser) => {
    return data?.bankInformation ? data.bankInformation : ''
  }

  static getLastName = (data: IUser) => {
    return data?.lastName ? data.lastName : ''
  }

  static getEmail = (data: IUser) => {
    return data?.email ? data.email : ''
  }

  static getVerificationCode = (data: IUser) => {
    return data?.verificationCode ? data.verificationCode : ''
  }

  static getCompanyName = (data: IUser) => {
    return data?.companyName ? data.companyName : ''
  }

  static getCompanyCIF = (data: IUser) => {
    return data?.companyCIF ? data.companyCIF : ''
  }

  static getCompanyAddress = (data: IUser) => {
    return data?.companyAddress ? data.companyAddress : ''
  }

  static getCompanyCity = (data: IUser) => {
    return data?.companyCity ? data.companyCity : ''
  }

  static getCompanyCountry = (data: IUser) => {
    return data?.companyCountry ? data.companyCountry : ''
  }

  static getCompanyPostalCode = (data: IUser) => {
    return data?.companyPostalCode ? data.companyPostalCode : ''
  }

  static getCompanyRegion = (data: IUser) => {
    return data?.region ? data.region : ''
  }

  static getCompanyRegionV2 = (data: IUser) => {
    return data?.companyRegion ? data.companyRegion : ''
  }
}
