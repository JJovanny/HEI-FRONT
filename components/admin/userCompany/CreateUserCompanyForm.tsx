import React, { useEffect, useState } from 'react'
import TextInput from 'ui/input/TextInput'
import SelectInput from 'ui/input/SelectInput'
import { strings } from 'src/resources/locales/i18n'
import { apiGetCountries, apiGetRegions } from 'src/country/CountryActions'
import { useDispatch, useSelector } from 'src/redux/hooks'
import { Button } from 'ui/Button'
import { getCompanyTypes, getCountries, getUserTypes, isFocusHere } from 'src/api/utils'
import { IUserCompanyState } from 'src/types/admin/userCompany'
import { apiPostUserCompany, clearErrorPostUserCompany, clearPostUserCompanyData, setUserCompanyDataProps, setValuePostUserCompany } from 'src/admin/userCompany/UserCompanyActions'
import Routing from 'src/routing'
import { CreateSuccessModal } from './CreateSuccessModal'
import { EUserTypeE } from 'src/types/enums'

export const CreateUserCompanyForm = () => {
  const dispatch = useDispatch()
  const { userCompanyData, isLoadingPostUserCompany, submitPost = false } = useSelector((state) => state.UserCompanyReducer as IUserCompanyState)

  const onSubmitPost = async () => {
     await dispatch(apiPostUserCompany())
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
                              submit={submitPost}
                              textLabel={strings('placeholder.firstName')}
                              type='text'
                              value={userCompanyData.firstname}
                              onChange={async (e) => {
                                await dispatch(setValuePostUserCompany({ prop: e.target.name, value: e.target.value }))
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
                              submit={submitPost}
                              textLabel={strings('placeholder.surnames')}
                              type='text'
                              value={userCompanyData.lastname}
                              onChange={async (e) => {
                                await dispatch(setValuePostUserCompany({ prop: e.target.name, value: e.target.value }))
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
                              submit={submitPost}
                              textLabel={strings('placeholder.email')}
                              type='text'
                              value={userCompanyData.email}
                              onChange={async (e) => {
                                await dispatch(setValuePostUserCompany({ prop: e.target.name, value: e.target.value }))
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
                              submit={submitPost}
                              textLabel={strings('placeholder.password')}
                              type='password'
                              value={userCompanyData.password}
                              onChange={async (e) => {
                                await dispatch(setValuePostUserCompany({ prop: e.target.name, value: e.target.value }))
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
                              submit={submitPost}
                              textLabel="Cedula"
                              type='number'
                              value={userCompanyData.ci}
                              onChange={async (e) => {
                                await dispatch(setValuePostUserCompany({ prop: e.target.name, value: e.target.value }))
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
                              submit={submitPost}
                              textLabel="Cedula de quien invito"
                              type='number'
                              value={userCompanyData.ciInvitation}
                              onChange={async (e) => {
                                await dispatch(setValuePostUserCompany({ prop: e.target.name, value: e.target.value }))
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
                              submit={submitPost}
                              textLabel={strings('placeholder.phone') + ' ' + strings('placeholder.optional')}
                              type='text'
                              defaultValue={userCompanyData.phoneNumber}
                              onChange={async (e) => {
                                await dispatch(setValuePostUserCompany({ prop: e.target.name, value: e.target.value }))
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
                              submit={submitPost}
                              value={userCompanyData?.userType || ''}
                              textLabel={strings('placeholder.userType')}
                              onChange={async (e) => {
                                await dispatch(setValuePostUserCompany({ prop: e.target.id, value: e.target.value }))
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
                        onClick={() => onSubmitPost}
                        disabled={!userCompanyData.ci || !userCompanyData.ciInvitation}
                        label={strings('button.createUser')}
                        isLoading={isLoadingPostUserCompany}
                      />
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

      <CreateSuccessModal
        callback={undefined}
        route={Routing.adminUsers}
        title={strings('placeholder.createUserSuccess')}
        buttonText={strings('button.accept')}
      />

    </>
  )
}
