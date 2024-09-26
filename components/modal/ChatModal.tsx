import React, { useEffect, useState } from 'react'
import { strings } from 'src/resources/locales/i18n'
import Loading from 'ui/Loading'
import { useDispatch, useSelector } from 'src/redux/hooks'
import { apiSendMessageInvoice, setInvoiceDataProps, setValuePostInvoiceData} from 'src/invoice/InvoiceActions'
import { includeLineBreak } from 'src/validations/strings'
import { formatShortDateWithHour } from 'src/api/utils'
import Paper from 'public/images/paper.png'
import { EUserType, InvoiceStatus } from 'src/types/enums'
import FileInput from 'ui/input/FileInput'
import { AttachfilesChat } from 'components/invoice/AttachfilesChat'
import { IFiles } from 'src/types/invoice'

export const ChatModal = ({ isReceived = false}) => {
  const dispatch = useDispatch()
  const [message, setMessage] = useState('')
  const [disabledButton, setDisabledButton] = useState(true)
  const [recipient, setRecipient] = useState(undefined)
  const [attachFiles, setAttachFiles] = useState<IFiles[]>([]);

  const { isLoadingSendMessage,invoice, email, userType, currency, isLoadingGetInvoice } = useSelector(({ InvoiceReducer, UserReducer }) => {
    const { invoice,currency, isLoadingSendMessage, isLoadingGetInvoice } = InvoiceReducer as any
    const { dataUser } = UserReducer
    const { userType, email } = dataUser

    return { dataUser, invoice, isLoadingSendMessage, userType, email, currency, isLoadingGetInvoice }
  })

  const {invoiceNumber, customer, attachfilesChat, financial, paymentPreferences, status, supplier, id, messages } = invoice
  const isExternal = paymentPreferences !== undefined && paymentPreferences?.externalPayment !== undefined ? paymentPreferences?.externalPayment : false
  
  const chatWithFinancial = (
    status === InvoiceStatus.QUICKPAY || status === InvoiceStatus.ADVANCED || status === InvoiceStatus.PAID
  ) && isExternal && (userType === EUserType.PAYER || userType === EUserType.BOTH)
  
  const handleChangeMessage = async (event) => {
    setMessage(event.target.value)
  }

  const [filterMessages, setFilterMessages] = useState(messages) 


  useEffect(() => {
    if (userType === EUserType.PAYER && supplier !== undefined && supplier?.id) {
      setRecipient(supplier?.id)
    }

    if (userType ===EUserType.SUPPLIER && customer !== undefined && customer?.id) {
      setRecipient(customer?.id)
    }

    if (userType === EUserType.FINANCIAL && customer !== undefined && customer?.id) {
      setRecipient(customer?.id)
    }

  }, [invoice?.supplier, invoice?.customer])


  
  useEffect(() => {
    if (messages && messages.length > 0) {
      if (userType === EUserType.SUPPLIER && supplier !== undefined && supplier?.id) {
          const filteredMessages = messages.filter(message => message.recipients === supplier?.id || message.company === supplier?.contactEmail);
          setFilterMessages(filteredMessages)
      }

      if (userType === EUserType.FINANCIAL && financial !== undefined && financial?.id) {
        const filteredMessages = messages.filter(message => message.recipients === financial?.id || message.company === financial?.contactEmail);
        setFilterMessages(filteredMessages)
      }
    }
}, [messages, invoice?.supplier, invoice?.customer])

  useEffect(() => {
  if (messages && messages.length > 0) {
      if (userType === EUserType.PAYER && recipient !== undefined) {
        const financialId = financial !== undefined && financial.id ? financial.id : ''
        const companyEmail = financialId === recipient ? financial?.contactEmail : supplier?.contactEmail
        const filteredMessages = messages.filter(message => message.recipients === recipient || message.company === companyEmail);
        setFilterMessages(filteredMessages)
      }
    }else {
      setFilterMessages([])
    }
  }, [messages, recipient, invoice?.supplier, invoice?.customer])


  const handleSendMessage = async () => {
    let recipientMessage = ''

    if (recipient) {
      recipientMessage = recipient
    }

    if ((userType === EUserType.SUPPLIER || userType === EUserType.BOTH) && customer !== undefined && customer?.id) {
      recipientMessage = customer?.id
    }

    if (userType === EUserType.FINANCIAL && customer !== undefined && customer?.id) {
      recipientMessage = customer?.id
    }

    await dispatch(apiSendMessageInvoice(id, message, recipientMessage))
    setMessage('')
  }

  const handleSelectRecipient = async (companyId) => {
    setRecipient(companyId)
  }

  function getInitials(fullName) {
    let primeraLetra = fullName?.charAt(0).toUpperCase();
    const primerEspacioIndex = fullName?.indexOf(' ');

    if (primerEspacioIndex !== -1 && primerEspacioIndex + 1 < fullName?.length) {
        primeraLetra += fullName?.charAt(primerEspacioIndex + 1).toUpperCase();
    }
    return primeraLetra;
  }

  function renderInitial (message) {
    return (
        <div className={`position-relative d-flex align-items-center justify-content-center me-2 ms-2 ${message.company === email ? 'bg-primary' : 'bg-gray-400'}`} style={{ width: '37px', height: '37px', borderRadius: '50%' }}>
            <span className="text-white">{message?.companyName && (getInitials(message?.companyName))}</span>
        </div>
    )
  }  


  function RenderTittle () {
    if (isReceived) {
      return (
        <div className='row align-items-start'>
          <div className='col-md-12 col-xl-12 mb-3 mb-lg-0 d-flex justify-content-between'>
            <h4 className='h4 mb-3 mb-md-5'>
              {`${invoiceNumber} - ${supplier.name}`}
            </h4>
            <div>
              {selectChatRole()}
            </div>
          </div>
        </div>

      )
    } 
    if (!isReceived) {
        return (
          <div className='row align-items-start'>
            <div className='col-md-4 col-xl-4 mb-3 mb-lg-0'>
              <h4 className='h4 mb-3 mb-md-5'>
                {`${invoiceNumber} - ${customer.name}`}
              </h4>
            </div>
          </div>
        ) 
      } 
  }

  function selectChatRole () {
    return (
      chatWithFinancial && (
       <>
        <div className="dropdown">
          <span>{strings('placeholder.messageRecipient')}</span>
          <button className="btn btn-secondary btn-sm dropdown-toggle ms-2" type="button" id="dropdownMenuButton1" data-bs-toggle="dropdown" aria-expanded="false">
          {recipient === undefined || recipient === null && (strings('placeholder.selectUserType'))}
          {(supplier !== undefined && recipient === supplier?.id) && (<p>{strings('placeholder.supplier')} - {supplier?.name}</p>)}
          {(financial !== undefined && recipient === financial?.id) && (<p>{strings('placeholder.financial')} - {financial?.name}</p>)}
          </button>
          <ul className="dropdown-menu" aria-labelledby="dropdownMenuButton1">
            <li><a onClick={(e) => {handleSelectRecipient(supplier?.id)}} className="dropdown-item cursor-pointer">{strings('placeholder.supplier')} - {supplier.name}</a></li>
            {financial !== undefined && (
              <li><a onClick={(e) => {handleSelectRecipient(financial?.id)}} className="dropdown-item cursor-pointer">{strings('placeholder.financial')} - {financial.name}</a></li>
            )}
          </ul>
        </div>
       </>
      )
    )
  } 

  function RenderMessages () {
    return (
      <div className="col-md-12 col-xl-12 mb-3 mb-lg-0 mt-5" style={{maxHeight: '300px', overflowY: 'auto', scrollBehavior: 'smooth', display: 'flex', flexDirection: 'column-reverse'}}>
        
        {filterMessages && filterMessages.length > 0 ? (
          filterMessages.slice().reverse().map((message, index) => (  
            <div key={index} className={`d-flex flex-column mb-3 mt-5 ${filterMessages && filterMessages.length > 1 && 'border-top'} ${message.company === email ? 'align-items-end' : 'align-items-start'}`}>
              <div className={`p-3 m-3 mt-5 position-relative d-inline-flex align-items-center ${message.company === email ? 'rounded-end' : 'bg-light rounded-start'}`} style={{ justifyContent: message.company === email ? 'flex-end' : 'flex-start' }}>
              {email !== message.company && (renderInitial(message))}
              
              <div style={email === message.company ? {marginRight: '6%'} : {marginLeft: '6%'}}>
              {includeLineBreak(message.message)}
              {message.attachfilesChat && message.attachfilesChat.length !== 0 && (
              <div className='row g-3 mb-5'>
              {message.attachfilesChat.map((file, index) =>
                message.attachfilesChat[index].remove
                ? <div key={index} className='d-none' />
                : <AttachfilesChat
                    key={index}
                    index={index}
                    fileName={file.filename}
                    size={file.size}
                    format={file.format}
                    onlyView={true}
                    path={file.file}
                    />
            )}
              </div>
              )}
              </div>

                {email === message.company && (renderInitial(message))}
              </div>
              <div className={`text-muted col-12 ${message.company === email ? 'text-start ps-3' : 'text-end pe-5'}`}>
                {formatShortDateWithHour(message.createdAt)}
              </div>
            </div>
          ))
        ) : (
          <div className="text-center">{strings('placeholder.noMessages')}</div>
        )}
      </div>
    )
  }

  const handleIconClick = () => {
    document.getElementById('attachfilesChat')?.click();
  };

  function handleFileInputChange (prop, eventFiles, isFile) {
    if (isFile) {
      if (eventFiles && eventFiles.length > 0) {
        const reader = new FileReader()
        const fileNameAndType = eventFiles[0].name?.split('.') 
        const fileName = fileNameAndType[0].trim()
        const fileType = fileNameAndType[1].trim().toLowerCase()

        reader.readAsDataURL(eventFiles[0])
        reader.onload = (e) => {
            attachfilesChat.push({
            filename: fileName, remove: false, stream: e?.target?.result + '', size: eventFiles[0].size, format: fileType, file: ''
          })
          dispatch(setValuePostInvoiceData({ prop, value: attachfilesChat }))
        }
      }
    } else {
      dispatch(setValuePostInvoiceData({ prop, value: eventFiles }))
    }
  }


  useEffect(() => {
    setAttachFiles(attachfilesChat)
  },[invoice])

  useEffect(() => {
    const allFilesToRemove = attachFiles.every(file => file.remove === true);
    if ((message !== undefined && message !== '' && (!isLoadingGetInvoice) || (attachFiles.length !== 0 && !allFilesToRemove))) {
          setDisabledButton(false)
      } else {
          setDisabledButton(true)
      }
  }, [message, attachFiles, invoice])

  return (
    <>
      <div className='modal fade' id='modalViewChat' tabIndex={-1} data-bs-backdrop='static' data-bs-keyboard='false' aria-labelledby='modalViewChat' aria-hidden='true'>
        <div className='modal-dialog modal-dialog-scrollable modal-dialog-centered modal-xl'>
          <div className='modal-content shadow-3'>
            <div className='modal-header py-4 d-none'>
              <h5 className='modal-title'>{strings('title.invoice.viewInvoice')}</h5>
              <div className='text-xs ms-auto'>
                <button type='button' className='btn-close' id='prueba' data-bs-dismiss='modal' aria-label='Close' />
              </div>
            </div>
                <div className='modal-body'>
                  <div id='factView' className='px-lg-4_ py-lg-2_'>
                    {RenderTittle()}
                    <RenderMessages/>
                    <div className="mt-5 d-flex">
                      <input
                          type="file"
                          id="attachfilesChat"
                          style={{ display: 'none' }}
                          onChange={(e) => handleFileInputChange(e.target.id, e.target.files, true)}                        />
                        <i className="bi bi-images h2 p-2 cursor-pointer" onClick={handleIconClick}></i>
                        <textarea className='form-control' style={{ resize: 'none' }} value={message} rows={1} cols={30} onChange={(e) => {handleChangeMessage(e)}}/>
                        <button className={`btn btn-sm ms-2 ${!disabledButton && !isLoadingSendMessage? 'btn-primary' : 'btn-secondary'}`} onClick={(e) => {handleSendMessage()}} type="button">
                        {!isLoadingSendMessage ? <img src={Paper.src} width='30' height='30'/> : <Loading />}
                        </button>
                    </div>
                  </div>
                </div>

                        { (attachFiles && attachFiles.length !== 0) && (
                            <div className='row g-3 mb-5'>
                                {attachFiles.map((file, index) =>
                                attachFiles[index]?.remove
                                ? <div key={index} className='d-none' />
                                : <AttachfilesChat
                                    key={index}
                                    index={index}
                                    fileName={file.filename}
                                    size={file.size}
                                    format={file.format}
                                    onlyView={false}
                                    path={file.file}
                                    />
                                 )}
                            </div>
                        )}

            <div className='modal-footer justify-content-between py-2'>
              <div className='d-flex align-items-center justify-content-center gap-3'>
                <a className='btn btn-sm btn-neutral' data-bs-dismiss='modal' id='close-invoice-adance-modal'>
                  {strings('button.close')}
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}
