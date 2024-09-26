/** actions */
import {
  setInvoiceDataProps,
  setValuePostInvoiceData,
  setValueCurrencyData,
  apiPostInvoice,
  apiPutInvoice,
  apiGetInvoicesIssued,
  apiGetCurrencyByCode,
  apiDeleteInvoice,
  validatePostInvoice,
  apiGetCurrencies,
  clearInvoiceDataErrorsForAdd,
  clearEmailsDataErrors,
  clearInvoiceLoadings,
  postNewInvoiceClient
} from 'src/invoice/InvoiceActions'
import { apiGetSupplierClients, clearClientData } from 'src/client/ClientActions'
import UserManager from 'src/user/UserManager'
import InvoiceManager from 'src/invoice/InvoiceManager'
/** components */
import TextInput from 'ui/input/TextInput'
import SelectInput from 'ui/input/SelectInput'
import FileInput from 'ui/input/FileInput'
import { InvoiceLinesList } from '../invoice/InvoiceLinesList'
import { InvoiceFilesList } from '../invoice/InvoiceFilesList'
import { Button } from 'ui/Button'
/** modals */
import { AddClientModal } from 'components/modal/AddClientModal'
import { SendInvoiceModal } from 'components/modal/SendInvoiceModal'
import { AddInvoiceModalDraft } from 'components/modal/AddInvoiceModalDraft'
import { DeleteModal } from 'components/modal/DeleteModal'
/** resources */
import { strings } from 'src/resources/locales/i18n'
import Routing from 'src/routing'
import { useDispatch, useSelector } from 'src/redux/hooks'
import { useRouter } from 'next/navigation'
import { IClient } from 'src/types/client'
import { isFocusHere, sortCurrencies } from 'src/api/utils'
import { useEffect, useState } from 'react'
import { apiGetTaxes, clearTaxData, clearTaxDataErrors } from 'src/tax/TaxActions'
import { IInvoiceState } from 'src/types/invoice'
import { toast } from 'react-hot-toast'
import { Tooltip } from '@mui/material'
import moment from 'moment'
import { IUserState } from 'src/types/user'


interface CustomFile extends File {
  filename: string;
  remove: boolean;
  stream: any;
  size: number;
  format: string;
  file: string;
}

export const InvoiceForm = ({ isEdit }) => {
  const dispatch = useDispatch()
  const router = useRouter()

  const { dataUser, invoice, client, isLoadingPostDataInvoice, isLoadingPutDataInvoice, submitPost, errorInvoiceData, currencies, currency, clients } = useSelector(({ UserReducer, InvoiceReducer, ClientReducer }) => {
    const { accessToken, dataUser } = UserReducer as IUserState
    const { invoice, isLoadingPostDataInvoice, isLoadingPutDataInvoice, submitPost, errorInvoiceData, currencies, currency } = InvoiceReducer as IInvoiceState
    const { clients, client } = ClientReducer

    return { accessToken, dataUser, invoice, client, isLoadingPostDataInvoice, isLoadingPutDataInvoice, submitPost, errorInvoiceData, currencies, currency, clients }
  }) 

  const { id, invoiceNumber, issueDate, observations, dueDate, lines, files, uploaded, grandTotal } = invoice
  const { customer }: { customer: IClient } = invoice
  const { companyBranchSelected } = dataUser
  const countrySupplier: string = companyBranchSelected && companyBranchSelected['country'] && typeof companyBranchSelected['country'] === 'object' ? companyBranchSelected['country']['code'] : ''
  const countryCurrencySupplier: string = companyBranchSelected && companyBranchSelected['country'] && typeof companyBranchSelected['country'] === 'object' && companyBranchSelected['country']['currencies'] && Array.isArray(companyBranchSelected['country']['currencies']) ? companyBranchSelected['country']['currencies'][0] : ''
  const currencyCode: string = companyBranchSelected && companyBranchSelected['currencyCode'] ? companyBranchSelected['currencyCode'] : ''

  const [selectCustomer, setSelectCustomer] = useState(customer)
  const [useNewCustomer, setUseNewCustomer] = useState(false)
  const [isCountryMx, setIsCountryMx] = useState(countrySupplier === 'MX')
  const [disabledButtonIfCountryMx, setDisabledButtonIfCountryMx] = useState(false)
  const [messageError, setMessageError] = useState(false)

  useEffect(() => {
    if (files && Array.isArray(files) && files.length !== 0) {
      const hasXMLFile = files.some(file => file.format === 'xml' && !file.remove);
      const hasPDFFile = files.some(file => file.format === 'pdf' && !file.remove);
      setDisabledButtonIfCountryMx(isCountryMx ? !(hasXMLFile && hasPDFFile) : false)
    } else {
      setDisabledButtonIfCountryMx(isCountryMx)
    }
    }, [invoice, isCountryMx])


  useEffect(() => {
    dispatch(clearInvoiceLoadings())
    dispatch(clearInvoiceDataErrorsForAdd())
    dispatch(clearEmailsDataErrors())
    dispatch(apiGetSupplierClients())
    dispatch(apiGetCurrencies())
    dispatch(apiGetTaxes())

    if (countrySupplier === 'MX') {
      setIsCountryMx(true)
    }

    return () => { }
  }, [companyBranchSelected])

  useEffect(() => {
    if (customer?.isNewCustomer) setSelectCustomer({ isNewCustomer: true, id: '-1' })
    return () => { }
  }, [customer])

  useEffect(() => {
    selectCustomer?.id === '-1' ? setUseNewCustomer(true) : setUseNewCustomer(false)
    return () => { }
  }, [selectCustomer])

  /** Supplier company information */
  const companyName = UserManager.getCompanyName(dataUser)
  const address = UserManager.getCompanyAddress(dataUser)
  const city = UserManager.getCompanyCity(dataUser)
  const postalCode = UserManager.getCompanyPostalCode(dataUser)
  const country = UserManager.getCompanyCountry(dataUser)

  /** clients to select */
  const selectDataClient: { key: string, id: string, value: string }[] = []
  clients?.map((client) =>
    selectDataClient.push({ key: client?.id, id: client?.id, value: client?.cif ? client?.name + ' ' + `(${client?.cif})` : client?.name })
  ) 
  if (customer?.customerData?.company?.name) selectDataClient.push({ key: '-1', id: '-1', value: customer?.customerData?.company?.name || '' })

  /** currencies to select */
  const selectDataCurrencies: { key: string, id: string, value: string }[] = []
  currencies?.map((currency) =>
    selectDataCurrencies.push({ key: currency.code, id: currency.code, value: currency.label })
  )
  const code = InvoiceManager.getCurrencyCode(currency)
  const symbol = InvoiceManager.getCurrencySymbol(currency)
  const sameCompanyError = errorInvoiceData.find((error) => error.key === 'sameCompany')

  function isNewOrDraft () {
    if (!isEdit) return <p className='badge rounded-pill bg-primary text-white text-sm font-semibold'>{strings('placeholder.new')}</p>
    return <p className='badge rounded-pill bg-gray-400 text-white text-sm font-semibold'>{strings('placeholder.draft')}</p>
  }

  useEffect(() => {
    if (lines.length !== 0 ) setMessageError(false)
  },[invoice])

  function handleValueChangeInput (prop, eventFiles, isFile) {
    if (isFile) {
      if (eventFiles && eventFiles.length > 0) {
        const reader = new FileReader()
        const fileNameAndType = eventFiles[0].name?.split('.') // position 0 name, position 1 type
        const fileName = fileNameAndType[0].trim()
        const fileType = fileNameAndType[1].trim().toLowerCase()

        reader.readAsDataURL(eventFiles[0])
        reader.onload = (e) => {
          files.push({
            filename: fileName, remove: false, stream: e?.target?.result + '', size: eventFiles[0].size, format: fileType, file: ''
          })
          dispatch(setValuePostInvoiceData({ prop, value: files }))
        }
      }
    } else {
      dispatch(setValuePostInvoiceData({ prop, value: eventFiles }))
    }
  }

  
  const handleDrop = async (e: React.DragEvent<HTMLLabelElement>) => {
    e.preventDefault();
    const filesHanlde = Array.from(e.dataTransfer.files);
    const customFiles: CustomFile[] = [];

    if (filesHanlde && filesHanlde.length > 0) {
      const reader = new FileReader();
      const fileNameAndType = filesHanlde[0].name.split('.');
      const fileName = fileNameAndType[0].trim();
      const fileType = fileNameAndType[1].trim().toLowerCase();

      reader.readAsDataURL(filesHanlde[0]);
      reader.onload = (e) => {
        const result = e?.target?.result;

        const customFile: CustomFile = {
          ...(filesHanlde[0] as CustomFile), 
          filename: fileName,
          remove: false,
          stream: result,
          format: fileType,
          file: '', 
        } as CustomFile

        customFiles.push(customFile);
        const updatedFiles = [...files, ...customFiles]
        dispatch(setValuePostInvoiceData({ prop: 'files', value: updatedFiles }));
      };
    }
  };


  const handleDragOver = (e: React.DragEvent<HTMLLabelElement>) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'copy'; 
  };

  function showError (id, error) {
    let hasError = false
    let hasErrorRequest = false
    let elementError

    if (error && error.length > 0) {
      // eslint-disable-next-line array-callback-return
      error?.map((item) => {
        if (item.key === id) {
          hasError = true

          return (elementError = item)
        }
        if (item.key === 'request') {
          hasErrorRequest = true
        }
      })
    }

    if ((hasError || hasErrorRequest) && elementError) {
      return <div className='error-msg text-danger ml-1 mt-1'>{elementError.value}</div>
    }

    return <></>
  }

  useEffect(() => {

    if (code === '' && currencyCode === '' && countryCurrencySupplier !== '') {
      dispatch(setValueCurrencyData({ prop: 'code', value: countryCurrencySupplier }))
      dispatch(apiGetCurrencyByCode())
    }

    if (code === '' && currencyCode !== '') {
      dispatch(setValueCurrencyData({ prop: 'code', value: currencyCode }))
      dispatch(apiGetCurrencyByCode())
    }

  },[dataUser, companyBranchSelected, currencyCode, countryCurrencySupplier])

  function getFirstInputErrorId (errorFields) {
    if (errorFields.find(error => isFocusHere(error, 'invoiceNumber'))) return document.getElementById('invoiceNumber')
    if (errorFields.find(error => isFocusHere(error, 'issueDate'))) return document.getElementById('issueDate')
    if (!customer?.isNewCustomer && errorFields.find(error => isFocusHere(error, 'id'))) return document.getElementById('id')
    if (errorFields.find(error => isFocusHere(error, 'code'))) return document.getElementById('code')
    /** lines */
    if (errorFields.find(error => isFocusHere(error, 'concept'))) return document.getElementById(getElementName('concept', errorFields))
    if (errorFields.find(error => isFocusHere(error, 'items'))) return document.getElementById(getElementName('items', errorFields))
    if (errorFields.find(error => isFocusHere(error, 'amount'))) return document.getElementById(getElementName('amount', errorFields))
    if (errorFields.find(error => isFocusHere(error, 'files'))) return document.getElementById('files')
    return null
  }

  function getElementName (id, errorFields) {
    let key = ''
    // eslint-disable-next-line array-callback-return
    errorFields.map((error) => {
      if (key === '' && error?.key?.includes(id)) {
        key = error.key
      }
    })
    return key
  }

  const setInvoiceCustomer = async () => {
    useNewCustomer ? await dispatch(postNewInvoiceClient(client)) : await dispatch(setValuePostInvoiceData({ prop: 'customer', value: selectCustomer }))
  }

  const setCustomerError = async (client, selectCustomer, errorInvoiceData) => {
    if ((!client?.email && !selectCustomer) || (!client?.email && Object.keys(selectCustomer).length === 0)) {
      errorInvoiceData.push({ key: 'id', value: strings('error.completeThisField') })
      await dispatch(setInvoiceDataProps({ prop: 'errorInvoiceData', value: errorInvoiceData }))
      toast.error(strings('form.error.missingCustomer'))
    }
  }

  const onSubmitPostUploaded = async (e) => {
    e.preventDefault()
    if (lines.length === 0) {
      setMessageError(true)
      return
    }

    !submitPost && dispatch(setInvoiceDataProps({ prop: 'submitPost', value: true }))
    dispatch(setValuePostInvoiceData({ prop: 'uploaded', value: true }))
    let errorFields = await dispatch(validatePostInvoice())
    if (errorFields.length === 0 && errorInvoiceData.length > 0) errorFields = errorInvoiceData
    if (errorFields.length === 0) {
      await setCustomerError(client, selectCustomer, errorInvoiceData)
      await setInvoiceCustomer()
      errorInvoiceData.length === 0 && await dispatch(apiPostInvoice(false))
    }
    if (errorFields.length > 0) getFirstInputErrorId(errorFields)?.focus()
  }

  const onSubmitPutUploaded = async (e) => {
    e.preventDefault()
    if (lines.length === 0) {
      setMessageError(true)
      return
    } 
    !submitPost && dispatch(setInvoiceDataProps({ prop: 'submitPost', value: true }))
    dispatch(setValuePostInvoiceData({ prop: 'uploaded', value: true }))
    let errorFields = await dispatch(validatePostInvoice())
    if (errorFields.length === 0 && errorInvoiceData.length > 0) errorFields = errorInvoiceData
    if (errorFields.length === 0) {
      await setCustomerError(client, selectCustomer, errorInvoiceData)
      setInvoiceCustomer()
      errorInvoiceData.length === 0 && await dispatch(apiPutInvoice(id, false))
    }
    if (errorFields.length > 0) getFirstInputErrorId(errorFields)?.focus()
  }

  const onSubmitPostDraft = async () => {
    !submitPost && dispatch(setInvoiceDataProps({ prop: 'submitPost', value: true }))
    dispatch(setValuePostInvoiceData({ prop: 'uploaded', value: false }))
    setInvoiceCustomer()
    await dispatch(apiPostInvoice(true))
  }

  const onSubmitPutDraft = async () => {
    !submitPost && dispatch(setInvoiceDataProps({ prop: 'submitPost', value: true }))
    dispatch(setValuePostInvoiceData({ prop: 'uploaded', value: false }))
    setInvoiceCustomer()
    await dispatch(apiPutInvoice(id, true))
  }

  function redirectToCreateTax () {
    dispatch(clearTaxData())
    dispatch(clearTaxDataErrors())
    router.push(Routing.addTax)
  }

  return (
    <>
      <div className='container-xl pt-6'>
        <div className='mt-n56 position-relative z-index-100'>
          <div className='bg-card rounded shadow mb-6'>
            <div className='p-5 p-lg-8 p-xl-12 p-xxl-16'>

              {/** Form Invoice */}
              <form>
                <div className='mb-0'>
                  {/** Client Info */}
                  <div className='row align-items-start pb-3'>
                    <div className='col-md-4 col-xl-4 mb-5 mb-lg-0'>
                      <h3 className='h1 mb-3 mb-md-5 d-flex align-items-center'>
                        {strings('placeholder.invoice')}
                      </h3>
                      <p className='text-sm text-dark mb-3 d-none d-md-block'>
                        {/** Supplier company Info */}
                        <strong>{companyName}</strong><br />
                        {address}<br />
                        {postalCode}, {city} ({country})
                      </p>
                      {isNewOrDraft()}
                    </div>
                    <div className='col-md-8 col-xl-7 offset-xl-1 d-flex flex-column gap-3 gap-md-5'>
                      <div className='row g-3 g-lg-5'>
                        <div className='col-md-6'>
                          <div className='form-group'>
                            <TextInput
                              classNameInput='form-control-sm form-label'
                              disabled={isLoadingPostDataInvoice || isLoadingPutDataInvoice}
                              error={errorInvoiceData}
                              id='invoiceNumber'
                              name='invoiceNumber'
                              noValidate={false}
                              otherId=''
                              readOnly={false}
                              submit={submitPost}
                              textLabel={strings('form.placeholder.invoiceNumber')}
                              type='text'
                              value={invoiceNumber}
                              onChange={async (e) => {
                                dispatch(setValuePostInvoiceData({ prop: e.target.name, value: e.target.value }))
                                submitPost && uploaded && dispatch(validatePostInvoice())
                              }}
                            />
                          </div>
                        </div>
                        <div className='col-md-6' />
                        <div className='col-md-6'>
                          <div className='form-group'>
                            {/** Issue date */}
                            <label className='form-label' htmlFor='issueDate'>{strings('form.placeholder.issueDate')}</label>
                            <input
                              id='issueDate'
                              disabled={isLoadingPostDataInvoice || isLoadingPutDataInvoice}
                              className='form-control form-control-sm cursor-pointer'
                              type='date'
                              name='issueDate'
                              value={issueDate}
                              onChange={async (e) => {
                                dispatch(setValuePostInvoiceData({ prop: e.target.name, value: e.target.value }))
                                submitPost && uploaded && dispatch(validatePostInvoice())
                              }}
                            />
                            {showError('issueDate', errorInvoiceData)}
                          </div>
                        </div>
                        <div className='col-md-6'>
                          <div className='form-group'>
                            {/** Due date */}
                            <label className='form-label' htmlFor='dueDate'>{strings('form.placeholder.dueDate')}</label>
                            <input
                              id='dueDate'
                              disabled={isLoadingPostDataInvoice || isLoadingPutDataInvoice}
                              className='form-control form-control-sm cursor-pointer'
                              type='date'
                              name='dueDate'
                              value={isEdit ? moment.utc(dueDate).format('YYYY-MM-DD') : dueDate}
                              onChange={async (e) => {
                                dispatch(setValuePostInvoiceData({ prop: e.target.name, value: e.target.value }))
                                submitPost && uploaded && dispatch(validatePostInvoice())
                              }}
                            />
                            {showError('dueDate', errorInvoiceData)}
                          </div>
                        </div>
                      </div>
                      <div className='row g-3 g-lg-5'>
                        <div className='col-md-6'>
                          <div className='form-group'>
                            <SelectInput
                              classNameSelect='form-select form-select-sm shadow-none form-label cursor-pointer'
                              dataChildren={selectDataClient}
                              disabled={isLoadingPostDataInvoice || isLoadingPutDataInvoice}
                              error={errorInvoiceData}
                              getItemId // true
                              hasMultiple={false}
                              id='id'
                              noValidate={false}
                              showSelect
                              strDefaultSelect={strings('placeholder.chooseWithId', { id: strings('placeholder.client').toLowerCase() })}
                              submit={submitPost}
                              textLabel={strings('placeholder.client')}
                              value={selectCustomer?.id}
                              onChange={async (e) => {
                                e.target.value === '-1'
                                  ? setSelectCustomer({ isNewCustomer: true, id: e.target.value })
                                  : setSelectCustomer({ isNewCustomer: false, id: e.target.value })
                                submitPost && uploaded && dispatch(validatePostInvoice())
                              }}
                            />
                            <p className='text-end_ text-sm mt-2'>
                              <a
                                role='button'
                                className='font-semibold'
                                data-bs-toggle='modal'
                                data-bs-target='#modalNewClient'
                                onClick={() => dispatch(clearClientData())}
                              >
                                <i className='bi bi-plus-circle-dotted me-1' />
                                {strings('placeholder.newClient')}
                              </a>
                            </p>
                          </div>
                        </div>
                        <div className='col-md-6'>
                          <div className='form-group'>
                            <SelectInput
                              classNameSelect='form-select form-select-sm shadow-none form-label cursor-pointer'
                              dataChildren={selectDataCurrencies}
                              disabled={isLoadingPostDataInvoice || isLoadingPutDataInvoice}
                              error={errorInvoiceData}
                              getItemId // true
                              hasMultiple={false}
                              id='code'
                              noValidate={false}
                              showSelect
                              strDefaultSelect={strings('placeholder.chooseWithId', { id: strings('placeholder.currency').toLowerCase() })}
                              submit={submitPost}
                              textLabel={strings('placeholder.currency')}
                              value={code === '' && currencyCode !== '' ?  currencyCode : code === '' && currencyCode === '' ? countryCurrencySupplier : code}
                              onChange={async (e) => {
                                dispatch(setValueCurrencyData({ prop: e.target.id, value: e.target.value }))
                                await dispatch(apiGetCurrencyByCode())
                                submitPost && uploaded && dispatch(validatePostInvoice())
                              }}
                            />
                          </div>
                        </div>
                      </div>
                      <div className='row g-3 g-lg-5'>
                      <div className='col-md-12'>
                        <div className='form-group'>
                            <TextInput
                              classNameInput='form-control-sm form-label'
                              disabled={isLoadingPostDataInvoice || isLoadingPutDataInvoice}
                              error={errorInvoiceData}
                              id='observations'
                              name='observations'
                              noValidate={false}
                              otherId=''
                              readOnly={false}
                              submit={submitPost}
                              textLabel={strings('placeholder.observations')}
                              type='text'
                              value={observations}
                              onChange={async (e) => {
                                dispatch(setValuePostInvoiceData({ prop: e.target.name, value: e.target.value }))
                                submitPost && uploaded && dispatch(validatePostInvoice())
                              }}
                            />
                          </div>
                        </div>
                      </div>

                    </div>
                  </div>
                  {/** Table invoice */}
                  <section id='form-invoice' className='pt-5 mt-5 pt-xxl-8 mt-xxl-8 border-top-2'>
                    {/** List Group */}
                    <div className='list-group list-group-flush border-bottom mb-5 mt-n6 mt-lg-0'>
                      <div className='list-group-item d-none d-md-block pt-0'>
                        <div className='row align-items-center'>
                          <div className='col-6 col-md-3 font-semibold'>{strings('placeholder.concept')}</div>
                          <div className='col-6 col-md-2 font-semibold'>{strings('placeholder.items')}</div>
                          <div className='col-4 col-md-2 font-semibold'>
                            {symbol ? strings('placeholder.price', { symbol }) : strings('placeholder.priceWithoutSymbol')}
                          </div>
                          <div className='col-4 col-md-2 font-semibold text-cemter'>
                          <div className='d-flex flex-column flex-sm-row justify-content-center'>
                            <p className='me-2'>{strings('placeholder.tax')}</p>
                            <p className='text-sm'>
                              <a
                                className='font-semibold cursor-pointer'
                                onClick={() => {redirectToCreateTax()}}
                              >
                                <Tooltip title={strings('button.newTax')}>
                                  <i className='bi bi-plus-circle-dotted me-1' />
                                </Tooltip>
                              </a>
                            </p>
                            </div>
                            </div>
                          <div className='col-4 col-md-2 font-semibold text-end'>{strings('placeholder.percentage')}</div>
                          <div className='col-2 col-md-1 text-sm-end' />
                        </div>
                      </div>

                      {/** Invoice elements/lines */}
                      <div className='list-group-item'>
                        <div className='row align-items-center'>
                          {
                            lines?.map((line, index) =>
                              <InvoiceLinesList
                                key={index}
                                index={index}
                                line={line}
                                onlyView={false}
                              />
                            )
                          }
                        </div>
                      </div>

                    </div>
                    {/** Add Row */}
                    <div className='text-start'>
                      <a
                        className='btn btn-sm btn-outline-primary w-full w-lg-auto'
                        onClick={() => {
                          lines.push({
                            concept: '', items: 1, amount: 0.00, tax: ''
                          })
                          dispatch(setValuePostInvoiceData({ prop: 'lines', value: lines }))
                        }}
                      >
                        <i className='bi bi-plus-lg me-1' /> {strings('button.addLine')}
                      </a>
                    </div>
                    {/** Total */}
                    <div className='col-lg-11 text-end mt-4 mt-lg-n10 mb-10'>
                      <p className='text-uppercase text-sm font-semibold'>{strings('placeholder.total')}</p>
                      <div className='h2'>{strings('global.price', { price: grandTotal?.toString()?.replace('.', ','), symbol })}</div>
                    </div>
                    {/** Uploader */}
                    <div className='card bg-surface-tertiary border shadow-none'>
                      <div className='card-body'>
                        <h4 className='mb-2'>{strings('placeholder.attachment')}</h4>
                        {disabledButtonIfCountryMx && (<h5 className='mb-5 text-danger'>{strings('placeholder.evidenceXmlAndPdf')}</h5>)}
                        <div className='row g-3 mb-5'>
                          {files.map((file, index) =>
                            files[index]?.remove
                              ? <div key={index} className='d-none' />
                              : <InvoiceFilesList
                                  key={index}
                                  index={index}
                                  fileName={file.filename}
                                  size={file.size}
                                  format={file.format}
                                  onlyView={false}
                                  path={null}
                                />
                          )}
                        </div>
                        <div className='form-group'>
                          <FileInput
                            classNameInput='d-none'
                            error={errorInvoiceData}
                            id='files'
                            labelText={strings('placeholder.dragOrSelectDocuments')}
                            types='PDF, DOC, DOCX, XML, PNG, JPG, JPEG'
                            accept='.pdf,.doc,.docx,.xml,.png,.jpg,.jpeg'
                            maxSize={10}
                            submit={submitPost} 
                            onDrop={(e) => handleDrop(e)}           
                            onDragOver={(e) => handleDragOver(e)}           
                            onChange={(e) => handleValueChangeInput(e.target.id, e.target.files, true)}
                          />
                        </div>
                      </div>
                    </div>
                    {sameCompanyError
                      ? <p className='text-danger mt-3'> {sameCompanyError?.value}</p>
                      : <></>}

                    {/** Btns */}
                    <div className='mt-8 mb-4 mb-lg-0 d-flex justify-content-center gap-3'>
 
                      <Button
                        isLoading={isLoadingPostDataInvoice || isLoadingPutDataInvoice}
                        type='button'
                        className='btn d-inline-flex btn-neutral mx-1'
                        onClick={() => isEdit ? onSubmitPutDraft : onSubmitPostDraft}
                        classNameIconLeft='pe-2'
                        iconLeft='bi bi-save'
                        classNameLoading='btn-loader-primary'
                        label={strings('button.save') + ' ' + strings('placeholder.draft')}
                      />
                      
                      <Button
                        isLoading={isLoadingPostDataInvoice || isLoadingPutDataInvoice}
                        type='button'
                        className='btn btn-primary'
                        disabled={disabledButtonIfCountryMx}
                        onClick={() => isEdit ? onSubmitPutUploaded : onSubmitPostUploaded}
                        classNameIconLeft={isEdit ? 'pe-1' : 'pe-2'}
                        iconLeft={isEdit ? 'bi bi-file-arrow-up' : 'bi bi-upload'}
                        label={strings('button.upload') + ' ' + strings('placeholder.invoice')}
                      /> 
                      

                      {/** Modal button (activate on the action) */}
                      <button
                        type='button'
                        id='modal-open-modalok_new'
                        className='d-none'
                        data-bs-target='#modalok_new'
                        data-bs-toggle='modal'
                        onClick={async () => { }}
                      />

                      {/** Modal button (activate on the action) */}
                      <button
                        type='button'
                        id='modal-open-modalok_draft'
                        className='d-none'
                        data-bs-target='#modalok_draft'
                        data-bs-toggle='modal'
                      />

                    </div>

                  </section>
                  {messageError && (
                    <h5 className='mt-1 text-danger text-center'>{strings('placeholder.addLine')}</h5>
                  )}
                </div>
              </form>

            </div>
          </div>

          {/* Delete invoice  */}
          {isEdit
            ? (
              <>
                <div className='bg-card rounded shadow mb-0 text-center text-lg-start'>
                  <div className='card-body p-6 p-lg-8 px-xl-12 px-xxl-16 d-lg-flex align-items-center'>
                    <div className='pe-lg-20'>
                      <div className='h4 text-danger mb-2'>{strings('form.placeholder.deleteInvoiceTitle')}</div>
                      <p className='text-sm text-muted mb-3 mb-lg-0'>
                        {strings('form.placeholder.deleteInvoiceDescription')}
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
                </div>
              </>)
            : <></>}
        </div>
      </div>
      {/** Modals */}
      <AddClientModal />
      <SendInvoiceModal />
      <AddInvoiceModalDraft />
      {isEdit
        ? <DeleteModal
            id={isEdit ? id : ''}
            apiDelete={apiDeleteInvoice}
            route={Routing.invoices}
            callback={apiGetInvoicesIssued}
            question={strings('placeholder.deleteElementQuestion', { element: strings('placeholder.invoice').toLowerCase() })}
            warning={strings('placeholder.deleteElementWarning', { element: strings('placeholder.invoice').toLowerCase() })}
            success={strings('placeholder.deleteElementSuccess', { element: strings('placeholder.invoice') })}
          />
        : <></>}
    </>
  )
}
