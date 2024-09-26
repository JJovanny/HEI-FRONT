import { strings } from 'src/resources/locales/i18n'
import { useRouter } from 'next/navigation'
import { useDispatch, useSelector } from 'src/redux/hooks'
import { apiPostInvoiceCsv } from 'src/invoice/InvoiceActions'
import { IUserState } from 'src/types/user'
import { EUserType, InvoiceStatus } from 'src/types/enums'
import { useEffect, useRef, useState } from 'react'
import { dateFormatCsv } from 'src/utils/dates'
import moment from 'moment'
import xmljs from 'xml-js';
import { findTaxeMX } from 'src/utils/Utils'
import { IFiles } from 'src/types/invoice'
import { setUserDataProps } from 'src/user/UserActions'

export default function CrateBatchInvoiceModal() {
  const dispatch = useDispatch()
  const router = useRouter()
  const { dataUser, showFormSupplierCraate } = useSelector(state => state.UserReducer as IUserState)
  const userType = dataUser?.userType
  const email = dataUser?.email
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [headerError, setHeaderError] = useState(true);
  const { companyBranchSelected } = dataUser
  const [send, setSend] = useState<Invoice[]>([]);
  const [errorMessage, setErrorMessage] = useState<string>('');
  const [fileNames, setFileNames] = useState<string[]>([]);
  const currencyCode: string = companyBranchSelected && companyBranchSelected['currencyCode'] ? companyBranchSelected['currencyCode'] : ''
  const cif: string = companyBranchSelected && companyBranchSelected['cif'] ? companyBranchSelected['cif'] : ''
  const countryCurrencySupplier: string = companyBranchSelected && companyBranchSelected['country'] && typeof companyBranchSelected['country'] === 'object' && companyBranchSelected['country']['currencies'] && Array.isArray(companyBranchSelected['country']['currencies']) ? companyBranchSelected['country']['currencies'][0] : ''

  const [supplierDetails, setSupplierDetails] = useState({
    supplierEmail: '',
    supplierPhone: '',
    supplierCompanyName: '',
    supplierName: '',
    supplierLastname: '',
  });

  
  const expectedHeaders = ['IDENTIFICADOR', 'FECHA EMISION', 'FECHA CADUCIDAD', 'PROVEEDOR (CIF)', 'CLIENTE (CIF)', 'CONCEPTO', 'CANTIDAD', 'IMPORTE', 'IMPUESTO', 'PORCENTAJE'];

  const generateCSV = () => {
    const headers = ['IDENTIFICADOR', 'FECHA EMISION', 'FECHA CADUCIDAD', 'PROVEEDOR (CIF)', 'CLIENTE (CIF)', 'CONCEPTO', 'CANTIDAD', 'IMPORTE', 'IMPUESTO', 'PORCENTAJE'];

    const csvData: string[] = [];
    csvData.push(headers.join(','));

    const csvString = csvData.join('\n');

    const blob = new Blob([csvString], { type: 'text/csv;charset=utf-8;' });

    const url = URL.createObjectURL(blob);

    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', 'invoices.csv');
    document.body.appendChild(link);

    link.click();

    URL.revokeObjectURL(url);
  };


  interface Invoice {
    invoiceNumber: string;
    issueDate: string;
    dueDate?: string;
    supplierCif: string;
    supplierEmail?: string,
    supplierPhone?: string,
    supplierCompanyName?: string,
    supplierName?: string,
    supplierLastname?: string,
    customerCif: string;
    status: string;
    currencyCode: string;
    subtotal?: number;
    grandTota?: number;
    docs?: IFiles[],
    observations?: string,
    lines: {
      concept: string;
      amount: number;
      items: number;
      taxName?: string,
      percentage?: number,
    }[];
  }

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setSupplierDetails((prev) => ({
      ...prev,
      [name]: value
    }))
  };

  const handleFileChange = async () => {
    if (fileInputRef.current && fileInputRef.current.files) {
      const files = Array.from(fileInputRef.current.files);
      setFileNames(files.map(file => file.name));
      await Promise.all(files.map(processFile));
    }
  };

  const handleDrop = async (e: React.DragEvent<HTMLLabelElement>) => {
    e.preventDefault();
    const files = Array.from(e.dataTransfer.files as FileList);
    setFileNames(files.map(file => file.name));
    await Promise.all(files.map(processFile));
  };


  const handleDragOver = (e: React.DragEvent<HTMLLabelElement>) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'copy';
  };

  const processFile = async (file) => {
    return new Promise<void>((resolve) => {
      const reader = new FileReader();
      reader.onload = async (e) => {
        if (e.target) {
          const fileText = e.target.result as string;

          if (isXML(fileText)) {
            await handleFilesXML(fileText, file)
          } else if (isCSV(fileText)) {
            await handleFilesCSV(fileText)
          }
          resolve();
        }
      };
      reader.readAsText(file);
    });
  };

  const isCSV = (text) => {
    const rows = text.split('\n');
    const firstRow = rows[0];
    const commaSeparated = firstRow.split(',');
    const semicolonSeparated = firstRow.split(';');
    return commaSeparated.length > 1 || semicolonSeparated.length > 1;
  };

  const isXML = (text) => {
    const parser = new DOMParser();
    const xmlDoc = parser.parseFromString(text, 'application/xml');
    return xmlDoc.getElementsByTagName('parsererror').length === 0;
  };

  const handleFilesCSV = async (csvData) => {

    const lines = csvData.split('\n');

    const separatedByCommasHeader = lines[0].trim().split(',')
    const separatedBySemicolonHeader = lines[0].trim().split(';')
    const headers = separatedByCommasHeader.length !== 1 ? separatedByCommasHeader : separatedBySemicolonHeader

    const areHeadersValid = headers.length === expectedHeaders.length && expectedHeaders.every((value, index) => value === headers[index]);
    setHeaderError(!areHeadersValid);
    if (areHeadersValid) {

      const data: Invoice[] = [];

      if (lines.length === 0 || lines.length === 1) {
        setErrorMessage(strings('placeholder.csvIsEmpty'));
        setHeaderError(true)
        return
      }

      for (let i = 1; i < lines.length; i++) {

        const separatedByCommas = lines[i].trim().split(',').filter(row => row.trim() !== '');
        const separatedBySemicolon = lines[i].trim().split(';').filter(row => row.trim() !== '');

        const values = separatedByCommas.length !== 1 ? separatedByCommas : separatedBySemicolon

        if (values.slice(0, 8).every(value => value.trim() !== '')) {

          if (!dateFormatCsv(values[2]) || !dateFormatCsv(values[1])) {
            setErrorMessage(strings('placeholder.errFormatDate'));
            setHeaderError(true)
            return
          }

          let parsedIssueDate = moment(values[1], 'MM/DD/YYYY');
          let parsedDueDate = moment(values[2], 'MM/DD/YYYY');
          let formattedIssueDate = values[1]
          let formattedDueDate = values[2]

          if (!parsedIssueDate.isValid() || !parsedDueDate.isValid()) {
            setErrorMessage(strings('placeholder.errFormatDate'));
            setHeaderError(true)
            return
          } else {
            formattedIssueDate = parsedIssueDate.format('YYYY-MM-DD');
            formattedDueDate = parsedDueDate.format('YYYY-MM-DD');
          }

          if (userType === EUserType.PAYER && cif !== values[4]) {
            setErrorMessage(strings('placeholder.cannotCreateInvoicesOtherPayers'));
            setHeaderError(true)
            return
          }

          const invoice: Invoice = {
            invoiceNumber: values[0],
            issueDate: formattedIssueDate,
            dueDate: formattedDueDate,
            supplierCif: values[3],
            customerCif: values[4],
            currencyCode: currencyCode !== '' && countryCurrencySupplier === '' ? currencyCode : countryCurrencySupplier !== '' ? countryCurrencySupplier : 'USD',
            status: InvoiceStatus.APPROVAL_PENDING,
            lines: [{ concept: values[5], amount: parseFloat(values[7]) as unknown as number, items: values[6] as unknown as number, taxName: values[8] !== '' && values[8] !== undefined ? values[8] : undefined, percentage: values[9] !== '' && values[9] !== undefined ? parseFloat(values[9]) : undefined }]
          };


          if (supplierDetails.supplierEmail !== '') {
            invoice.supplierEmail = supplierDetails.supplierEmail;
          }

          if (supplierDetails.supplierPhone !== '') {
            invoice.supplierPhone = supplierDetails.supplierPhone;
          }

          if (supplierDetails.supplierCompanyName !== '') {
            invoice.supplierCompanyName = supplierDetails.supplierCompanyName;
          }

          if (supplierDetails.supplierName !== '') {
            invoice.supplierName = supplierDetails.supplierName;
          }

          if (supplierDetails.supplierLastname !== '') {
            invoice.supplierLastname = supplierDetails.supplierLastname;
          }

          const existingInvoiceIndex = data.findIndex(invoice => invoice.invoiceNumber === values[0]);
          if (existingInvoiceIndex !== -1) {
            data[existingInvoiceIndex].lines.push({ concept: values[5], amount: parseFloat(values[7]) as unknown as number, items: values[6] as unknown as number, taxName: values[8] !== '' && values[8] !== undefined ? values[8] : undefined, percentage: values[9] !== '' && values[9] !== undefined ? parseFloat(values[9]) : undefined });
          } else {
            if (invoice.invoiceNumber !== undefined) data.push(invoice);
          }

          setSend(prevSend => [...prevSend, ...data]);

        } else {
          setErrorMessage(strings('placeholder.thereIsARowWithEmptyColumns'));
          setHeaderError(true)
          return
        }
      }

      setHeaderError(false)

    } else {
      setHeaderError(true)
      setErrorMessage(strings('placeholder.columnsDoNotMatchCsv'));
    }
  }

  const handleFilesXML = async (xmlData, file) => {
    const jsonData = xmljs.xml2json(xmlData, { compact: true, spaces: 4 });
    const parsedData = JSON.parse(jsonData);

    await handleValidateXml(parsedData)

    const reader = new FileReader()
    const fileNameAndType = file.name?.split('.')
    const fileName = fileNameAndType[0].trim()
    const fileType = fileNameAndType[1].trim().toLowerCase()
    const docs: IFiles[] = []

    reader.readAsDataURL(file)
    reader.onload = (e) => {
      docs.push({
        filename: fileName, remove: false, stream: e?.target?.result + '', size: file.size, format: fileType, file: ''
      })
    }

    const listLines = parsedData['cfdi:Comprobante']['cfdi:Conceptos']['cfdi:Concepto']
    const multipleLines = Array.isArray(listLines)
    const invoiceNumber = parsedData['cfdi:Comprobante']['cfdi:Complemento']['tfd:TimbreFiscalDigital']['_attributes']['UUID']

    const lines = multipleLines ? listLines : [listLines]

    const invoice: Invoice = {
      invoiceNumber: invoiceNumber,
      issueDate: parsedData['cfdi:Comprobante']['_attributes']['Fecha'],
      supplierCif: parsedData['cfdi:Comprobante']['cfdi:Emisor']['_attributes']['Rfc'],
      customerCif: parsedData['cfdi:Comprobante']['cfdi:Receptor']['_attributes']['Rfc'],
      currencyCode: parsedData['cfdi:Comprobante']['_attributes']['Moneda'] ? parsedData['cfdi:Comprobante']['_attributes']['Moneda'] : 'USD',
      status: InvoiceStatus.APPROVAL_PENDING,
      lines: [],
      docs
    };

    if (supplierDetails.supplierEmail !== '') {
      invoice.supplierEmail = supplierDetails.supplierEmail;
    }

    if (supplierDetails.supplierPhone !== '') {
      invoice.supplierPhone = supplierDetails.supplierPhone;
    }

    if (supplierDetails.supplierCompanyName !== '') {
      invoice.supplierCompanyName = supplierDetails.supplierCompanyName;
    }

    if (supplierDetails.supplierName !== '') {
      invoice.supplierName = supplierDetails.supplierName;
    }

    if (supplierDetails.supplierLastname !== '') {
      invoice.supplierLastname = supplierDetails.supplierLastname;
    }

    lines.forEach(line => {
      const tax = line['cfdi:Impuestos'] ? line['cfdi:Impuestos']['cfdi:Traslados']['cfdi:Traslado']['_attributes'] : undefined
      const _attributes = line['_attributes']
      const taxName = tax ? findTaxeMX(tax['Impuesto']) : undefined
      const percentage = tax ? parseFloat(tax['TasaOCuota']) * 100 : undefined;
      invoice.lines.push({ concept: _attributes['Descripcion'], amount: parseFloat(_attributes['ValorUnitario']) as unknown as number, items: _attributes['Cantidad'] as unknown as number, taxName: taxName ? taxName.descripcion : undefined, percentage })
    });

    setSend(prevSend => [...prevSend, invoice]);

  }

  const handleValidateXml = async (parsedData) => {
    if (
      !parsedData['cfdi:Comprobante'] ||
      !parsedData['cfdi:Comprobante']['_attributes'] ||
      !parsedData['cfdi:Comprobante']['cfdi:Emisor'] ||
      !parsedData['cfdi:Comprobante']['cfdi:Receptor'] ||
      !parsedData['cfdi:Comprobante']['cfdi:Receptor']['_attributes']['Rfc'] ||
      !parsedData['cfdi:Comprobante']['cfdi:Emisor']['_attributes']['Rfc'] ||
      !parsedData['cfdi:Comprobante']['_attributes']['NoCertificado'] ||
      !parsedData['cfdi:Comprobante']['_attributes']['Fecha'] ||
      !parsedData['cfdi:Comprobante']['cfdi:Conceptos']['cfdi:Concepto'] ||
      !parsedData['cfdi:Comprobante']['cfdi:Complemento'] ||
      !parsedData['cfdi:Comprobante']['cfdi:Complemento']['tfd:TimbreFiscalDigital'] ||
      !parsedData['cfdi:Comprobante']['cfdi:Complemento']['tfd:TimbreFiscalDigital']['_attributes'] ||
      !parsedData['cfdi:Comprobante']['cfdi:Complemento']['tfd:TimbreFiscalDigital']['_attributes']['UUID']
    ) {

      setErrorMessage(strings('placeholder.invalidXML'));
      setHeaderError(true)
      return
    }

    if (userType === EUserType.PAYER && cif !== parsedData['cfdi:Comprobante']['cfdi:Receptor']['_attributes']['Rfc']) {
      setErrorMessage(strings('placeholder.cannotCreateInvoicesOtherPayers'));
      setHeaderError(true)
      return
    }
  }


  useEffect(() => {
    setSend([])
    setFileNames([])
    setHeaderError(false);
    setErrorMessage('');
    dispatch(setUserDataProps({prop: 'showFormSupplierCraate', value: false}))
    setSupplierDetails({
      supplierEmail: '',
      supplierPhone: '',
      supplierCompanyName: '',
      supplierName: '',
      supplierLastname: '',
    });
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  }, [])


  const handleFileUpload = async () => {
    await dispatch(apiPostInvoiceCsv(send))
    setSend([])
    setFileNames([])
    setHeaderError(false);
    setErrorMessage('');
    dispatch(setUserDataProps({prop: 'showFormSupplierCraate', value: false}))
    setSupplierDetails({
      supplierEmail: '',
      supplierPhone: '',
      supplierCompanyName: '',
      supplierName: '',
      supplierLastname: '',
    });
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  useEffect(() => {
    const {
      supplierEmail,
      supplierPhone,
      supplierCompanyName,
      supplierName,
      supplierLastname
    } = supplierDetails;

    const isAnyFieldFilled =
      supplierEmail !== '' ||
      supplierPhone !== '' ||
      supplierCompanyName !== '' ||
      supplierName !== '' ||
      supplierLastname !== '';

    const areAllFieldsFilled =
      supplierEmail !== '' &&
      supplierPhone !== '' &&
      supplierCompanyName !== '' &&
      supplierName !== '' &&
      supplierLastname !== '';

    if (isAnyFieldFilled && !areAllFieldsFilled) {
      setHeaderError(true);
      setErrorMessage('Todos los campos son requeridos para crear el proveedor');
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
        setFileNames([])
        setSend([])
      }
    } else {
      setHeaderError(false);
      setErrorMessage('');
    }
  }, [supplierDetails]);


  const handleUploadClick = () => {
    document.getElementById('attachfilesCsv')?.click();
  };

  const handleInputClick = () => {
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
      setFileNames([])
      setSend([])
      setHeaderError(false);
      setErrorMessage('');
    }
  };
  return (
    <>
        <div className="modal fade" id="modalInvoiceCsv" aria-labelledby="exampleModalLabel" aria-hidden="true">
          <div className="modal-dialog modal-dialog-centered">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title" id="exampleModalLabel">{strings('placeholder.uploadInvoicesCsv')}</h5>
                <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
              </div>
              <div className="modal-body">
                <h5>{strings('placeholder.instructions')}:</h5>
                <ul>
                  <li>{strings('placeholder.ccvFormat')}</li>
                  <li>{strings('placeholder.visualizeVideoTutorial')}&nbsp;<a className='text-primary cursor-pointer' target='_blank' href='https://www.loom.com/share/55d696ce100746b78f0c76378039bd5a?sid=073eafab-3b03-4522-b8ba-f6d4b938fd8a'>{strings('placeholder.invoiceImportTutorial')}</a></li>
                </ul>

                <h5>{strings('placeholder.selectAcsv')}</h5>
                <h4 className='mb-1'>
                  {fileNames.length > 0 ? fileNames.join(', ') : ''}
                </h4>
                <div className='card shadow-none border-2 border-dashed border-primary-hover position-relative'>
                  <div className='d-flex justify-content-center px-5 py-5'>
                    <label className='fullDimension cursor-pointer'
                      onClick={handleUploadClick}
                      onDrop={handleDrop}
                      onDragOver={handleDragOver}
                    >
                      <div className='text-center'>
                        <div className='text-2xl text-muted'>
                          <i className='bi bi-paperclip' />
                        </div>
                        <div className='text-sm text-dark mt-3'>
                          <label
                            className='custom-file-label  overflow-hidden'
                          >
                            {strings('placeholder.selectFile')}
                          </label>
                        </div>
                      </div>
                    </label>
                    <input
                      className='mt-5 d-none'
                      lang='en'
                      type='file'
                      id="attachfilesCsv"
                      accept='.csv, .xml'
                      ref={fileInputRef}
                      onChange={handleFileChange}
                      onClick={handleInputClick}
                      multiple
                    />
                  </div>
                </div>

                <div className="mb-3">
                  <button
                    className="btn btn-link"
                    type="button"
                    onClick={() => dispatch(setUserDataProps({prop: 'showFormSupplierCraate', value: !showFormSupplierCraate}))}
                  >
                    {strings('placeholder.createSupplierIfNotExist')}&nbsp;
                    <i className={`bi ${showFormSupplierCraate ? 'bi-chevron-up' : 'bi-chevron-down'}`} />
                  </button>
                  {showFormSupplierCraate && (
                    <div className="mt-2">
                      <div className="row">
                        <div className="col-md-6 form-group">
                        <label>{strings('placeholder.email')}</label>
                        <input
                            type="email"
                            className="form-control"
                            name="supplierEmail"
                            value={supplierDetails.supplierEmail}
                            onChange={(e) =>{handleInputChange(e)}}
                          />
                        </div>
                        <div className="col-md-6 form-group">
                        <label>{strings('placeholder.phone')}</label>
                          <input
                            type="text"
                            className="form-control"
                            name="supplierPhone"
                            value={supplierDetails.supplierPhone}
                            onChange={(e) =>{handleInputChange(e)}}
                          />
                        </div>
                      </div>
                      <div className="row">
                        <div className="col-md-6 form-group">
                        <label>{strings('placeholder.nameCompany')}</label>
                          <input
                            type="text"
                            className="form-control"
                            name="supplierCompanyName"
                            value={supplierDetails.supplierCompanyName}
                            onChange={(e) =>{handleInputChange(e)}}
                          />
                        </div>
                        <div className="col-md-6 form-group">
                        <label>{strings('placeholder.firstName')}</label>
                          <input
                            type="text"
                            className="form-control"
                            name="supplierName"
                            value={supplierDetails.supplierName}
                            onChange={(e) =>{handleInputChange(e)}}
                          />
                        </div>
                      </div>
                      <div className="row">
                        <div className="col-md-6 form-group">
                        <label>{strings('form.placeholder.lastName')}</label>
                        <input
                            type="text"
                            className="form-control"
                            name="supplierLastname"
                            value={supplierDetails.supplierLastname}
                            onChange={(e) =>{handleInputChange(e)}}
                          />
                        </div>
                      </div>
                    </div>
                  )}
                </div>


                {headerError && <h5 className="text-danger mt-2">{errorMessage}</h5>}
              </div>
              <div className="modal-footer">
                <button type="button" id="close-mod" className="btn-sm  btn btn-secondary" data-bs-dismiss="modal">{strings('button.close')}</button>
                <button className='btn-sm btn btn-success' onClick={generateCSV}>Descargar Plantilla en CSV</button>
                <button type="button" className="btn btn-primary btn-sm " disabled={headerError || send.length === 0} onClick={(e) => { handleFileUpload() }}>{strings('placeholder.goUpInvoices')}</button>
              </div>
            </div>
          </div>
        </div>
    </>
  )
}
