import { useEffect, useState } from 'react'
import TextInput from 'ui/input/TextInput'
import SelectInput from 'ui/input/SelectInput'
import { strings } from 'src/resources/locales/i18n'
import { useDispatch, useSelector } from 'src/redux/hooks'
import { apiGetRegions } from 'src/country/CountryActions'
import { getCountries } from 'src/api/utils'
import { InvoiceFilesList } from 'components/invoice/InvoiceFilesList'
import { Button } from 'ui/Button'
import { useRouter } from 'next/navigation'
import Routing from 'src/routing'
import { AddSuccessModal } from 'components/modal/AddSuccessModal'
import { DeleteModal } from 'components/modal/DeleteModal'
import { apiDeleteOnboarding, apiPostApproveOnboarding } from 'src/admin/onboardingProfile/OnboardingProfileActions'
import { EOnboardProfileStatus } from 'src/types/enums'

export const OnboardingProfileForm = () => {
  const dispatch = useDispatch()
  const router = useRouter()

  const { onboardingProfile, isLoadingOnboardingProfile, errorOnboardingProfilesData, countries, country } = useSelector(({ OnboardingProfileReducer, CountryReducer }) => {
    const { onboardingProfile, isLoadingOnboardingProfile, errorOnboardingProfilesData } = OnboardingProfileReducer
    const { countries, country } = CountryReducer

    return { onboardingProfile, isLoadingOnboardingProfile, errorOnboardingProfilesData, countries, country }
  })
  const { status } = onboardingProfile
  const accepted = status === EOnboardProfileStatus.ACCEPTED

  const [countrySelect] = useState(onboardingProfile?.company?.country || '')
  const [regions, setRegions] = useState([{ value: '', id: '' }])

  const defaulRegionSelect = () => {
    const region = country?.regions?.find((r) => r.name.toLowerCase() === (onboardingProfile?.company?.state?.toLowerCase() || ''))
    return region?.name ? region.name : ''
  }

  const getFinancialCases = () => {
    let financialCases = ''

    // eslint-disable-next-line array-callback-return
    onboardingProfile?.company?.financialCases?.map((financialCase, index) => {
      if (index === onboardingProfile?.company?.financialCases?.length - 1) financialCases += financialCase.toLowerCase()
      else financialCases += financialCase.toLowerCase() + ', '
    })

    return financialCases
  }

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

  const handleClickGoBack = () => {
    router.push(Routing.adminOnboardingProfiles)
  }

  const handleClickApprove = () => {
    dispatch(apiPostApproveOnboarding(onboardingProfile?.id))
  }

  return (
    <>
      <main className='pt-5 pt-lg-8 bg-surface-secondary'>
        <div className='container-xl'>
          <div className='mt-n56 position-relative z-index-100'>

            <div className='bg-card rounded shadow mb-5'>
              <div className='p-5 p-lg-8 p-xl-12 p-xxl-16'>

                {/** Manage onboarding profile form */}
                <form>
                  {/** company information */}
                  <div className='row align-items-start mb-8 mb-xl-12 mb-xxl-16'>
                    <div className='col-lg-4 mb-5 mb-lg-0'>
                      <h4 className='font-semibold mb-lg-1'>{strings('form.placeholder.companyData')}</h4>
                    </div>
                    <div className='col-lg-8 d-flex flex-column gap-3'>
                      <div className='form-group'>
                        <TextInput
                          classNameInput='form-control-sm form-label'
                          disabled
                          error={errorOnboardingProfilesData}
                          id='companyName'
                          name='companyName'
                          noValidate={false}
                          otherId=''
                          readOnly
                          textLabel={strings('form.placeholder.companyName')}
                          type='text'
                          defaultValue={onboardingProfile?.company?.companyName || ''}
                        />
                      </div>
                      <div className='form-group'>
                        <TextInput
                          classNameInput='form-control-sm form-label'
                          disabled
                          error={errorOnboardingProfilesData}
                          id='companyAddress'
                          name='companyAddress'
                          noValidate={false}
                          otherId=''
                          readOnly
                          textLabel={strings('placeholder.address')}
                          type='text'
                          defaultValue={onboardingProfile?.company?.address || ''}
                        />
                      </div>
                      <div className='row g-3'>
                        <div className='col-md-6'>
                          <div className='form-group'>
                            <TextInput
                              classNameInput='form-control-sm form-label'
                              disabled
                              error={errorOnboardingProfilesData}
                              id='companyPostalCode'
                              name='companyPostalCode'
                              noValidate={false}
                              otherId=''
                              readOnly
                              textLabel={strings('placeholder.postalCode')}
                              type='text'
                              defaultValue={onboardingProfile?.company?.postalCode || ''}
                            />
                          </div>
                        </div>
                        <div className='col-md-6'>
                          <div className='form-group'>
                            <TextInput
                              classNameInput='form-control-sm form-label'
                              disabled
                              error={errorOnboardingProfilesData}
                              id='companyCity'
                              name='companyCity'
                              noValidate={false}
                              otherId=''
                              readOnly
                              textLabel={strings('placeholder.city')}
                              type='text'
                              defaultValue={onboardingProfile?.company?.city || ''}
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
                              error={errorOnboardingProfilesData}
                              dataChildren={getCountries(countries)}
                              getItemId // true
                              hasMultiple={false}
                              id='companyCountry'
                              noValidate={false}
                              showSelect
                              strDefaultSelect={countries.find((c) => c.code === onboardingProfile?.company?.country)?.name || strings('placeholder.chooseWithId', { id: strings('placeholder.country').toLowerCase() })}
                              textLabel={strings('placeholder.country')}
                            />
                          </div>
                        </div>
                        <div className='col-md-6'>
                          <div className='form-group'>
                            <SelectInput
                              classNameSelect='form-select form-select-sm form-label'
                              disabled
                              error={errorOnboardingProfilesData}
                              dataChildren={regions}
                              getItemId // true
                              hasMultiple={false}
                              id='companyRegion'
                              noValidate={false}
                              showSelect
                              strDefaultSelect={defaulRegionSelect() || strings('placeholder.chooseWithId', { id: strings('placeholder.region').toLowerCase() })}
                              textLabel={strings('placeholder.region')}
                            />
                          </div>
                        </div>
                        <div className='form-group'>
                          <TextInput
                            classNameInput='form-control-sm form-label'
                            disabled
                            error={errorOnboardingProfilesData}
                            id='companySector'
                            name='companySector'
                            noValidate={false}
                            otherId=''
                            readOnly
                            textLabel={strings('placeholder.companySector')}
                            type='text'
                            defaultValue={onboardingProfile?.company?.sector || ''}
                          />
                        </div>
                        <div className='form-group'>
                          <TextInput
                            classNameInput='form-control-sm form-label'
                            disabled
                            error={errorOnboardingProfilesData}
                            id='financialCases'
                            name='financialCases'
                            noValidate={false}
                            otherId=''
                            readOnly
                            textLabel={strings('placeholder.financialCases')}
                            type='text'
                            defaultValue={getFinancialCases()}
                          />
                        </div>
                      </div>
                    </div>
                  </div>

                  {/** user information */}
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
                              disabled
                              error={errorOnboardingProfilesData}
                              id='firstName'
                              name='firstName'
                              noValidate={false}
                              otherId=''
                              readOnly
                              textLabel={strings('placeholder.firstName')}
                              type='text'
                              defaultValue={onboardingProfile?.user?.firstName || ''}
                            />
                          </div>
                        </div>
                        <div className='col-md-6'>
                          <div className='form-group'>
                            <TextInput
                              classNameInput='form-control-sm form-label'
                              disabled
                              error={errorOnboardingProfilesData}
                              id='lastName'
                              name='lastName'
                              noValidate={false}
                              otherId=''
                              readOnly
                              textLabel={strings('placeholder.surnames')}
                              type='text'
                              defaultValue={onboardingProfile?.user?.lastName || ''}
                            />
                          </div>
                        </div>
                        <div className='col-md-6'>
                          <div className='form-group'>
                            <TextInput
                              classNameInput='form-control-sm form-label'
                              disabled
                              error={errorOnboardingProfilesData}
                              id='email'
                              name='email'
                              noValidate={false}
                              otherId=''
                              readOnly
                              textLabel={strings('placeholder.email')}
                              type='text'
                              defaultValue={onboardingProfile?.email || ''}
                            />
                          </div>
                        </div>
                        <div className='col-md-6'>
                          <div className='form-group'>
                            <TextInput
                              classNameInput='form-control-sm form-label'
                              disabled
                              error={errorOnboardingProfilesData}
                              id='phoneNumber'
                              name='phoneNumber'
                              noValidate
                              otherId=''
                              readOnly
                              textLabel={strings('placeholder.phone') + ' ' + strings('placeholder.optional')}
                              type='text'
                              defaultValue={onboardingProfile?.user?.phoneNumber || ''}
                            />
                          </div>
                        </div>
                        <div className='col-md-6'>
                          <div className='form-group'>
                            <TextInput
                              classNameInput='form-control-sm form-label'
                              disabled
                              error={errorOnboardingProfilesData}
                              id='status'
                              name='status'
                              noValidate={false}
                              otherId=''
                              readOnly
                              textLabel={strings('placeholder.status')}
                              type='text'
                              defaultValue={onboardingProfile?.status || ''}
                            />
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/** invoice information */}
                  {onboardingProfile?.invoice
                    ? (
                      <>
                        <div className='row align-items-start mb-8 mb-xl-12 mb-xxl-16'>
                          <div className='col-lg-4 mb-5 mb-lg-0'>
                            <h4 className='font-semibold mb-lg-1 mt-5 mt-lg-0'>{strings('form.placeholder.invoiceData')}</h4>
                          </div>
                          <div className='col-lg-8 d-flex flex-column gap-3'>
                            <div className='form-group'>
                              <TextInput
                                classNameInput='form-control-sm form-label'
                                disabled
                                error={errorOnboardingProfilesData}
                                id='file'
                                name='file'
                                noValidate={false}
                                otherId=''
                                readOnly
                                textLabel={strings('form.placeholder.filePath')}
                                type='text'
                                defaultValue={onboardingProfile?.invoice?.file || ''}
                              />
                            </div>

                            <div className='card bg-surface-tertiary border shadow-none'>
                              <div className='card-body'>
                                <h4 className='mb-4'>{strings('form.placeholder.file')}</h4>
                                <div className='row g-3'>
                                  <InvoiceFilesList
                                    key={onboardingProfile?.invoice?.filename}
                                    index={0}
                                    fileName={onboardingProfile?.invoice?.filename}
                                    size={0}
                                    format={onboardingProfile?.invoice?.format}
                                    path={onboardingProfile?.invoice?.file}
                                    onlyView
                                    isAdmin
                                  />
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                      </>)
                    : <></>}

                  {/** Buttons */}
                  <div className='mt-8 mb-4 mb-lg-0 d-flex justify-content-between gap-3'>
                    <div className='justify-content-start'>
                      <Button
                        isLoading={isLoadingOnboardingProfile}
                        type='button'
                        className='btn d-inline-flex btn-neutral m-1'
                        onClick={(e) => handleClickGoBack}
                        classNameIconLeft='pe-2'
                        iconLeft='bi bi-arrow-left'
                        classNameLoading='btn-loader-primary'
                        label={strings('button.goBack')}
                      />
                    </div>

                    {!accepted &&
                      <div className='justify-content-end'>
                        <Button
                          isLoading={isLoadingOnboardingProfile}
                          type='button'
                          className='btn d-inline-flex btn-neutral text-danger border-danger m-1'
                          classNameIconLeft='pe-2'
                          iconLeft='bi bi-x-circle'
                          classNameLoading='btn-loader-danger'
                          label={strings('button.deny')}
                          dataBsTarget={`#modalDeleteItem-${onboardingProfile?.id}`}
                          dataBsToggle='modal'
                        />

                        <Button
                          isLoading={isLoadingOnboardingProfile}
                          type='button'
                          className='btn btn-primary m-1'
                          onClick={(e) => handleClickApprove}
                          classNameIconLeft='pe-2'
                          iconLeft='bi bi-check-circle'
                          classNameLoading='btn-loader-primary'
                          label={strings('button.approve')}
                        />
                      </div>}

                    {/** Modal button (activate on the action) */}
                    <button
                      type='button'
                      id='modal-open-approveOk'
                      className='d-none'
                      data-bs-target='#modalNewElementOK'
                      data-bs-toggle='modal'
                      onClick={async (e) => {}}
                    />
                  </div>

                </form>
              </div>
            </div>

          </div>
        </div>
      </main>

      <AddSuccessModal
        redirect
        route={Routing.adminOnboardingProfiles}
        callback={null}
        icon='bi bi-check-circle-fill'
        successText='approveOnboard'
      />
      <DeleteModal
        id={onboardingProfile?.id}
        apiDelete={apiDeleteOnboarding}
        route={Routing.adminOnboardingProfiles}
        callback={null}
        question={strings('placeholder.deleteElementQuestion', { element: strings('placeholder.onboardingProfile').toLowerCase() })}
        warning={strings('placeholder.deleteElementWarning', { element: strings('placeholder.onboardingProfile').toLowerCase() })}
        success={strings('placeholder.deleteElementSuccess', { element: strings('placeholder.onboardingProfile') })}
      />

    </>
  )
}
