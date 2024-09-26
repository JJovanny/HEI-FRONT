import { useEffect, useState } from 'react'
import Routing from 'src/routing'
import TextInput from 'ui/input/TextInput'
import SelectInput from 'ui/input/SelectInput'
import { strings } from 'src/resources/locales/i18n'
import { UpdateModal } from 'components/modal/UpdateModal'
import { apiGetSupplierClients, clearClientDataErrors } from 'src/client/ClientActions'
import { useDispatch, useSelector } from 'src/redux/hooks'
import { apiGetRegions } from 'src/country/CountryActions'
import { getCountries } from 'src/api/utils'
import { Button } from 'ui/Button'
import { PaymentPreferences } from './PaymentPreferences'
import { apiGetMySuppliers, apiPatchSupplierPaymentPreferences, clearSupplierDataErrors, setValueSupplierPaymentPreferencesData } from 'src/supplier/SupplierActions'
import { IClientList } from 'src/types/client'
import { ICountry } from 'src/types/country'
import { TextField } from '@mui/material'

type Props = {
  isSupplier: boolean
  user: IClientList
}

export const UserForm = (props: Props) => {
  const dispatch = useDispatch()
  const { isSupplier, user } = props
  const { supplierPaymentPreferences, errorSupplierData, isLoadingGetSuppliers, isLoadingPutDataClient, errorClientData, submitPut, countries, country } = useSelector(({ UserReducer, SupplierReducer, ClientReducer, CountryReducer }) => {
    const { isLoadingPutDataClient, errorClientData, submitPut } = ClientReducer
    const { supplierPaymentPreferences, errorSupplierData, isLoadingGetSuppliers } = SupplierReducer
    const { countries, country } = CountryReducer
    const { accessToken } = UserReducer

    return { accessToken, supplierPaymentPreferences, errorSupplierData, isLoadingGetSuppliers, isLoadingPutDataClient, errorClientData, submitPut, countries, country }
  })

  const { days, allowPaymentInAdvance, discountInAdvance } = supplierPaymentPreferences
  const userCountry: ICountry = typeof user?.companyCountry === 'object' ? user.companyCountry : {} as ICountry

  const [countrySelect] = useState(userCountry?.code || '')
  const [regions, setRegions] = useState([{ value: '', id: '' }])

  const defaulRegionSelect = () => {
    const region = country?.regions?.find((r) => r.code === user?.companyRegion)
    return region?.name ? region.name : ''
  }

  useEffect(() => {
    dispatch(clearClientDataErrors())
    dispatch(clearSupplierDataErrors())
    dispatch(apiGetRegions(countrySelect))
    return () => { }
  }, [countrySelect])

  useEffect(() => {
    const array: { id: string, value: string }[] = []
    if (country) {
      for (const region of country.regions) {
        array.push({ id: region.code, value: region.name })
      }
    }
    setRegions(array)
    return () => { }
  }, [country])

  const onSubmitPut = async (e) => {
    e.preventDefault()
    await dispatch(apiPatchSupplierPaymentPreferences(user.id, true, allowPaymentInAdvance, days, discountInAdvance))
  }

  return (
    <>
      <main className='pt-5 pt-lg-8 bg-surface-secondary'>
        <div className='container-xl'>
          <div className='mt-n56 position-relative z-index-100'>

            <div className='bg-card rounded shadow mb-5'>
              <div className='p-5 p-lg-8 p-xl-12 p-xxl-16'>

                {/** CLIENT/SUPPLIER FORM */}
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
                              disabled={isLoadingPutDataClient}
                              error={isSupplier ? errorSupplierData : errorClientData}
                              id='companyName'
                              name='companyName'
                              noValidate={false}
                              otherId=''
                              readOnly
                              submit={submitPut}
                              textLabel={strings('form.placeholder.companyName')}
                              type='text'
                              value={user.name}
                            />
                          </div>
                        </div>
                        <div className='col-md-4'>
                          <div className='form-group'>
                            <TextInput
                              classNameInput='form-control-sm form-label'
                              disabled={isLoadingPutDataClient}
                              error={isSupplier ? errorSupplierData : errorClientData}
                              id='companyCIF'
                              name='companyCIF'
                              noValidate={false}
                              otherId=''
                              readOnly
                              submit={submitPut}
                              textLabel={strings('form.placeholder.companyCIF')}
                              type='text'
                              value={user.cif}
                            />
                          </div>
                        </div>
                      </div>
                      <div className='form-group'>
                        <TextInput
                          classNameInput='form-control-sm form-label'
                          disabled={isLoadingPutDataClient}
                          error={isSupplier ? errorSupplierData : errorClientData}
                          id='companyAddress'
                          name='companyAddress'
                          noValidate={false}
                          otherId=''
                          readOnly
                          submit={submitPut}
                          textLabel={strings('placeholder.address')}
                          type='text'
                          value={user.companyAddress}
                        />
                      </div>
                      <div className='row g-3'>
                        <div className='col-md-6'>
                          <div className='form-group'>
                            <TextInput
                              classNameInput='form-control-sm form-label'
                              disabled={isLoadingPutDataClient}
                              error={isSupplier ? errorSupplierData : errorClientData}
                              id='companyPostalCode'
                              name='companyPostalCode'
                              noValidate={false}
                              otherId=''
                              readOnly
                              submit={submitPut}
                              textLabel={strings('placeholder.postalCode')}
                              type='text'
                              value={user.postalCode}
                            />
                          </div>
                        </div>
                        <div className='col-md-6'>
                          <div className='form-group'>
                            <TextInput
                              classNameInput='form-control-sm form-label'
                              disabled={isLoadingPutDataClient}
                              error={isSupplier ? errorSupplierData : errorClientData}
                              id='companyCity'
                              name='companyCity'
                              noValidate={false}
                              otherId=''
                              readOnly
                              submit={submitPut}
                              textLabel={strings('placeholder.city')}
                              type='text'
                              value={user.city}
                            />
                          </div>
                        </div>
                      </div>
                      <div className='row g-3'>
                        <div className='col-md-6'>
                          <div className='form-group'>
                            <SelectInput
                              classNameSelect='form-select form-select-sm form-label'
                              disabled
                              error={isSupplier ? errorSupplierData : errorClientData}
                              dataChildren={getCountries(countries)}
                              getItemId // true
                              hasMultiple={false}
                              id='companyCountry'
                              noValidate={false}
                              showSelect
                              strDefaultSelect={countries.find((c) => c.code === userCountry?.code)?.name || strings('placeholder.chooseWithId', { id: strings('placeholder.country').toLowerCase() })}
                              submit={submitPut}
                              textLabel={strings('placeholder.country')}
                            />
                          </div>
                        </div>
                        <div className='col-md-6'>
                          <div className='form-group'>
                            <SelectInput
                              classNameSelect='form-select form-select-sm form-label'
                              disabled
                              error={isSupplier ? errorSupplierData : errorClientData}
                              dataChildren={regions}
                              getItemId // true
                              hasMultiple={false}
                              id='companyRegion'
                              noValidate={false}
                              showSelect
                              strDefaultSelect={defaulRegionSelect() || strings('placeholder.chooseWithId', { id: strings('placeholder.region').toLowerCase() })}
                              textLabel={strings('placeholder.region')}
                              submit={submitPut}
                            />
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className='row align-items-start mb-8 mb-xl-12 mb-xxl-16'>
                    <div className='col-lg-4 mb-5 mb-lg-0'>
                      <h4 className='font-semibold mb-lg-1 mt-5 mt-lg-0'>{strings('form.placeholder.userData')}</h4>
                    </div>
                    <div className='col-lg-8 d-flex flex-column gap-3'>
                      <div className='row g-3'>
                        <div className='col-md-6'>
                          <div className='form-group'>
                            <TextInput
                              classNameInput='form-control-sm form-label'
                              disabled={isLoadingPutDataClient}
                              error={isSupplier ? errorSupplierData : errorClientData}
                              id='firstName'
                              name='firstName'
                              noValidate={false}
                              otherId=''
                              readOnly
                              submit={submitPut}
                              textLabel={strings('placeholder.name')}
                              type='text'
                              value={user.firstName}
                            />
                          </div>
                        </div>
                        <div className='col-md-6'>
                          <div className='form-group'>
                            <TextInput
                              classNameInput='form-control-sm form-label'
                              disabled={isLoadingPutDataClient}
                              error={isSupplier ? errorSupplierData : errorClientData}
                              id='email'
                              name='email'
                              noValidate={false}
                              otherId=''
                              readOnly
                              submit={submitPut}
                              textLabel={strings('placeholder.email')}
                              type='text'
                              value={user.email}
                            />
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className='row align-items-start mb-8 mb-lg-12 mb-xxl-16'>
                    <div className='col-lg-4 col-xxl-3 mb-5 mb-lg-0 mt-5'>
                      <h4 className='mb-2'>{strings('form.placeholder.bankInformation')}</h4>
                    </div>
                    <div className='col-lg-8 offset-xxl-1 d-flex flex-column gap-5'>
                      <div className='row g-5'>
                        <div className='col-md-8'>
                          <div className='form-group mt-5'>
                            <TextField
                              className='form-control form-control-sm_'
                              aria-readonly
                              multiline
                              rows={4}
                              id='bankInformation'
                              name='bankInformation'
                              type='text'
                              value={user?.bankInformation ? user.bankInformation.replace(/\/n/g, '\n') : user?.bankInformation}
                            />
                          </div>
                        </div>
                      </div>

                    </div>
                  </div>

                  {/** Payment preferences */}
                  {isSupplier
                    ? (
                      <>
                        <hr className='mb-16' />

                        {/** preferences */}
                        <PaymentPreferences
                          myPreferences={false}
                          setValues={setValueSupplierPaymentPreferencesData}
                        />

                        {/** Save my preferences changes */}
                        <div className='row'>
                          <div className='col-lg-8 offset-lg-4 d-flex justify-content-center justify-content-lg-start'>
                            <Button
                              type='button'
                              className='btn btn-primary'
                              onClick={() => onSubmitPut}
                              label={strings('button.saveChanges')}
                              isLoading={isLoadingGetSuppliers}
                            />
                            {/** hidden button to display the okey modal */}
                            <button
                              type='button'
                              id='modal-open-updateOK'
                              className='d-none'
                              data-bs-target='#modalUpdateOK'
                              data-bs-toggle='modal'
                            />
                          </div>
                        </div>
                      </>)
                    : <></>}
                </form>
              </div>
            </div>

          </div>
        </div>
      </main>

      <UpdateModal
        success={isSupplier ? 'updateSupplierSuccess' : 'updateClientSuccess'}
        callback={isSupplier ? apiGetMySuppliers : apiGetSupplierClients}
        route={isSupplier ? Routing.suppliers : Routing.customers}
      />

    </>
  )
}
