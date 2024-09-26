/* eslint max-len: 0 */ // --> OFF

export const isChecked = (checkBoxValue: boolean) => {
  // Check format
  if (!checkBoxValue || typeof checkBoxValue !== 'boolean') return false

  return true
}

export const isValidEmail = (email: string) => {
  const regex =
    // eslint-disable-next-line no-useless-escape
    /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/

  // Check format
  if (!email || typeof email !== 'string') return false

  return regex.test(email)
}

export const isValidVerificationCode = (verificationCode: string) => {
  // Check format
  if (!verificationCode || typeof verificationCode !== 'string') return false

  // Check format (Ex: 301207)
  if (!/^\d{6}$/g.test(verificationCode)) return false

  // Check length
  return verificationCode.length === 6
}

export const isValidCIF = (cif: string) => {
  // Check format
  if (!cif || typeof cif !== 'string') return false

  // Check format
  // if (!/^\d{6}$/g.test(cif)) return false

  // Check length
  return cif.length === 9
}

export const isValidDate = (date: string) => {
  // Check format
  if (!date || typeof date !== 'string') return false

  // Check format (year-month-day) or (year/month/day)
  if (
    !/^\d{4}-\d{2}-\d{2}$/g.test(date)) return false

  // Check length
  return date.length > 0
}

export const isValidLoginForm = (email: string) => {
  return isValidEmail(email)
}

export const isValidName = (name: string) => {
  // Check format
  if (!name || typeof name !== 'string') return false

  // Check length
  return name.length > 0
}

export const isValidNumber = (value: number) => {
  // Check format
  return (!value || typeof value !== 'number')
}

export const isValidPositivedNumber = (value: number) => {
  // Check format
  if (!value || typeof value !== 'number') return false

  // Check length
  return value > 0
}

export const isValidNumberParseInt = (value: string) => {
  if (!/^[0-9]*$/g.test(value)) return false

  return !!(parseInt(value) || parseInt(value) === 0)
}

export const isValidNumberParseFloat = (value: string) => {
  return !!(parseFloat(value) || parseFloat(value) === 0)
}

export const isValidObject = (value: object) => {
  // Check format
  if (!value || typeof value !== 'object') return false

  // Check length
  return true
}

export const isValidPassword = (password: string) => {
  // Check format
  if (!password || typeof password !== 'string') return false

  if (!/([a-z]+[A-Z]+[a-zA-Z]*)|([a-z]*[A-Z]+[a-z]+[a-zA-Z]*)/g.test(password)) return false

  // if (!/\d+/g.test(password)) return false;

  // Check length
  return password.length >= 6
}

export const isValidPasswordCoincidence = (password: string, passwordRepeat: string) => {
  // Check format
  if (
    !password ||
    !passwordRepeat ||
    typeof password !== 'string' ||
    typeof passwordRepeat !== 'string'
  ) { return false }

  // Check length
  if (password.length !== passwordRepeat.length) return false

  // Check passwords
  return password.trim() === passwordRepeat.trim()
}

export const isValidPhone = (phone: string) => {
  // Check format
  if (!phone || typeof phone !== 'string') return false

  if (!/^(\d{3}\s{0,1}){3}$/g.test(phone) && !/^\d{3}(\s\d{2}){3}$/g.test(phone)) return false

  // Check length
  return phone.length >= 9
}

export const isValidPostalCode = (postalCode: string) => {
  // Check format
  if (!postalCode || typeof postalCode !== 'string') return false

  // Check format (Ex: 30120)
  if (!/^\d{5}$/g.test(postalCode)) return false

  // Check length
  return postalCode.length >= 4
}

export const isValidSelect = (value: string) => {
  // Check value
  return value !== '' && value !== '0'
}

export const isValidString = (value: string) => {
  // Check format
  if (!value || typeof value !== 'string') return false

  // Check length
  return value.length > 0
}

export const isValidStringWithoutNumber = (value: string) => {
  // Check format
  if (!value || typeof value !== 'string') return false

  if (/\d/g.test(value)) return false

  // Check length
  return value.length > 0
}

export const isValidTextArea = (value: string, minLength: number) => {
  // Check format
  if (!value || typeof value !== 'string') return false

  // Check length
  return value.length > minLength
}

export const isValidTypeFile = (type: string) => {
  // Check PDF format
  if (/^(pdf)$/g.test(type)) return true

  // Check DOC format
  if (/^(docx{0,1})$/g.test(type)) return true

  // Check XML format
  if (/^(xml)$/g.test(type)) return true

  // Check image format
  if (/^(png)$/g.test(type) || /^(jpe{0,1}g)$/g.test(type)) return true

  return false
}

export const isValidContainLetter = (value: string) => {
  if (/[a-zA-Z]/g.test(value)) return true

  return false
}

export const isValidBankAccount = (value: string) => {
  if (/[a-zA-Z]{2}[0-9]{2}[a-zA-Z0-9]{4}[0-9]{7}([a-zA-Z0-9]?){0,16}/g.test(value)) return true

  return false
}
