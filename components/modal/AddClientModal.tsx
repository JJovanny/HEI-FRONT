import { useEffect, useState } from 'react'
import TextInput from 'ui/input/TextInput'
import SelectInput from 'ui/input/SelectInput'
import { strings } from 'src/resources/locales/i18n'
import {
  setClientDataProps,
  setValuePostClientData,
  validatePostClient
} from 'src/client/ClientActions'
import { useDispatch, useSelector } from 'src/redux/hooks'
import { apiGetCountries, apiGetRegions } from 'src/country/CountryActions'
import { apiPostValidateUserForInvoice, postNewInvoiceClient } from 'src/invoice/InvoiceActions'
import { getCountries, isFocusHere } from 'src/api/utils'

export const AddClientModal = () => {
  const dispatch = useDispatch()

  const { client, isLoadingPostDataClient, errorClientData, submitPost, countries, country } = useSelector(({ UserReducer, ClientReducer, CountryReducer }) => {
    const { client, isLoadingPostDataClient, errorClientData, submitPost } = ClientReducer
    const { countries, country } = CountryReducer
    const { accessToken } = UserReducer

    return { accessToken, client, isLoadingPostDataClient, errorClientData, submitPost, countries, country }
  })

  const [countrySelect, setCountry] = useState('')
  const [regions, setRegions] = useState([{ value: '', id: '' }])

  const {
    firstName,
    lastName,
    email,
    companyName,
    companyCIF,
    companyAddress,
    companyPostalCode,
    companyCity,
    companyCountry,
    companyRegion
  } = client

  const onSubmitPost = async (e) => {
    e.preventDefault()
    !submitPost && dispatch(setClientDataProps({ prop: 'submitPost', value: true }))
    const errorFields = await dispatch(validatePostClient())
    if (errorFields.length === 0) {
      await dispatch(postNewInvoiceClient(client))
      await dispatch(apiPostValidateUserForInvoice())
    } else await getFirstInputErrorId(errorFields)?.focus()
  }

  useEffect(() => {
    dispatch(apiGetCountries())
    return () => {}
  }, [])

  useEffect(() => {
    dispatch(apiGetRegions(countrySelect))
    submitPost && dispatch(validatePostClient())
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
    submitPost && dispatch(validatePostClient())
    return () => {}
  }, [country])

  useEffect(() => {
    submitPost && dispatch(validatePostClient())
    return () => {}
  }, [firstName, lastName, email, companyName, companyCIF, companyAddress, companyPostalCode, companyCity, companyCountry, companyRegion])

  function getFirstInputErrorId (errorFields) {
    if (errorFields.find(error => isFocusHere(error, 'companyName'))) return document.getElementById('companyName')
    if (/* country?.taxIdRequired && */ errorFields.find(error => isFocusHere(error, 'companyCIF'))) return document.getElementById('companyCIF')
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
      <div className='modal fade' id='modalNewClient' data-bs-backdrop='static' data-bs-keyboard='false' tabIndex={-1} aria-labelledby='modal_example' aria-hidden='true'>
        <div className='modal-dialog modal-dialog-scrollable modal-dialog-centered modal-xl'>
          <div className='modal-content shadow-3'>
            <div className='modal-header py-4'>
              <h5 className='modal-title'>{strings('placeholder.newClient')}</h5>
              <div className='text-xs ms-auto'>
                <button type='button' id='closeNewClientModal' className='btn-close' data-bs-dismiss='modal' aria-label='Close' />
              </div>
            </div>
            <div className='modal-body py-10'>
              {/** ADD CLIENT FORM */}
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
                            value={companyName}
                            onChange={async (e) => {
                              await dispatch(setValuePostClientData({ prop: e.target.name, value: e.target.value }))
                            }}
                          />
                        </div>
                      </div>
                      <div className='col-md-4'>
                        <div className='form-group'>
                          {/** If you need use the tax id required by the region change the options by the comments */}
                          <TextInput
                            classNameInput='form-control-sm form-label'
                            disabled={isLoadingPostDataClient}
                            error={errorClientData} // (country?.taxIdRequired) && errorClientData
                            id='companyCIF'
                            name='companyCIF'
                            otherId=''
                            noValidate={false} // !(country?.taxIdRequired)
                            readOnly={false}
                            submit={submitPost}
                            textLabel={strings('form.placeholder.companyCIF')}
                            // textLabel={country?.taxIdRequired ? strings('form.placeholder.companyCIF') : strings('form.placeholder.companyCIF') + ' ' + strings('placeholder.optional')}
                            type='text'
                            value={companyCIF}
                            onChange={async (e) => {
                              await dispatch(setValuePostClientData({ prop: e.target.name, value: e.target.value }))
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
                        value={companyAddress}
                        onChange={async (e) => {
                          await dispatch(setValuePostClientData({ prop: e.target.name, value: e.target.value }))
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
                            value={companyPostalCode}
                            onChange={async (e) => {
                              await dispatch(setValuePostClientData({ prop: e.target.name, value: e.target.value }))
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
                            value={companyCity}
                            onChange={async (e) => {
                              await dispatch(setValuePostClientData({ prop: e.target.name, value: e.target.value }))
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
                            dataChildren={getCountries(countries)}
                            disabled={isLoadingPostDataClient}
                            error={errorClientData}
                            getItemId // true
                            hasMultiple={false}
                            id='companyCountry'
                            noValidate={false}
                            showSelect
                            strDefaultSelect={strings('placeholder.chooseWithId', { id: strings('placeholder.country').toLowerCase() })}
                            submit={submitPost}
                            textLabel={strings('placeholder.country')}
                            value={companyCountry}
                            onChange={async (e) => {
                              setCountry(e.target.value)
                              await dispatch(setValuePostClientData({ prop: e.target.id, value: e.target.value }))
                              await dispatch(setValuePostClientData({ prop: 'companyRegion', value: undefined }))
                            }}
                          />
                        </div>
                      </div>
                      <div className='col-md-6'>
                        <div className='form-group'>
                          <SelectInput
                            classNameSelect='form-select form-select-sm form-label'
                            dataChildren={regions}
                            disabled={isLoadingPostDataClient || regions.length <= 0}
                            error={errorClientData}
                            getItemId // true
                            hasMultiple={false}
                            id='companyRegion'
                            noValidate={false}
                            showSelect
                            strDefaultSelect={strings('placeholder.chooseWithId', { id: strings('placeholder.region').toLowerCase() })}
                            submit={submitPost}
                            textLabel={strings('placeholder.region')}
                            value={companyRegion || ''}
                            onChange={async (e) => {
                              await dispatch(setValuePostClientData({ prop: e.target.id, value: e.target.value }))
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
                            value={firstName}
                            onChange={async (e) => {
                              await dispatch(setValuePostClientData({ prop: e.target.name, value: e.target.value }))
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
                            value={lastName}
                            onChange={async (e) => {
                              await dispatch(setValuePostClientData({ prop: e.target.name, value: e.target.value }))
                            }}
                          />
                        </div>
                      </div>
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
                          value={email}
                          onChange={async (e) => {
                            await dispatch(setValuePostClientData({ prop: e.target.name, value: e.target.value }))
                          }}
                        />
                        <p className='fw-lighter'>{strings('placeholder.emailRequiredInfo')}</p>
                      </div>
                    </div>
                  </div>
                </div>

                <div className='row'>
                  <div className='col-lg-8 offset-lg-4 d-flex justify-content-center justify-content-lg-start'>
                    <button type='button' className='btn btn-primary' onClick={onSubmitPost}>
                      {strings('button.createNewClient')}
                    </button>
                  </div>
                </div>
              </form>

            </div>
          </div>
        </div>
      </div>

    </>
  )
}
