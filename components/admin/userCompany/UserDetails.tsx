import React, { useEffect, useState } from 'react'
import TextInput from 'ui/input/TextInput'
import SelectInput from 'ui/input/SelectInput'
import { strings } from 'src/resources/locales/i18n'
import { apiGetCountries, apiGetRegions } from 'src/country/CountryActions'
import { useDispatch, useSelector } from 'src/redux/hooks'
import { Button } from 'ui/Button'
import { getCompanyTypes, getCountries, getUserTypes, isFocusHere } from 'src/api/utils'
import { IUserCompanyState } from 'src/types/admin/userCompany'
import { apiDeleteUserCompany, apiGetUserCompanyById, apiPutUserCompany, setUserCompanyDataProps, setValuePutCompany, setValuePutUser, setValuePutUserCompany, validatePutUserCompany, validatePutUserCompanyButton } from 'src/admin/userCompany/UserCompanyActions'
import { EUserType, EUserTypeE, TypeCompany } from 'src/types/enums'
import { EditSuccessModal } from './EditSuccessModal'
import CheckboxInput from 'ui/input/CheckboxInput'
import Loading from 'ui/Loading'
import { DeleteModal } from 'components/modal/DeleteModal'
import Routing from 'src/routing'
import { AdminChecker } from 'src/validations/roles'
import { apiGetClientByCif, setClientSelectedByCif, setFinancialtSelectedByCif, setSearchClient } from 'src/client/ClientActions'


interface User {
  id: string | number;
  pinAccess: boolean;
}

export const UserDetails = () => {
  const dispatch = useDispatch()
  const { searchClient, clients, selectedFinancialId, usersCompany, selectedCustomerId } = useSelector(state => state.ClientReducer)
  const { editUserCompanyDetails, userCompanyDetails, isLoadingPutUserCompany, isLoadingGetUserCompanyById, isLoadingDelUserCompany, errorEditUserCompany, submitPut = false } = useSelector((state) => state.UserCompanyReducer as IUserCompanyState)

  const onSubmitPut = async () => {
    await dispatch(apiPutUserCompany())
  }


  if (isLoadingGetUserCompanyById) {
    return <div className='mt-5'><Loading /></div>
  }


  return (
    <>
      <main className='py-5 py-lg-8 bg-surface-secondary'>
        <div className='container-xl'>
          <div className='mt-n56 position-relative z-index-100'>

            <div className='card mb-6'>
              <div className='card-body p-6 p-lg-8 p-xl-12 p-xxl-16'>

                <form>
                  <div className='row align-items-start mb-8 mb-xl-12 mb-xxl-16'>
                    <div className='col-lg-4 col-xxl-3 mb-5 mb-lg-0'>
                      <h4 className='mb-2'>{strings('form.placeholder.userData')}</h4>
                    </div>
                    <div className='col-lg-8 offset-xxl-1 d-flex flex-column gap-5'>
                      <div className='row g-3'>
                        <div className='col-md-6'>
                          <div className='form-group'>
                            <TextInput
                              classNameInput='form-control form-control-sm_'
                              id='firstname'
                              name='firstname'
                              noValidate={false}
                              otherId=''
                              readOnly={false}
                              submit={submitPut}
                              textLabel={strings('placeholder.firstName')}
                              type='text'
                              value={editUserCompanyDetails.userData?.firstname}
                              onChange={async (e) => {
                                await dispatch(setValuePutUser({ prop: e.target.name, value: e.target.value }))
                              }}
                            />
                          </div>
                        </div>
                        <div className='col-md-6'>
                          <div className='form-group'>
                            <TextInput
                              classNameInput='form-control form-control-sm_'
                              id='lastname'
                              name='lastname'
                              noValidate={false}
                              otherId=''
                              readOnly={false}
                              submit={submitPut}
                              textLabel={strings('placeholder.surnames')}
                              type='text'
                              value={editUserCompanyDetails.userData?.lastname}
                              onChange={async (e) => {
                                await dispatch(setValuePutUser({ prop: e.target.name, value: e.target.value }))
                              }}
                            />
                          </div>
                        </div>
                        <div className='col-md-6'>
                          <div className='form-group'>
                            <TextInput
                              classNameInput='form-control form-control-sm_'
                              id='email'
                              name='email'
                              noValidate={false}
                              otherId=''
                              readOnly={false}
                              submit={submitPut}
                              textLabel={strings('placeholder.email')}
                              type='text'
                              value={editUserCompanyDetails.userData?.email}
                              onChange={async (e) => {
                                await dispatch(setValuePutUser({ prop: e.target.name, value: e.target.value }))
                              }}
                            />
                          </div>
                        </div>
                        <div className='col-md-6'>
                          <div className='form-group'>
                            <TextInput
                              classNameInput='form-control form-control-sm_'
                              id='password'
                              name='password'
                              noValidate={false}
                              otherId=''
                              readOnly={false}
                              submit={submitPut}
                              textLabel={strings('placeholder.password')}
                              type='password'
                              value={editUserCompanyDetails.userData?.password}
                              onChange={async (e) => {
                                await dispatch(setValuePutUser({ prop: e.target.name, value: e.target.value }))
                              }}
                            />
                          </div>
                        </div>
                        <div className='col-md-6'>
                          <div className='form-group'>
                            <TextInput
                              classNameInput='form-control form-control-sm_'
                              id='ci'
                              name='ci'
                              noValidate={false}
                              otherId=''
                              readOnly={false}
                              submit={submitPut}
                              textLabel="Cedula"
                              type='number'
                              value={editUserCompanyDetails.userData?.ci}
                              onChange={async (e) => {
                                await dispatch(setValuePutUser({ prop: e.target.name, value: e.target.value }))
                              }}
                            />
                          </div>
                        </div>
                        <div className='col-md-6'>
                          <div className='form-group'>
                            <TextInput
                              classNameInput='form-control form-control-sm_'
                              id='ciInvitation'
                              name='ciInvitation'
                              noValidate={false}
                              otherId=''
                              readOnly={false}
                              submit={submitPut}
                              textLabel="Cedula de quien invito"
                              type='number'
                              value={editUserCompanyDetails.userData?.ciInvitation}
                              onChange={async (e) => {
                                await dispatch(setValuePutUser({ prop: e.target.name, value: e.target.value }))
                              }}
                            />
                          </div>
                        </div>
                        <div className='col-md-3'>
                          <div className='form-group'>
                            <TextInput
                              classNameInput='form-control form-control-sm_'
                              id='phoneNumber'
                              name='phoneNumber'
                              noValidate
                              otherId=''
                              readOnly={false}
                              submit={submitPut}
                              textLabel={strings('placeholder.phone') + ' ' + strings('placeholder.optional')}
                              type='text'
                              defaultValue={editUserCompanyDetails.userData?.phoneNumber}
                              onChange={async (e) => {
                                await dispatch(setValuePutUser({ prop: e.target.name, value: e.target.value }))
                              }}
                            />
                          </div>
                        </div>
                        <div className='col-md-3'>
                          <div className='form-group'>
                            <SelectInput
                              classNameSelect='form-select form-select-sm_'
                              dataChildren={getUserTypes('userType', EUserTypeE)}
                              getItemId
                              hasMultiple={false}
                              id='userType'
                              noValidate={false}
                              showSelect
                              strDefaultSelect={strings('placeholder.chooseWithId', { id: strings('placeholder.userType').toLowerCase() })}
                              submit={submitPut}
                              value={editUserCompanyDetails.userData?.userType}
                              textLabel={strings('placeholder.userType')}
                              onChange={async (e) => {
                                await dispatch(setValuePutUser({ prop: e.target.id, value: e.target.value }))
                              }}
                            />
                          </div>
                        </div>

                      </div>
                    </div>
                  </div>

                  <div className='row'>
                    <div className='col-lg-8 offset-lg-4 d-flex justify-content-between'>
                      <Button
                        type='button'
                        className='btn btn-primary'
                        onClick={() => onSubmitPut}
                        label={strings('button.saveChanges')}
                        isLoading={isLoadingPutUserCompany}
                      // disabled={validatePutUserCompanyButton(editUserCompanyDetails, userCompanyDetails)}
                      />
                      <AdminChecker>
                        <Button
                          type='button'
                          className='btn btn-danger'
                          label={strings('button.deleteUser')}
                          isLoading={isLoadingDelUserCompany}
                          dataBsTarget='#modalDeleteItem'
                          dataBsToggle='modal'
                        />
                      </AdminChecker>
                      <button
                        type='button'
                        id='modal-open-successOK'
                        className='d-none'
                        data-bs-target='#modalSuccessOK'
                        data-bs-toggle='modal'
                      />
                    </div>
                  </div>

                </form>
              </div>
            </div>

          </div>
        </div>
      </main>

      <EditSuccessModal
        callback={() => {
          dispatch(apiGetUserCompanyById(editUserCompanyDetails.userId))
        }}
        title={strings('placeholder.editUserSuccess')}
        buttonText={strings('button.accept')}
      />
      <DeleteModal
        apiDelete={apiDeleteUserCompany}
        route={Routing.adminUsers}
        callback={null}
        question={strings('placeholder.deleteElementQuestion', { element: strings('placeholder.user').toLowerCase() })}
        warning={strings('placeholder.deleteUserWarning')}
        success={strings('placeholder.deleteElementSuccess', { element: strings('placeholder.user') })}
      />

    </>
  )
}
