import { useSelector } from 'src/redux/hooks'
import { strings } from 'src/resources/locales/i18n'
import TextInput from 'ui/input/TextInput'

export const ProfileContainer = () => {
  const { userData } = useSelector(state => state.AdminUserReducer)
  const financialCompany = userData?.financialCompany

  return (
    <div className='container-xl'>
      <div className='mt-n56 position-relative z-index-100'>

        <div className='card mb-6'>
          <div className='card-body p-6 p-lg-8 p-xl-12 p-xxl-16'>

            <form>
              {financialCompany &&
                <div className='row align-items-start mb-8 mb-lg-12 mb-xxl-16'>
                  <div className='col-lg-4 col-xxl-3 mb-5 mb-lg-0'>
                    <h4 className='mb-2'>{strings('form.placeholder.companyData')}</h4>
                  </div>
                  <div className='col-lg-8 offset-xxl-1 d-flex flex-column gap-5'>
                    <div className='row g-5'>
                      <div className='col-md-8'>
                        <TextInput
                          classNameInput='form-control form-control-sm_'
                          disabled
                          id='companyName'
                          name='companyName'
                          noValidate={false}
                          otherId=''
                          readOnly
                          textLabel={strings('form.placeholder.companyName')}
                          type='text'
                          value={financialCompany?.name}
                        />
                      </div>
                      <div className='col-md-4 mb-3 mb-lg-0'>
                        <div className='form-group'>
                          <TextInput
                            classNameInput='form-control form-control-sm_'
                            disabled
                            id='companyCIF'
                            name='companyCIF'
                            noValidate={false}
                            otherId=''
                            readOnly
                            textLabel={strings('form.placeholder.companyCIF')}
                            type='text'
                            value={financialCompany?.cif}
                          />
                        </div>
                      </div>
                    </div>
                    <div className='row'>
                      <div className='col-md-6'>
                        <div className='form-group'>
                          <TextInput
                            classNameInput='form-control form-control-sm_'
                            disabled
                            id='contactEmail'
                            name='contactEmail'
                            noValidate={false}
                            otherId=''
                            readOnly
                            textLabel={strings('placeholder.email')}
                            type='text'
                            value={financialCompany?.contactEmail}
                          />
                        </div>
                      </div>
                      <div className='col-md-6'>
                        <div className='form-group'>
                          <TextInput
                            classNameInput='form-control form-control-sm_'
                            disabled
                            id='phoneNumber'
                            name='phoneNumber'
                            noValidate
                            otherId=''
                            readOnly
                            textLabel={strings('placeholder.phone') + ' ' + strings('placeholder.optional')}
                            type='text'
                            value={financialCompany?.phone}
                          />
                        </div>
                      </div>
                    </div>
                    <div className='form-group'>
                      <TextInput
                        classNameInput='form-control form-control-sm_'
                        disabled
                        id='companyAddress'
                        name='companyAddress'
                        noValidate={false}
                        otherId=''
                        readOnly
                        textLabel={strings('placeholder.address')}
                        type='text'
                        value={financialCompany?.address}
                      />
                    </div>
                    <div className='row'>
                      <div className='col-md-3 mb-3 mb-lg-0'>
                        <div className='form-group'>
                          <TextInput
                            classNameInput='form-control form-control-sm_'
                            disabled
                            id='companyAddress'
                            name='companyAddress'
                            noValidate={false}
                            otherId=''
                            readOnly
                            textLabel={strings('placeholder.postalCode')}
                            type='text'
                            value={financialCompany?.postalCode}
                          />
                        </div>
                      </div>
                      <div className='col-md-5 mb-3 mb-lg-0'>
                        <div className='form-group'>
                          <TextInput
                            classNameInput='form-control form-control-sm_'
                            disabled
                            id='companyCity'
                            name='companyCity'
                            noValidate={false}
                            otherId=''
                            readOnly
                            textLabel={strings('placeholder.city')}
                            type='text'
                            value={financialCompany?.city}
                          />
                        </div>
                      </div>
                      <div className='col-md-4'>
                        <div className='form-group'>
                          <TextInput
                            classNameInput='form-control form-control-sm_'
                            disabled
                            id='companyRegion'
                            name='companyRegion'
                            noValidate={false}
                            otherId=''
                            readOnly
                            textLabel={strings('placeholder.region')}
                            type='text'
                            value={financialCompany?.region}
                          />
                        </div>
                      </div>
                    </div>

                  </div>
                </div>}

              <div className='row align-items-start mb-0'>
                <div className='col-lg-4 col-xxl-3 mb-5 mb-lg-0'>
                  <h4 className='mb-2'>{strings('form.placeholder.userData')}</h4>
                </div>
                <div className='col-lg-8 offset-xxl-1 d-flex flex-column gap-5'>
                  <div className='row g-5'>
                    <div className='col-md-6'>
                      <div className='form-group'>
                        <TextInput
                          classNameInput='form-control form-control-sm_'
                          disabled
                          id='firstName'
                          name='firstName'
                          noValidate={false}
                          otherId=''
                          readOnly
                          textLabel={strings('placeholder.firstName')}
                          type='text'
                          value={userData?.firstName}
                        />
                      </div>
                    </div>
                    <div className='col-md-6'>
                      <div className='form-group'>
                        <TextInput
                          classNameInput='form-control form-control-sm_'
                          disabled
                          id='lastName'
                          name='lastName'
                          noValidate={false}
                          otherId=''
                          readOnly
                          textLabel={strings('form.placeholder.lastName')}
                          type='text'
                          value={userData?.lastName}
                        />
                      </div>
                    </div>
                  </div>
                  <div className='row g-5'>
                    <div className='col-md-6'>
                      <div className='form-group'>
                        <TextInput
                          classNameInput='form-control form-control-sm_'
                          disabled
                          id='email'
                          name='email'
                          noValidate={false}
                          otherId=''
                          readOnly
                          textLabel={strings('placeholder.email')}
                          type='text'
                          value={userData?.email}
                        />
                      </div>
                    </div>
                  </div>
                </div>
              </div>

            </form>

          </div>
        </div>

        <div className='card mb-0'>
          <div className='card-body p-6 p-lg-8 px-xl-12 px-xxl-16 d-lg-flex align-items-center'>
            <div>
              <div className='h4 text-danger mb-2'>{strings('form.placeholder.deleteSupplierTitle')}</div>
              {/* <p className='text-sm text-muted mb-3 mb-lg-0'>
                {strings('form.placeholder.deleteSupplierDescription')}
              </p> */}
            </div>
            <div className='ms-auto'>
              <a
                role='button'
                className='btn btn-sm btn-outline-danger disabled'
                // data-bs-toggle='modal'
                // data-bs-target='#modalDeleteItem'
              >{strings('button.delete')}
              </a>
            </div>
          </div>
        </div>

      </div>
    </div>
  )
}
