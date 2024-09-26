import React, { useEffect, useState } from 'react'
import Routing from 'src/routing'
import TextInput from 'ui/input/TextInput'
import { strings } from 'src/resources/locales/i18n'
import { DeleteModal } from 'components/modal/DeleteModal'
import { UpdateModal } from 'components/modal/UpdateModal'
import {
  apiPutUser,
  setUserDataProps,
  setValuePutDataUser,
  validatePutUser,
  apiDeleteUser,
  setUserLogout,
  clearChangeEmailData,
  clearUserDataErrors,
  apiGetUserMe
} from 'src/user/UserActions'
import {  apiGetSupplierClients } from 'src/client/ClientActions'
import { useDispatch, useSelector } from 'src/redux/hooks'
import { Button } from 'ui/Button'
import { isFocusHere } from 'src/api/utils'
import { IUser } from 'src/types/user'
import { IError } from 'src/types/global'
import {  TypeCompany } from 'src/types/enums'
import { ChangePassword } from './ChangePassword'
import { IInvoiceState } from 'src/types/invoice'
import { ChangePIN } from './ChangePIN'

export const ProfileForm = () => {
  const dispatch = useDispatch()
  const { putDataUser, isLoadingPutDataUser, companyBranchSelected, errorUserData, submitPut, countries, country, currencies } = useSelector(({ UserReducer, CountryReducer, InvoiceReducer }) => {
    const { putDataUser, isLoadingPutDataUser, errorUserData, submitPut }: { putDataUser: IUser, isLoadingPutDataUser: boolean, errorUserData: IError[], submitPut: boolean } = UserReducer
    const { countries, country } = CountryReducer
    const { currencies } = InvoiceReducer as IInvoiceState
    const { dataUser: { companyBranchSelected } } = UserReducer
    return { putDataUser, isLoadingPutDataUser, currencies, companyBranchSelected, errorUserData, submitPut, countries, country }
  })


  useEffect(() => {
    dispatch(clearChangeEmailData())
    dispatch(clearUserDataErrors())
  }, [])


  useEffect(() => {
    dispatch(apiGetUserMe())
  }, [])

  useEffect(() => {
    submitPut && dispatch(validatePutUser())
    return () => { }
  }, [putDataUser])


  const onSubmitPut = async () => {
    !submitPut && dispatch(setUserDataProps({ prop: 'submitPut', value: true }))
    const errorFields = await dispatch(validatePutUser())
    if (errorFields.length === 0) {
      await dispatch(apiPutUser())
    }
    else await getFirstInputErrorId(errorFields)?.focus()
  }

  function getFirstInputErrorId(errorFields) {
    if (errorFields.find(error => isFocusHere(error, 'firstName'))) return document.getElementById('firstName')
    if (errorFields.find(error => isFocusHere(error, 'lastName'))) return document.getElementById('lastName')
    if (errorFields.find(error => isFocusHere(error, 'email'))) return document.getElementById('email')
    return null
  }

  return (
    <>
      <main className='py-5 py-lg-8 bg-surface-secondary'>
        <div className='container-xl'>
          <div className='mt-n56 position-relative z-index-100'>

            <div className='card mb-6'>
              <div className='card-body p-6 p-lg-8 p-xl-12 p-xxl-16'>

                {/** USER FORM */}
                <form>

                  <div className='row justify-content-end d-flex align-items-end mb-8 mb-lg-12 mb-xxl-16'>
                    <div className='justify-content-end d-flex align-items-end col-lg-4 col-xxl-3 mb-5 mb-lg-0'>
                      <button
                        type='button'
                        data-bs-target='#inviteCompanyUserModal'
                        data-bs-toggle='modal'
                        className='btn btn-sm btn-primary d-lg-inline-flex mx-1'>
                        <span className='pe-1'>
                          <i className='bi bi-person-plus' />
                        </span>
                        <span className='d-none d-lg-inline ps-lg-1'>{strings('title.admin.createUser')}</span>
                      </button>
                    </div>
                  </div>

                  <div className='row align-items-start mb-8 mb-xl-12 mb-xxl-16'>
                    <div className='col-lg-4 col-xxl-3 mb-5 mb-lg-0'>
                      <h4 className='mb-2'>{strings('form.placeholder.userData')}</h4>
                      {/* <p className='text-sm text-muted'>{strings('form.placeholder.profileDescription')}</p> */}
                    </div>
                    <div className='col-lg-8 offset-xxl-1 d-flex flex-column gap-5'>
                      <div className='row g-3'>
                        <div className='col-md-6'>
                          <div className='form-group'>
                            <TextInput
                              classNameInput='form-control form-control-sm_'
                              disabled={isLoadingPutDataUser}
                              error={errorUserData}
                              id='firstName'
                              name='firstName'
                              noValidate={false}
                              otherId=''
                              readOnly={false}
                              submit={submitPut}
                              textLabel={strings('placeholder.firstName')}
                              type='text'
                              value={putDataUser.firstName}
                              onChange={async (e) => {
                                await dispatch(setValuePutDataUser({ prop: e.target.name, value: e.target.value }))
                              }}
                            />
                          </div>
                        </div>
                        <div className='col-md-6'>
                          <div className='form-group'>
                            <TextInput
                              classNameInput='form-control form-control-sm_'
                              disabled={isLoadingPutDataUser}
                              error={errorUserData}
                              id='lastName'
                              name='lastName'
                              noValidate={false}
                              otherId=''
                              readOnly={false}
                              submit={submitPut}
                              textLabel={strings('placeholder.surnames')}
                              type='text'
                              value={putDataUser.lastName}
                              onChange={async (e) => {
                                await dispatch(setValuePutDataUser({ prop: e.target.name, value: e.target.value }))
                              }}
                            />
                          </div>
                        </div>
                        <div className='col-md-6'>
                          <div className='form-group'>
                            <TextInput
                              classNameInput='form-control form-control-sm_'
                              disabled
                              error={errorUserData}
                              id='email'
                              name='email'
                              noValidate={false}
                              otherId=''
                              readOnly
                              submit={submitPut}
                              textLabel={strings('placeholder.email')}
                              type='text'
                              value={putDataUser.email}
                              onChange={async (e) => {
                                await dispatch(setValuePutDataUser({ prop: e.target.name, value: e.target.value }))
                              }}
                            />
                          </div>
                        </div>
                        <div className='col-md-6'>
                          <div className='form-group'>
                            <TextInput
                              classNameInput='form-control form-control-sm_'
                              disabled={isLoadingPutDataUser}
                              error={errorUserData}
                              id='phone'
                              name='phone'
                              noValidate
                              otherId=''
                              readOnly={false}
                              submit={submitPut}
                              textLabel={strings('placeholder.phone') + ' ' + strings('placeholder.optional')}
                              type='text'
                              defaultValue={putDataUser.phone}
                              onChange={async (e) => {
                                await dispatch(setValuePutDataUser({ prop: e.target.name, value: e.target.value }))
                              }}
                            />
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
            

                  <div className='row'>
                    <div className='col-lg-8 offset-lg-4 d-flex justify-content-center justify-content-lg-start'>
                      <Button
                        type='button'
                        className='btn btn-primary'
                        onClick={() => onSubmitPut}
                        label={strings('button.saveChanges')}
                        isLoading={isLoadingPutDataUser}
                      />
                      <button
                        type='button'
                        id='modal-open-updateOK'
                        className='d-none'
                        data-bs-target='#modalUpdateOK'
                        data-bs-toggle='modal'
                      />
                    </div>
                  </div>

                  <hr className='mb-16' />
                  <ChangePassword />
                  {(putDataUser.typeCompany === TypeCompany.CORPORATION && putDataUser.pinAccess) && (
                    <>
                      <hr className='mb-16' />
                      <ChangePIN />
                    </>
                  )}

                </form>
              </div>
            </div>


            {/* Delete account  */}
            <div className='bg-card rounded shadow mb-0 text-center text-lg-start'>
              <div className='card-body p-6 p-lg-8 px-xl-12 px-xxl-16 d-lg-flex align-items-center'>
                <div className='pe-lg-20'>
                  <div className='h4 text-danger mb-2'>{strings('form.placeholder.deleteSupplierTitle')}</div>
                  {/* <p className='text-sm text-muted mb-3 mb-lg-0'>
                    {strings('form.placeholder.deleteSupplierDescription')}
                  </p> */}
                </div>
                <div className='ms-auto'>

                  <Button
                    type='button'
                    className='btn btn-sm btn-outline-danger'
                    onClick={() => null}
                    label={strings('button.delete')}
                    isLoading={isLoadingPutDataUser}
                    dataBsToggle='modal'
                    dataBsTarget='#modalDeleteItem'

                  />
                </div>
              </div>
            </div>

          </div>
        </div>
      </main>

      <UpdateModal
        success='updateUserSuccess'
        callback={apiGetSupplierClients}
        route={Routing.profile}
      />

      <DeleteModal
        id=''
        apiDelete={apiDeleteUser}
        route={Routing.login}
        callback={setUserLogout}
        question={strings('placeholder.deleteAccountQuestion')}
        warning={strings('placeholder.deleteAccountWarning')}
        success={strings('placeholder.deleteAccountSuccess')}
      />
    </>
  )
}
