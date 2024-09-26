export default class LoginManager {
  static getEmail = (data) => {
    return data?.email ? data.email : ''
  }

  static getVerificationCode = (data) => {
    return data?.verificationCode ? data.verificationCode : ''
  }
}
