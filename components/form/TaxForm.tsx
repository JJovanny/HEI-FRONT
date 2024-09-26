import { useRouter } from 'next/navigation'
/** actions */
import {
  setTaxDataProps,
  setValueTaxData,
  validateTaxData,
  apiGetTaxes,
  apiPostCompanyTax,
  apiPutCompanyTax,
  apiDeleteCompanyTax
} from 'src/tax/TaxActions'
/** components */
import TextInput from 'ui/input/TextInput'
/** modals */
import { AddSuccessModal } from 'components/modal/AddSuccessModal'
import { UpdateModal } from 'components/modal/UpdateModal'
import { DeleteModal } from 'components/modal/DeleteModal'
/** resources */
import { strings } from 'src/resources/locales/i18n'
import Routing from 'src/routing'
import Loading from 'ui/Loading'
import { useDispatch, useSelector } from 'src/redux/hooks'
import { Button } from 'ui/Button'
import { isFocusHere } from 'src/api/utils'

export const TaxForm = ({ isEdit }) => {
  const dispatch = useDispatch()
  const router = useRouter()

  const { tax, isLoadingPostDataTax, isLoadingPutDataTax, submit, errorTaxData } = useSelector(({ UserReducer, TaxReducer }) => {
    const { accessToken } = UserReducer
    const { tax, isLoadingPostDataTax, isLoadingPutDataTax, submit, errorTaxData } = TaxReducer

    return { accessToken, tax, isLoadingPostDataTax, isLoadingPutDataTax, submit, errorTaxData }
  })

  const { id, name, percentage, isUsed } = tax

  if (isUsed === true) {
    router.push(Routing.taxes)
    return <Loading />
  }

  function getFirstInputErrorId (errorFields) {
    if (errorFields.find(error => isFocusHere(error, 'name'))) return document.getElementById('name')
    if (errorFields.find(error => isFocusHere(error, 'percentage'))) return document.getElementById('percentage')
    return null
  }

  const onSubmitPost = async (e) => {
    e.preventDefault()
    !submit && dispatch(setTaxDataProps({ prop: 'submit', value: true }))
    let errorFields = await dispatch(validateTaxData())
    if (errorFields.length === 0) await dispatch(apiPostCompanyTax())
    if (errorFields.length === 0 && errorTaxData.length > 0) errorFields = errorTaxData
    if (errorFields.length > 0) await getFirstInputErrorId(errorFields)?.focus()
  }

  const onSubmitPut = async (e) => {
    e.preventDefault()
    !submit && dispatch(setTaxDataProps({ prop: 'submit', value: true }))
    let errorFields = await dispatch(validateTaxData())
    if (errorFields.length === 0 && errorTaxData.length > 0) errorFields = errorTaxData
    if (errorFields.length === 0) await dispatch(apiPutCompanyTax(id))
    if (errorFields.length > 0) await getFirstInputErrorId(errorFields)?.focus()
  }

  return (
    <>
      <div className='container-xl pt-8'>
        <div className='mt-n56 position-relative z-index-100'>
          <div className='bg-card rounded shadow mb-6'>
            <div className='p-5 p-lg-8 p-xl-12 p-xxl-16'>

              {/** Form Invoice */}
              <form>

                <div className='row align-items-start mb-8 mb-lg-12 mb-xxl-16'>
                  <div className='col-lg-4 mb-5 mb-lg-0'>
                    <h4 className='font-semibold mb-lg-1'>{strings('form.placeholder.taxData')}</h4>
                  </div>
                  <div className='col-lg-8 d-flex flex-column gap-3'>
                    <div className='row g-3'>
                      <div className='col-md-8'>
                        <div className='form-group'>
                          <TextInput
                            classNameInput='form-control-sm form-label'
                            disabled={isLoadingPostDataTax || isLoadingPutDataTax}
                            error={errorTaxData}
                            id='name'
                            name='name'
                            noValidate={false}
                            otherId=''
                            readOnly={false}
                            submit={submit}
                            textLabel={strings('placeholder.name')}
                            type='text'
                            defaultValue={name}
                            onChange={async (e) => {
                              await dispatch(setValueTaxData({ prop: e.target.name, value: e.target.value }))
                              submit && dispatch(validateTaxData())
                            }}
                          />
                        </div>
                      </div>
                      <div className='col-md-4'>
                        <div className='form-group'>
                          <TextInput
                            classNameInput='form-control-sm form-label'
                            disabled={isLoadingPostDataTax || isLoadingPutDataTax}
                            error={errorTaxData}
                            id='percentage'
                            name='percentage'
                            placeholder='1'
                            noValidate={false}
                            otherId=''
                            readOnly={false}
                            submit={submit}
                            textLabel={strings('placeholder.percentageWithSymbol')}
                            type='number'
                            defaultValue={percentage}
                            onChange={async (e) => {
                              await dispatch(setValueTaxData({ prop: e.target.name, value: e.target.value }))
                              submit && dispatch(validateTaxData())
                            }}
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/** Btns */}
                <div className='mt-8 mb-4 mb-lg-0 d-flex justify-content-center gap-3'>

                  <Button
                    type='button'
                    className='btn btn-primary'
                    isLoading={isEdit ? isLoadingPutDataTax : isLoadingPostDataTax}
                    onClick={isEdit ? () => onSubmitPut : () => onSubmitPost}
                    classNameIconLeft={isEdit ? 'pe-1' : 'pe-2'}
                    iconLeft='bi bi-upload'
                    label={isEdit
                      ? strings('button.update')
                      : strings('button.addNewTax')}
                  />

                  {/** Modal add button (activate on the action) */}
                  <button
                    type='button'
                    id='modal-open-newTaxOK'
                    className='d-none'
                    data-bs-target='#modalNewElementOK'
                    data-bs-toggle='modal'
                  />

                  {/** Modal update button (activate on the action) */}
                  <button
                    type='button'
                    id='modal-open-updateOK'
                    className='d-none'
                    data-bs-target='#modalUpdateOK'
                    data-bs-toggle='modal'
                  />

                </div>
              </form>

            </div>
          </div>

          {/* Delete invoice  */}
          {
            isEdit
              ? (// eslint-disable react/jsx-closing-tag-location
                <div className='bg-card rounded shadow mb-0 text-center text-lg-start'>
                  <div className='card-body p-6 p-lg-8 px-xl-12 px-xxl-16 d-lg-flex align-items-center'>
                    <div className='pe-lg-20'>
                      <div className='h4 text-danger mb-2'>{strings('form.placeholder.deleteTaxTitle')}</div>
                      <p className='text-sm text-muted mb-3 mb-lg-0'>
                        {strings('form.placeholder.deleteTaxDescription')}
                      </p>
                    </div>
                    <div className='ms-auto'>
                      <a
                        role='button'
                        className='btn btn-sm btn-outline-danger'
                        data-bs-toggle='modal'
                        data-bs-target={`#modalDeleteItem-${id}`}
                      >
                        {strings('button.delete')}
                      </a>
                    </div>
                  </div>
                </div>)
              : <></>
          }
        </div>
      </div>
      {/** Modals */}
      <AddSuccessModal
        redirect
        route={Routing.taxes}
        callback={apiGetTaxes}
        icon='bi bi-cash-coin'
        successText='createTaxSuccess'
      />
      <UpdateModal
        success='updateTaxSuccess'
        callback={apiGetTaxes}
        route={Routing.taxes}
      />
      <DeleteModal
        id={isEdit ? id : ''}
        apiDelete={() => apiDeleteCompanyTax(id)}
        route={Routing.taxes}
        callback={apiGetTaxes}
        question={strings('placeholder.deleteElementQuestion', { element: strings('placeholder.tax').toLowerCase() })}
        warning={strings('placeholder.deleteElementWarning', { element: strings('placeholder.tax').toLowerCase() })}
        success={strings('placeholder.deleteElementSuccess', { element: strings('placeholder.tax') })}
      />
    </>
  )
}
