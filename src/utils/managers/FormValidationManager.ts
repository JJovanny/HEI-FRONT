import { strings } from '../../resources/locales/i18n'
import { IError } from 'src/types/global'
import { IFiles, ILines } from 'src/types/invoice'
import {
  isChecked,
  isValidEmail,
  isValidNumberParseInt,
  isValidNumberParseFloat,
  isValidPassword,
  isValidPasswordCoincidence,
  isValidSelect,
  isValidString,
  isValidStringWithoutNumber,
  isValidTypeFile,
  isValidVerificationCode,
  isValidName
} from './FormValidation'
import { EditUserDTO, IUserCompany, IUserCompanyList } from 'src/types/admin/userCompany'

export default class FormValidationManager {
  static formRegisterEmail = (props: {email: string, acceptUseConditions: boolean}) : IError[] => {
    const { email, acceptUseConditions } = props
    const error: IError[] = []

    if (!isValidEmail(email?.trim())) {
      if (email?.trim().length === 0) {
        error.push({ key: 'email', value: strings('error.completeThisField') })
      } else error.push({ key: 'email', value: strings('form.error.invalidEmail') })
    }
    if (!isChecked(acceptUseConditions)) {
      error.push({ key: 'acceptUseConditions', value: strings('form.error.invalidUseConditionsChecked') })
    }

    return error
  }

  static formSendInvoiceEmail = (props: { emails: string }) => {
    const { emails } = props
    const error: IError[] = []

    if (emails?.trim().length === 0) {
      error.push({ key: 'emails', value: strings('error.completeThisField') })
    }
    return error
  }

  static formPostSupplier = (
    props: {
      email: string,
      phone: string,
      firstName: string,
      lastName: string,
      ci: string,
      ciInvitation: string
    }) => {
    const {
      email,
      phone,
      firstName,
      lastName,
      ciInvitation,
      ci
    } = props
    const error: IError[] = []

    if (!isValidEmail(email?.trim())) {
      if (email?.trim().length === 0) {
        error.push({ key: 'email', value: strings('error.completeThisField') })
      } else error.push({ key: 'email', value: strings('form.error.invalidEmail') })
    }
    if (!isValidName(ciInvitation?.trim())) {
      if (ciInvitation?.trim().length === 0) {
        error.push({ key: 'ciInvitation', value: strings('error.completeThisField') })
      } else error.push({ key: 'ciInvitation', value: 'La cedula de quien invito es requerida' })
    }
    if (!isValidName(ci?.trim())) {
      if (ci?.trim().length === 0) {
        error.push({ key: 'ci', value: strings('error.completeThisField') })
      } else error.push({ key: 'ci', value: 'La cedula es requerida' })
    }
    if (!isValidName(phone?.trim())) {
      if (phone?.trim().length === 0) {
        error.push({ key: 'phone', value: strings('error.completeThisField') })
      } else error.push({ key: 'phone', value: 'el numero de telefono es requerido' })
    }
    if (!isValidStringWithoutNumber(firstName?.trim())) {
      if (firstName?.trim().length === 0) {
        error.push({ key: 'firstName', value: strings('error.completeThisField') })
      } else error.push({ key: 'firstName', value: strings('form.error.invalidName') })
    }
    if (!isValidStringWithoutNumber(lastName?.trim())) {
      if (lastName?.trim().length === 0) {
        error.push({ key: 'lastName', value: strings('error.completeThisField') })
      } else error.push({ key: 'lastName', value: strings('form.error.invalidLastName') })
    }
    return error
  }

  static formRequestLogin = (props: { email: string }) => {
    const { email } = props
    const error: IError[] = []

    if (!isValidEmail(email?.trim())) {
      if (email?.trim().length === 0) {
        error.push({ key: 'email', value: strings('error.completeThisField') })
      } else error.push({ key: 'email', value: strings('form.error.invalidEmail') })
    }

    return error
  }

  static formConfirmLogin = (props: { email: string, verificationCode: string }) => {
    const { email, verificationCode } = props
    const error: IError[] = []

    if (!isValidEmail(email?.trim())) {
      if (email?.trim().length === 0) {
        error.push({ key: 'email', value: strings('error.completeThisField') })
      } else error.push({ key: 'email', value: strings('form.error.invalidEmail') })
    }
    if (!isValidVerificationCode(verificationCode?.trim())) {
      if (verificationCode?.trim().length === 0) {
        error.push({ key: 'verificationCode', value: strings('error.completeThisField') })
      } else error.push({ key: 'verificationCode', value: strings('form.error.invalidVerificationCode') })
    }

    return error
  }

  static formPostClient = (
    props: {
      firstName: string,
      lastName: string,
      email?: string,
      companyName: string,
      companyCIF: string,
      companyCountry: string,
      companyRegion?: string,
      companyCity: string,
      companyAddress: string,
      companyPostalCode: string,
      taxIdRequired: boolean,
      regionRequired: boolean,
      isClient?: boolean
    }) => {
    const {
      firstName,
      lastName,
      email = '',
      companyName,
      companyCIF,
      companyAddress,
      companyPostalCode,
      companyCity,
      companyCountry,
      companyRegion,
      taxIdRequired,
      regionRequired,
      isClient
    } = props
    const error: IError[] = []

    if (!isValidStringWithoutNumber(firstName?.trim())) {
      if (firstName?.trim().length === 0) {
        error.push({ key: 'firstName', value: strings('error.completeThisField') })
      } else error.push({ key: 'firstName', value: strings('form.error.invalidName') })
    }
    if (!isValidStringWithoutNumber(lastName?.trim())) {
      if (lastName?.trim().length === 0) {
        error.push({ key: 'lastName', value: strings('error.completeThisField') })
      } else error.push({ key: 'lastName', value: strings('form.error.invalidLastName') })
    }
    if (isClient && !isValidEmail(email?.trim())) {
      if (email?.trim().length === 0) {
        error.push({ key: 'email', value: strings('error.completeThisField') })
      } else error.push({ key: 'email', value: strings('form.error.invalidEmail') })
    }
    if (!isValidString(companyName?.trim())) {
      if (companyName?.trim().length === 0) {
        error.push({ key: 'companyName', value: strings('error.completeThisField') })
      } else error.push({ key: 'companyName', value: strings('form.error.invalidName') })
    }
    if (taxIdRequired && !isValidString(companyCIF?.trim())) { // isValidCIF
      if (companyCIF?.trim().length === 0) {
        error.push({ key: 'companyCIF', value: strings('error.completeThisField') })
      } else error.push({ key: 'companyCIF', value: strings('form.error.invalidCIF') })
    }
    if (!isValidString(companyAddress?.trim())) {
      if (companyAddress?.trim().length === 0) {
        error.push({ key: 'companyAddress', value: strings('error.completeThisField') })
      } else error.push({ key: 'companyAddress', value: strings('form.error.invalidAddress') })
    }
    if (!isValidString(companyPostalCode?.trim())) {
      if (companyPostalCode?.trim().length === 0) {
        error.push({ key: 'companyPostalCode', value: strings('error.completeThisField') })
      } else error.push({ key: 'companyPostalCode', value: strings('form.error.invalidPostalCode') })
    }
    if (!isValidString(companyCity?.trim())) {
      if (companyCity?.trim().length === 0) {
        error.push({ key: 'companyCity', value: strings('error.completeThisField') })
      } else error.push({ key: 'companyCity', value: strings('form.error.invalidCity') })
    }
    if (!isValidSelect(companyCountry?.trim())) {
      if (companyCountry?.trim().length === 0) {
        error.push({ key: 'companyCountry', value: strings('form.error.selectOption') })
      } else error.push({ key: 'companyCountry', value: strings('form.error.pleaseSelect', strings('placeholder.country')) })
    }
    if (regionRequired) {
      if (!companyRegion || (companyRegion && !isValidSelect(companyRegion?.trim()))) {
        if (companyRegion?.trim().length === 0) {
          error.push({ key: 'companyRegion', value: strings('form.error.selectOption') })
        } else error.push({ key: 'companyRegion', value: strings('form.error.pleaseSelect', strings('placeholder.region')) })
      }
    }

    return error
  }

  static formPutUserMe = (
    props: {
      firstName: string,
      lastName: string,
      email?: string,
    }) => {
    const {
      firstName,
      lastName,
      email = '',
    } = props
    const error: IError[] = []

    if (!isValidEmail(email?.trim())) {
      if (email?.trim().length === 0) {
        error.push({ key: 'email', value: strings('error.completeThisField') })
      } else error.push({ key: 'email', value: strings('form.error.invalidEmail') })
    }

    if (!isValidStringWithoutNumber(firstName?.trim())) {
      if (firstName?.trim().length === 0) {
        error.push({ key: 'firstName', value: strings('error.completeThisField') })
      } else error.push({ key: 'firstName', value: strings('form.error.invalidName') })
    }
    if (!isValidStringWithoutNumber(lastName?.trim())) {
      if (lastName?.trim().length === 0) {
        error.push({ key: 'lastName', value: strings('error.completeThisField') })
      } else error.push({ key: 'lastName', value: strings('form.error.invalidLastName') })
    }
    
    return error
  }

  static formInvoiceFiles = (props: { files: IFiles[]; error: IError[] }) => {
    const {
      files,
      error
    } = props

    for (const file of files) {
      const { format } = file

      if (!isValidTypeFile(format)) {
        if (format.length === 0) {
          error.push({ key: 'files', value: strings('error.completeThisField') })
        } else error.push({ key: 'files', value: strings('form.error.invalidFileType') })
      }
    }
  }

  static formInvoiceItems = (props: { lines: ILines[]; error: IError[] }) => {
    const {
      lines,
      error
    } = props

    // eslint-disable-next-line array-callback-return
    lines?.map((line, index) => {
      const { concept, items, amount } = line

      if (Number(amount) <= 0 || isNaN(amount)) {
        error.push({ key: 'amount ' + index, value: strings('form.error.invalidNumber')})
      }
      if (!isValidString(concept?.trim())) {
        if (concept?.trim().length === 0) {
          error.push({ key: 'concept ' + index, value: strings('error.completeThisField') })
        } else error.push({ key: 'concept ' + index, value: strings('form.error.invalidConcept') })
      }
      if (!isValidNumberParseInt(items + '')) {
        if (!items) {
          error.push({ key: 'items ' + index, value: strings('error.completeThisField') })
        } else error.push({ key: 'items ' + index, value: strings('form.error.invalidNumber') })
      }
      if (!isValidNumberParseFloat(amount + '')) {
        if (!amount) {
          error.push({ key: 'amount ' + index, value: strings('error.completeThisField') })
        } else error.push({ key: 'amount ' + index, value: strings('form.error.invalidNumber') })
      }
    })
  }

  static formInvoiceInformation = (
    props: {
      invoiceNumber: string,
      issueDate: string,
      code: string,
      lines: ILines[],
      files: IFiles[]
    }) => {
    const {
      invoiceNumber,
      issueDate,
      code,
      lines,
      files
    } = props
    const error: IError[] = []

    if (!isValidString(invoiceNumber)) {
      if (invoiceNumber?.trim().length === 0) {
        error.push({ key: 'invoiceNumber', value: strings('error.completeThisField') })
      } else error.push({ key: 'invoiceNumber', value: strings('form.error.invalidInvoiceNumber') })
    }
    if (!isValidString(issueDate)) {
      if (issueDate?.trim().length === 0) {
        error.push({ key: 'issueDate', value: strings('form.error.selectDate') })
      } else error.push({ key: 'issueDate', value: strings('form.error.invalidIssueDate') })
    }
    if (!isValidSelect(code?.trim())) {
      if (code?.trim().length === 0) {
        error.push({ key: 'code', value: strings('form.error.selectOption') })
      } else error.push({ key: 'code', value: strings('form.error.pleaseSelect', strings('placeholder.currency')?.toLowerCase()) })
    }
    this.formInvoiceItems({ lines, error })
    this.formInvoiceFiles({ files, error })

    return error
  }

  static formTaxInformation = (props: { name: string; percentage: string }) => {
    const {
      name,
      percentage
    } = props
    const error: IError[] = []

    if (!isValidString(name?.trim())) {
      if (name?.trim().length === 0) {
        error.push({ key: 'name', value: strings('error.completeThisField') })
      } else error.push({ key: 'name', value: strings('form.error.invalidName') })
    }
    if (!isValidNumberParseInt(percentage)) {
      if (!percentage) {
        error.push({ key: 'percentage', value: strings('error.completeThisField') })
      } else error.push({ key: 'percentage', value: strings('form.error.invalidNumber') })
    }

    return error
  }

  // Others

  static formVerificationRequest = (props: { email: string }) => {
    const { email } = props
    const error: IError[] = []

    if (!isValidEmail(email?.trim())) {
      if (email?.trim().length === 0) {
        error.push({ key: 'email', value: strings('error.completeThisField') })
      } else error.push({ key: 'email', value: strings('form.error.invalidEmail') })
    }

    return error
  }

  static formVerificationMode = (props: { optionSelectedVerificationMode: string }) => {
    const { optionSelectedVerificationMode } = props
    const error: IError[] = []

    if (!optionSelectedVerificationMode?.trim()) {
      error.push({
        key: 'optionSelectedVerificationMode',
        value: strings('form.error.selectOption')
      })
    }

    return error
  }

  static formVerificationCode = (props: { codeVerificationCode: string }) => {
    const { codeVerificationCode } = props
    const error: IError[] = []

    if (
      !isValidNumberParseInt(codeVerificationCode?.trim()) ||
      codeVerificationCode?.trim()?.length !== 4
    ) {
      error.push({
        key: 'codeVerificationCode',
        value: strings('form.error.invalidCode')
      })
    }

    return error
  }

  static formOperationalSettings = (
    props: {
      periodLength: any,
      paydaysStart: string,
      advanceLowerLimit: string,
      advanceUpperLimit: string,
      maxAdvancesAllowed: string
    }) => {
    const { periodLength, paydaysStart, advanceLowerLimit, advanceUpperLimit, maxAdvancesAllowed } =
      props
    const error: IError[] = []

    if (!periodLength) {
      error.push({ key: 'periodLength', value: strings('error.completeThisField') })
    }
    if (!isValidNumberParseInt(paydaysStart)) {
      error.push({ key: 'paydaysStart', value: strings('error.completeThisField') })
    }
    if (!isValidNumberParseInt(advanceLowerLimit)) {
      error.push({ key: 'advanceLowerLimit', value: strings('error.completeThisField') })
    }
    if (!isValidNumberParseInt(advanceUpperLimit)) {
      error.push({ key: 'advanceUpperLimit', value: strings('error.completeThisField') })
    }
    if (!isValidNumberParseInt(maxAdvancesAllowed)) {
      error.push({ key: 'maxAdvancesAllowed', value: strings('error.completeThisField') })
    }

    return error
  }

  static formSetupPassword = (props: { passwordSetupPassword: string, repeatPasswordSetupPassword: string }) => {
    const { passwordSetupPassword, repeatPasswordSetupPassword } = props
    const error: IError[] = []

    if (!isValidPassword(passwordSetupPassword?.trim())) {
      if (passwordSetupPassword?.trim().length === 0) {
        error.push({ key: 'passwordSetupPassword', value: strings('error.completeThisField') })
      } else if (passwordSetupPassword?.trim().length < 6) {
        error.push({ key: 'passwordSetupPassword', value: strings('error.password') })
      } else {
        error.push({
          key: 'passwordSetupPassword',
          value: strings('form.error.invalidPasswordUppercase')
        })
      }
    }
    if (
      !isValidPasswordCoincidence(
        passwordSetupPassword?.trim(),
        repeatPasswordSetupPassword?.trim()
      )
    ) {
      error.push({
        key: 'repeatPasswordSetupPassword',
        value: strings('form.error.invalidPasswordCoincidence')
      })
    }

    return error
  }

  static formChangePassword = (props: { oldPassword: string, newPassword: string, repeatNewPassword: string }) => {
    const { oldPassword, newPassword, repeatNewPassword } = props
    const error: IError[] = []

    if (!isValidPassword(oldPassword?.trim())) {
      if (oldPassword?.trim().length === 0) {
        error.push({ key: 'oldPassword', value: strings('error.completeThisField') })
      } else if (oldPassword?.trim().length < 6) {
        error.push({ key: 'oldPassword', value: strings('error.password') })
      } else { error.push({ key: 'oldPassword', value: strings('form.error.invalidPasswordUppercase') }) }
    }
    if (!isValidPassword(newPassword?.trim())) {
      if (newPassword?.trim().length === 0) {
        error.push({ key: 'newPassword', value: strings('error.completeThisField') })
      } else if (newPassword?.trim().length < 6) {
        error.push({ key: 'newPassword', value: strings('error.password') })
      } else { error.push({ key: 'newPassword', value: strings('form.error.invalidPasswordUppercase') }) }
    }
    if (!isValidPasswordCoincidence(newPassword?.trim(), repeatNewPassword?.trim())) {
      if (repeatNewPassword?.trim().length === 0) {
        error.push({ key: 'repeatNewPassword', value: strings('error.completeThisField') })
      } else {
        error.push({
          key: 'repeatNewPassword',
          value: strings('form.error.invalidPasswordCoincidence')
        })
      }
    }

    return error
  }

  static formChangeEmail = (props: { oldEmail: string, newEmail: string }) => {
    const { oldEmail, newEmail } = props
    const error: IError[] = []

    if (!isValidEmail(oldEmail?.trim())) {
      if (oldEmail?.trim().length === 0) {
        error.push({ key: 'oldEmail', value: strings('error.completeThisField') })
      } else error.push({ key: 'oldEmail', value: strings('form.error.invalidEmail') })
    }
    if (!isValidEmail(newEmail?.trim())) {
      if (newEmail?.trim().length === 0) {
        error.push({ key: 'newEmail', value: strings('error.completeThisField') })
      } else error.push({ key: 'newEmail', value: strings('form.error.invalidEmail') })
    }

    return error
  }

  static formContactApp = (props: { subject: string, comments: string }) => {
    const { subject, comments } = props
    const error: IError[] = []

    if (!isValidString(subject?.trim())) {
      error.push({ key: 'subject', value: strings('error.completeThisField') })
    }
    if (!isValidString(comments?.trim())) {
      error.push({ key: 'comments', value: strings('error.completeThisField') })
    }

    return error
  }

  static formForgotPasswordEmail = (props: { email: string }) => {
    const { email } = props
    const error: IError[] = []

    if (!isValidEmail(email?.trim())) {
      if (email?.trim().length === 0) {
        error.push({ key: 'email', value: strings('error.completeThisField') })
      } else error.push({ key: 'email', value: strings('form.error.invalidEmail') })
    }

    return error
  }

  static formForgotPassword = (props: { newPassword: string, repeatPassword: string }) => {
    const { newPassword, repeatPassword } = props
    const error: IError[] = []

    if (!isValidPassword(newPassword?.trim())) {
      if (newPassword?.trim().length === 0) {
        error.push({ key: 'newPassword', value: strings('error.completeThisField') })
      } else if (newPassword?.trim().length < 6) {
        error.push({ key: 'newPassword', value: strings('error.password') })
      } else { error.push({ key: 'newPassword', value: strings('form.error.invalidPasswordUppercase') }) }
    }
    if (!isValidPasswordCoincidence(newPassword, repeatPassword)) {
      error.push({ key: 'repeatPassword', value: strings('form.error.invalidPasswordCoincidence') })
    }

    return error
  }

  static formPostUserCompany = (
    props: IUserCompany) => {
    const {
      firstname,
      lastname,
      email = '',
      companyName,
      address,
      postalCode,
      city,
      companyCountry,
      region,
      regionRequired,
      userType
    } = props
    const error: IError[] = []

    if (!isValidEmail(email?.trim())) {
      if (email?.trim().length === 0) {
        error.push({ key: 'email', value: strings('error.completeThisField') })
      } else error.push({ key: 'email', value: strings('form.error.invalidEmail') })
    }

    if (!isValidStringWithoutNumber(firstname?.trim())) {
      if (firstname?.trim().length === 0) {
        error.push({ key: 'firstname', value: strings('error.completeThisField') })
      } else error.push({ key: 'firstname', value: strings('form.error.invalidName') })
    }
    if (!isValidStringWithoutNumber(lastname?.trim())) {
      if (lastname?.trim().length === 0) {
        error.push({ key: 'lastname', value: strings('error.completeThisField') })
      } else error.push({ key: 'lastname', value: strings('form.error.invalidLastName') })
    }
    if (!isValidString(companyName?.trim())) {
      if (companyName?.trim().length === 0) {
        error.push({ key: 'companyName', value: strings('error.completeThisField') })
      } else error.push({ key: 'companyName', value: strings('form.error.invalidName') })
    }
    if (address && !isValidString(address?.trim())) {
      if (address?.trim().length === 0) {
        error.push({ key: 'address', value: strings('error.completeThisField') })
      } else error.push({ key: 'address', value: strings('form.error.invalidAddress') })
    }
    if (postalCode && !isValidString(postalCode?.trim())) {
      if (postalCode?.trim().length === 0) {
        error.push({ key: 'postalCode', value: strings('error.completeThisField') })
      } else error.push({ key: 'postalCode', value: strings('form.error.invalidPostalCode') })
    }
    if (city && !isValidString(city?.trim())) {
      if (city?.trim().length === 0) {
        error.push({ key: 'city', value: strings('error.completeThisField') })
      } else error.push({ key: 'city', value: strings('form.error.invalidCity') })
    }
    if (!isValidSelect(companyCountry!.trim())) {
      if (companyCountry?.trim().length === 0) {
        error.push({ key: 'companyCountry', value: strings('form.error.selectOption') })
      } else error.push({ key: 'companyCountry', value: strings('form.error.pleaseSelect', strings('placeholder.country')) })
    }
    if (!isValidSelect(userType!.trim())) {
      if (userType?.trim().length === 0) {
        error.push({ key: 'userType', value: strings('form.error.selectOption') })
      } else error.push({ key: 'userType', value: strings('form.error.pleaseSelect', strings('placeholder.userType')) })
    }
    if (regionRequired && companyCountry) {
      if (!region || (region && !isValidSelect(region?.trim()))) {
        if (region?.trim().length === 0) {
          error.push({ key: 'region', value: strings('form.error.selectOption') })
        } else error.push({ key: 'region', value: strings('form.error.pleaseSelect', strings('placeholder.region')) })
      }
    }

    return error
  }

  static formPutUserCompany = (
    props: {newData: EditUserDTO, originalData: IUserCompanyList, regionRequired: boolean}) => {
    const {
      newData, originalData, regionRequired
    } = props
    const error: IError[] = []

    if (newData.userData?.email !== originalData?.email && !isValidEmail(newData.userData?.email!.trim())) {
      if (newData.userData?.email!.trim().length === 0) {
        error.push({ key: 'email', value: strings('error.completeThisField') })
      } else error.push({ key: 'email', value: strings('form.error.invalidEmail') })
    }

    if (newData.userData?.firstname !== originalData?.firstName && !isValidStringWithoutNumber(newData.userData?.firstname!.trim())) {
      if (newData.userData?.firstname!.trim().length === 0) {
        error.push({ key: 'firstname', value: strings('error.completeThisField') })
      } else error.push({ key: 'firstname', value: strings('form.error.invalidName') })
    }
    if (newData.userData?.lastname !== originalData?.lastName && !isValidStringWithoutNumber(newData.userData?.lastname!.trim())) {
      if (newData.userData?.lastname!.trim().length === 0) {
        error.push({ key: 'lastname', value: strings('error.completeThisField') })
      } else error.push({ key: 'lastname', value: strings('form.error.invalidLastName') })
    }
    if (newData?.editCompany && newData.userData?.company?.name !== originalData?.company.name && !isValidString(newData.userData?.company!.name!.trim())) {
      if (newData.userData?.company!.name!.trim().length === 0) {
        error.push({ key: 'companyName', value: strings('error.completeThisField') })
      } else error.push({ key: 'companyName', value: strings('form.error.invalidName') })
    }
    if (newData?.editCompany && newData.userData?.company?.address !== originalData?.company.address && !isValidString(newData.userData?.company!.address!.trim())) {
      if (newData.userData?.company!.address!.trim().length === 0) {
        error.push({ key: 'address', value: strings('error.completeThisField') })
      } else error.push({ key: 'address', value: strings('form.error.invalidAddress') })
    }
    if (newData?.editCompany && newData.userData?.company?.postalCode !== originalData?.company.postalCode && !isValidString(newData.userData?.company!.postalCode!.trim())) {
      if (newData.userData?.company!.postalCode!.trim().length === 0) {
        error.push({ key: 'postalCode', value: strings('error.completeThisField') })
      } else error.push({ key: 'postalCode', value: strings('form.error.invalidPostalCode') })
    }
    if (newData?.editCompany && newData.userData?.company?.city !== originalData?.company.city && !isValidString(newData.userData?.company!.city!.trim())) {
      if (newData.userData?.company!.city!.trim().length === 0) {
        error.push({ key: 'city', value: strings('error.completeThisField') })
      } else error.push({ key: 'city', value: strings('form.error.invalidCity') })
    }
    if (newData?.editCompany && newData.userData?.company?.country !== originalData?.company.country?.code && !isValidSelect(newData.userData?.company!.country!.trim())) {
      if (newData.userData?.company!.country!.trim().length === 0) {
        error.push({ key: 'companyCountry', value: strings('form.error.selectOption') })
      } else error.push({ key: 'companyCountry', value: strings('form.error.pleaseSelect', strings('placeholder.country')) })
    }
    if (newData.userData?.userType !== originalData?.userType && !isValidSelect(newData.userData?.userType!.trim())) {
      if (newData.userData?.userType!.trim().length === 0) {
        error.push({ key: 'userType', value: strings('form.error.selectOption') })
      } else error.push({ key: 'userType', value: strings('form.error.pleaseSelect', strings('placeholder.userType')) })
    }
    if (regionRequired && newData.userData?.company!.country) {
      if (!newData.userData?.company!.region ||
        (newData?.editCompany && newData.userData?.company?.region !== originalData?.company.region &&
          !isValidSelect(newData.userData?.company?.region!.trim()))) {
        if (newData.userData?.company?.region?.trim().length === 0) {
          error.push({ key: 'region', value: strings('form.error.selectOption') })
        } else error.push({ key: 'region', value: strings('form.error.pleaseSelect', strings('placeholder.region')) })
      }
    }

    return error
  }
}
