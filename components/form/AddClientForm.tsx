import { useEffect, useState } from 'react'
import Routing from 'src/routing'
/** components */
import TextInput from 'ui/input/TextInput'
import SelectInput from 'ui/input/SelectInput'
/** modals */
import { AddSuccessModal } from 'components/modal/AddSuccessModal'
/** actions */
import {
  apiPostClient,
  setClientDataProps,
  setValuePostClientData,
  validatePostClient,
  apiGetSupplierClients
} from 'src/client/ClientActions'
import { strings } from 'src/resources/locales/i18n'
import { useDispatch, useSelector } from 'src/redux/hooks'
import { apiGetCountries, apiGetRegions } from 'src/country/CountryActions'
import { Button } from 'ui/Button'
import { getCountries, isFocusHere } from 'src/api/utils'

export const AddClientForm = () => {
  const dispatch = useDispatch()
  const { isLoadingPostDataClient, errorClientData, submitPost, countries, country } = useSelector(({ UserReducer, ClientReducer, CountryReducer }) => {
    const { isLoadingPostDataClient, errorClientData, submitPost } = ClientReducer
    const { countries, country } = CountryReducer
    const { accessToken } = UserReducer

    return { accessToken, isLoadingPostDataClient, errorClientData, submitPost, countries, country }
  })

  const [countrySelect, setCountry] = useState('')
  const [regions, setRegions] = useState([{ value: '', id: '' }])

  const onSubmitPost = async (e) => {
    e.preventDefault()
    !submitPost && dispatch(setClientDataProps({ prop: 'submitPost', value: true }))
    const errorFields = await dispatch(validatePostClient())
    if (errorFields.length === 0) await dispatch(apiPostClient())
    else await getFirstInputErrorId(errorFields)?.focus()
  }

  useEffect(() => {
    dispatch(apiGetCountries())
    return () => {}
  }, [])

  useEffect(() => {
    dispatch(apiGetRegions(countrySelect))
    return () => {}
  }, [countrySelect])

  useEffect(() => {
    const array: {id: string, value: string}[] = []
    if (country) {
      for (const region of country.regions) {
        array.push({ id: region.code, value: region.name })
      }
    }
    setRegions(array)
    return () => {}
  }, [country])

  function getFirstInputErrorId (errorFields) {
    if (errorFields.find(error => isFocusHere(error, 'companyName'))) return document.getElementById('companyName')
    if (country?.taxIdRequired && errorFields.find(error => isFocusHere(error, 'companyCIF'))) return document.getElementById('companyCIF')
    if (errorFields.find(error => isFocusHere(error, 'companyAddress'))) return document.getElementById('companyAddress')
    if (errorFields.find(error => isFocusHere(error, 'companyPostalCode'))) return document.getElementById('companyPostalCode')
    if (errorFields.find(error => isFocusHere(error, 'companyCity'))) return document.getElementById('companyCity')
    if (errorFields.find(error => isFocusHere(error, 'companyCountry'))) return document.getElementById('companyCountry')
    if (errorFields.find(error => isFocusHere(error, 'companyRegion'))) return document.getElementById('companyRegion')
    if (errorFields.find(error => isFocusHere(error, 'firstName'))) return document.getElementById('firstName')
    if (errorFields.find(error => isFocusHere(error, 'lastName'))) return document.getElementById('lastName')
    if (errorFields.find(error => isFocusHere(error, 'email'))) return document.getElementById('email')
    return null
  }

  return (
    <>
      <main className='pt-5 pt-lg-8 bg-surface-secondary'>
        <div className='container-xl'>
          <div className='mt-n56 position-relative z-index-100'>

            <div className='bg-card rounded shadow mb-5'>
              <div className='p-5 p-lg-8 p-xl-12 p-xxl-16'>

                {/** CLIENT FORM */}
                <form>
                  <div className='row align-items-start mb-8 mb-xl-12 mb-xxl-16'>
                    <div className='col-lg-4 mb-5 mb-lg-0'>
                      <h4 className='font-semibold mb-lg-1'>{strings('form.placeholder.companyData')}</h4>
                    </div>
                    <div className='col-lg-8 d-flex flex-column gap-3'>
                      <div className='row g-3'>
                        <div className='col-md-8'>
                          <div className='form-group'>
                            <TextInput
                              classNameInput='form-control-sm form-label'
                              disabled={isLoadingPostDataClient}
                              error={errorClientData}
                              id='companyName'
                              name='companyName'
                              noValidate={false}
                              otherId=''
                              readOnly={false}
                              submit={submitPost}
                              textLabel={strings('form.placeholder.companyName')}
                              type='text'
                              onChange={async (e) => {
                                await dispatch(setValuePostClientData({ prop: e.target.name, value: e.target.value }))
                                submitPost && dispatch(validatePostClient())
                              }}
                            />
                          </div>
                        </div>
                        <div className='col-md-4'>
                          <div className='form-group'>
                            <TextInput
                              classNameInput='form-control-sm form-label'
                              disabled={isLoadingPostDataClient}
                              error={country?.taxIdRequired && errorClientData}
                              id='companyCIF'
                              name='companyCIF'
                              noValidate={false}
                              otherId=''
                              readOnly={false}
                              submit={submitPost}
                              textLabel={strings('form.placeholder.companyCIF')}
                              type='text'
                              onChange={async (e) => {
                                await dispatch(setValuePostClientData({ prop: e.target.name, value: e.target.value }))
                                submitPost && dispatch(validatePostClient())
                              }}
                            />
                          </div>
                        </div>
                      </div>
                      <div className='form-group'>
                        <TextInput
                          classNameInput='form-control-sm form-label'
                          disabled={isLoadingPostDataClient}
                          error={errorClientData}
                          id='companyAddress'
                          name='companyAddress'
                          noValidate={false}
                          otherId=''
                          readOnly={false}
                          submit={submitPost}
                          textLabel={strings('placeholder.address')}
                          type='text'
                          onChange={async (e) => {
                            await dispatch(setValuePostClientData({ prop: e.target.name, value: e.target.value }))
                            submitPost && dispatch(validatePostClient())
                          }}
                        />
                      </div>
                      <div className='row g-3'>
                        <div className='col-md-6'>
                          <div className='form-group'>
                            <TextInput
                              classNameInput='form-control-sm form-label'
                              disabled={isLoadingPostDataClient}
                              error={errorClientData}
                              id='companyPostalCode'
                              name='companyPostalCode'
                              noValidate={false}
                              otherId=''
                              readOnly={false}
                              submit={submitPost}
                              textLabel={strings('placeholder.postalCode')}
                              type='text'
                              onChange={async (e) => {
                                await dispatch(setValuePostClientData({ prop: e.target.name, value: e.target.value }))
                                submitPost && dispatch(validatePostClient())
                              }}
                            />
                          </div>
                        </div>
                        <div className='col-md-6'>
                          <div className='form-group'>
                            <TextInput
                              classNameInput='form-control-sm form-label'
                              disabled={isLoadingPostDataClient}
                              error={errorClientData}
                              id='companyCity'
                              name='companyCity'
                              noValidate={false}
                              otherId=''
                              readOnly={false}
                              submit={submitPost}
                              textLabel={strings('placeholder.city')}
                              type='text'
                              onChange={async (e) => {
                                await dispatch(setValuePostClientData({ prop: e.target.name, value: e.target.value }))
                                submitPost && dispatch(validatePostClient())
                              }}
                            />
                          </div>
                        </div>
                      </div>
                      <div className='row g-3'>
                        <div className='col-md-6'>
                          <div className='form-group'>
                            <SelectInput
                              classNameSelect='form-select form-select-sm form-label'
                              disabled={isLoadingPostDataClient}
                              error={errorClientData}
                              dataChildren={getCountries(countries)}
                              getItemId // true
                              hasMultiple={false}
                              id='companyCountry'
                              noValidate={false}
                              showSelect
                              strDefaultSelect={strings('placeholder.chooseWithId', { id: strings('placeholder.country').toLowerCase() })}
                              submit={submitPost}
                              textLabel={strings('placeholder.country')}
                              onChange={async (e) => {
                                setCountry(e.target.value)
                                await dispatch(setValuePostClientData({ prop: e.target.id, value: e.target.value }))
                                submitPost && dispatch(validatePostClient())
                              }}
                            />
                          </div>
                        </div>
                        <div className='col-md-6'>
                          <div className='form-group'>
                            <SelectInput
                              classNameSelect='form-select form-select-sm form-label'
                              disabled={isLoadingPostDataClient}
                              error={errorClientData}
                              dataChildren={regions}
                              getItemId // true
                              hasMultiple={false}
                              id='companyRegion'
                              noValidate={false}
                              showSelect
                              strDefaultSelect={strings('placeholder.chooseWithId', { id: strings('placeholder.region').toLowerCase() })}
                              textLabel={strings('placeholder.region')}
                              submit={submitPost}
                              onChange={async (e) => {
                                await dispatch(setValuePostClientData({ prop: e.target.id, value: e.target.value }))
                                submitPost && dispatch(validatePostClient())
                              }}
                            />
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className='row align-items-start mb-8 mb-xl-12 mb-xxl-16'>
                    <div className='col-lg-4 mb-5 mb-lg-0'>
                      <h4 className='font-semibold mb-lg-1 mt-5 mt-lg-0'>{strings('form.placeholder.clientData')}</h4>
                    </div>
                    <div className='col-lg-8 d-flex flex-column gap-3'>
                      <div className='row g-3'>
                        <div className='col-md-6'>
                          <div className='form-group'>
                            <TextInput
                              classNameInput='form-control-sm form-label'
                              disabled={isLoadingPostDataClient}
                              error={errorClientData}
                              id='firstName'
                              name='firstName'
                              noValidate={false}
                              otherId=''
                              readOnly={false}
                              submit={submitPost}
                              textLabel={strings('placeholder.firstName')}
                              type='text'
                              onChange={async (e) => {
                                await dispatch(setValuePostClientData({ prop: e.target.name, value: e.target.value }))
                                submitPost && dispatch(validatePostClient())
                              }}
                            />
                          </div>
                        </div>
                        <div className='col-md-6'>
                          <div className='form-group'>
                            <TextInput
                              classNameInput='form-control-sm form-label'
                              disabled={isLoadingPostDataClient}
                              error={errorClientData}
                              id='lastName'
                              name='lastName'
                              noValidate={false}
                              otherId=''
                              readOnly={false}
                              submit={submitPost}
                              textLabel={strings('placeholder.surnames')}
                              type='text'
                              onChange={async (e) => {
                                await dispatch(setValuePostClientData({ prop: e.target.name, value: e.target.value }))
                                submitPost && dispatch(validatePostClient())
                              }}
                            />
                          </div>
                        </div>
                        <div className='col-md-6'>
                          <div className='form-group'>
                            <TextInput
                              classNameInput='form-control-sm form-label'
                              disabled={isLoadingPostDataClient}
                              error={errorClientData}
                              id='email'
                              name='email'
                              noValidate={false}
                              otherId=''
                              readOnly={false}
                              submit={submitPost}
                              textLabel={strings('placeholder.email')}
                              type='text'
                              onChange={async (e) => {
                                await dispatch(setValuePostClientData({ prop: e.target.name, value: e.target.value }))
                                submitPost && dispatch(validatePostClient())
                              }}
                            />
                          </div>
                        </div>
                        <div className='col-md-6'>
                          <div className='form-group'>
                            <TextInput
                              classNameInput='form-control-sm form-label'
                              disabled={isLoadingPostDataClient}
                              error={errorClientData}
                              id='phone'
                              name='phone'
                              noValidate
                              otherId=''
                              readOnly={false}
                              submit={submitPost}
                              textLabel={strings('placeholder.phone') + ' ' + strings('placeholder.optional')}
                              type='text'
                              onChange={async (e) => {
                                await dispatch(setValuePostClientData({ prop: e.target.name, value: e.target.value }))
                                submitPost && dispatch(validatePostClient())
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
                        label={strings('button.addNewClient')}
                        isLoading={isLoadingPostDataClient}
                        onClick={() => onSubmitPost}
                      />

                      <button
                        type='button'
                        id='modal-open-newClientOK'
                        className='d-none'
                        data-bs-target='#modalNewElementOK'
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

      <AddSuccessModal
        redirect
        route={Routing.customers}
        callback={apiGetSupplierClients}
        icon='bi bi-person-plus'
        successText='createClientSuccess'
      />

    </>
  )
}
