import { IError } from './global'

export interface ILoginState {
  postDataLogin: {
    email: string,
    verificationCode: string
  },
  hps: boolean,
  isLoadingPostDataLogin: boolean,
  errorLoginData: IError[],
  submitPost: boolean
}
