import React, { useEffect, useMemo, useState } from 'react'
import { useSelector } from 'react-redux'
import { useDispatch } from 'src/redux/hooks'
import { apiDeleteAutomationRules, apiGetSupplierClients, apiPostCustomerRelationShipPaymentPreferences, apiPostSupplierRelationShipPaymentPreferences, apiPutAutomationRules, setPaymentPreferences } from 'src/client/ClientActions'
import { strings } from 'src/resources/locales/i18n'
import { apiGetMySuppliers } from 'src/supplier/SupplierActions'
import { EUserType, InvoiceStatus } from 'src/types/enums'
import { IClientState } from 'src/types/client'
import { getInvoiceStatus, getInvoiceStatusBadgeColor } from 'src/api/utils'
import Swal from 'sweetalert2'
import { validateRuleRange, validateSimilarityValueAndOperator } from 'src/utils/numbers'

export const PaymentSettings = () => {
  const dispatch = useDispatch()
  const { dataUser } = useSelector(({ UserReducer }) => {
    const { dataUser } = UserReducer
    return { dataUser }
  })
  const userType = dataUser?.userType
  const { paymentPreferences, selectedSupplierId, companyRelationshipId, automationRules } = useSelector(({ ClientReducer }) => {
    const { paymentPreferences, selectedSupplierId, automationRules, companyRelationshipId } = ClientReducer as IClientState
    return { paymentPreferences, selectedSupplierId, automationRules, companyRelationshipId }
  })

  const [automationsData, setAutomatizationData] = useState({
    logicalOperator: '',
    value: 0,
    status: '',
    type: 'Importe',
    andOr: '',
    secondValue: 0,
    secondLogicalOperator: '',
  })

  const styles = {
    leftPanel: {
      marginRight: '20px',
    },
    width: {
      width: '25%'
    },
    leftPanelMin: {
      marginRight: '15px',
    },
    subtitle: {
      fontSize: '0.9em',
      color: '#6c757d',
      margin: 0,
      marginRight: '10px',
    },
    selectLarge: {
      fontSize: '1em',
      padding: '0.20em 0.5em',
      width: '80%',
    },
    selectWidth: {
      fontSize: '1em',
      padding: '0.20em 0.5em',
      width: '100%',
    },
  };

  const status = [
    {
      key: InvoiceStatus.ACCEPTED,
      value: strings('invoiceStatus.accepted')
    },
    {
      key: InvoiceStatus.QUICKPAY_AVAILABLE,
      value: strings('button.quickpayOffered')
    },
    {
      key: InvoiceStatus.REJECTED,
      value: strings('invoiceStatus.rejected')
    },
  ]


  // const [automationRules, setAutomationRules] = useState([
  //   { type: 'Importe', logicalOperator: '>', value: 100, status: 'ACCEPTED', andOr: 'OR', secondValue: 50 },
  //   { type: 'Importe', logicalOperator: '<', value: 50, status: 'REJECTED' },
  //   // Otros registros según sea necesario
  // ]);

  const [allowPaymentInAdvance, setAllowPaymentInAdvance] = useState(paymentPreferences && paymentPreferences?.allowPaymentInAdvance !== undefined ? paymentPreferences?.allowPaymentInAdvance : true)
  const [dailyDiscountToApply, setDailyDiscountToApply] = useState(paymentPreferences && paymentPreferences?.dailyDiscountToApply !== undefined ? paymentPreferences?.dailyDiscountToApply : 0)
  const [creditLimit, setCreditLimt] = useState(paymentPreferences && paymentPreferences?.creditLimit !== undefined ? paymentPreferences?.creditLimit : 0)
  const [externalPayment, setExternalPayment] = useState(paymentPreferences && paymentPreferences?.externalPayment !== undefined ? paymentPreferences?.externalPayment : false)
  const [interestArrears, setInterestArrears] = useState(paymentPreferences && paymentPreferences?.interestArrears !== undefined ? paymentPreferences?.interestArrears : 0.005)
  const [numberDaysUntilExpirationDate, setNumberDaysUntilExpirationDate] = useState(paymentPreferences && paymentPreferences?.numberDaysUntilExpirationDate !== undefined ? paymentPreferences?.numberDaysUntilExpirationDate : 7)
  const [showAutomatization, setShowAutomatization] = useState(false)

  const handleSwitch = async () => {
    setExternalPayment(!externalPayment)
  }

  const handleSavePaymentSettings = async () => {
    document.getElementById('closeModalPaymetSettings')?.click()
    if (userType === EUserType.FINANCIAL) {
      await dispatch(apiPostCustomerRelationShipPaymentPreferences())
      await dispatch(apiGetSupplierClients())
    } else {
      await dispatch(apiPostSupplierRelationShipPaymentPreferences())
      await dispatch(apiGetMySuppliers())
    }
  }

  const handleValueForm = (name, val) => {
    setAutomatizationData((prev) => ({
      ...prev,
      [name]: val
    }));
  }

  useEffect(() => {
    setCreditLimt(paymentPreferences && paymentPreferences?.creditLimit !== undefined ? paymentPreferences?.creditLimit : 0)
    setAllowPaymentInAdvance(paymentPreferences && paymentPreferences?.allowPaymentInAdvance !== undefined ? paymentPreferences?.allowPaymentInAdvance : true)
    setDailyDiscountToApply(paymentPreferences && paymentPreferences?.dailyDiscountToApply !== undefined ? paymentPreferences?.dailyDiscountToApply : 0)
    setExternalPayment(paymentPreferences && paymentPreferences?.externalPayment !== undefined ? paymentPreferences?.externalPayment : false)
    setInterestArrears(paymentPreferences && paymentPreferences?.interestArrears !== undefined ? paymentPreferences?.interestArrears : 0.005)
    setNumberDaysUntilExpirationDate(paymentPreferences && paymentPreferences?.numberDaysUntilExpirationDate !== undefined ? paymentPreferences?.numberDaysUntilExpirationDate : 7)
  }, [paymentPreferences])

  useEffect(() => {
    const paymentPreferencesObject = {
      externalPayment: userType !== EUserType.FINANCIAL ? externalPayment : true,
      dailyDiscountToApply,
      allowPaymentInAdvance,
    }

    if (userType === EUserType.FINANCIAL) {
      paymentPreferencesObject['creditLimit'] = creditLimit
      paymentPreferencesObject['interestArrears'] = interestArrears
    }


    if (userType !== EUserType.FINANCIAL) {
      paymentPreferencesObject['numberDaysUntilExpirationDate'] = numberDaysUntilExpirationDate
    }

    dispatch(setPaymentPreferences({ prop: 'paymentPreferences', value: paymentPreferencesObject }))
  }, [allowPaymentInAdvance, dailyDiscountToApply, numberDaysUntilExpirationDate, interestArrears, externalPayment, creditLimit])

  useEffect(() => {
    if (externalPayment && userType !== EUserType.FINANCIAL) setDailyDiscountToApply(0)
  }, [externalPayment])

  useEffect(() => {
    if (!showAutomatization) {
      setAutomatizationData({
        logicalOperator: '',
        value: 0,
        status: '',
        type: 'Importe',
        andOr: '',
        secondValue: 0,
        secondLogicalOperator: '',
      });
    }
  }, [showAutomatization])

  useEffect(() => {
    if (automationsData.secondLogicalOperator) {
      setAutomatizationData((prev) => ({
        ...prev,
        andOr: 'AND'
      }))
    }
  }, [automationsData.secondLogicalOperator])


  const isValidData = useMemo(() => {
    const { logicalOperator, value, status, secondValue, secondLogicalOperator } = automationsData;

    if (secondLogicalOperator !== '' && (secondValue === 0 || String(secondValue) === '0')) {
      return false;
    }

    return (
      logicalOperator !== '' &&
      value !== 0 &&
      status !== '' &&
      (secondLogicalOperator === '' || secondValue !== 0 || String(secondValue) !== '0')
    );
  }, [automationsData]);


  const handleSaveRule = async () => {  
    const existingRulesWithSameStatus = automationRules;
    for (let existingRule of existingRulesWithSameStatus) {

      if (validateSimilarityValueAndOperator(existingRule, automationsData)){
        Swal.fire({
          icon: 'error',
          title: 'Error',
          text: strings('placeholder.similarRuleError'),
          toast: true,
          position: 'top-end',
          showConfirmButton: false,
          timer: 3000,
          timerProgressBar: true
        });
        return;
      }
      
      if (validateRuleRange(existingRule, automationsData)) {
        Swal.fire({
          icon: 'error',
          title: 'Error',
          text: strings('placeholder.contradictoryRule'),
          toast: true,
          position: 'top-end',
          showConfirmButton: false,
          timer: 3000,
          timerProgressBar: true
        });
        return;

      }
    }
  
    await dispatch(apiPutAutomationRules(selectedSupplierId, companyRelationshipId, automationsData));
  
    setAutomatizationData({
      logicalOperator: '',
      value: 0,
      status: '',
      type: 'Importe',
      andOr: '',
      secondValue: 0,
      secondLogicalOperator: ''
    });
  };
    
  const handleRemoveRule = async (e, index) => {
    Swal.fire({
      title: strings('placeholder.youreSure'),
      text: strings('placeholder.ableToreverse'),
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: strings('placeholder.delete'),
      cancelButtonText: strings('button.cancel')
    }).then(async (result) => {
      if (result.isConfirmed) {

        await dispatch(apiDeleteAutomationRules(selectedSupplierId, companyRelationshipId, index))

        Swal.fire(
          strings('placeholder.removed'),
          strings('placeholder.ruleHasBeenRemoved'),
          'success'
        );
      }
    });
  }

  return (
    <>
      <div className='modal fade' id='modalPaymetSettings' tabIndex={-1} aria-labelledby='modalPaymetSettings' aria-hidden='true' aria-modal='true'>
        <div className='modal-dialog modal-dialog-scrollable modal-dialog-centered modal-lg'>
          <div className='modal-content shadow-3'>
            <div className='modal-header py-4'>
              {showAutomatization && (
                <h5 className='modal-title'>{strings('paymentPreferences.automations')}</h5>
              )}
              {!showAutomatization && (
                <h5 className='modal-title'>{strings('paymentPreferences.title')}</h5>
              )}

              <div className='text-xs ms-auto'>
                <button type='button' id='closeModalPaymetSettings' onClick={(e) => { setShowAutomatization(false) }} className='btn-close' data-bs-dismiss='modal' aria-label='Close' />
              </div>
            </div>
            {!showAutomatization && (
              <div className='modal-body'>
                {/** Form */}
                <form id='form-approve'>
                  <div className='row g-5'>
                    {(userType !== EUserType.FINANCIAL) && (
                      <>
                        <div className='col-8 mb-3'>
                          <div className='form-group'>
                            <label className='form-label' htmlFor='first_name'>{strings('placeholder.numberDaysUntilExpirationDate')}</label>
                            <div className='input-group input-group-inline'>
                              <input
                                type='number'
                                className='form-control'
                                id='max_percent'
                                placeholder='0.00'
                                aria-label='0.00'
                                value={numberDaysUntilExpirationDate}
                                min={0}
                                max={100}
                                step={1}
                                onChange={async (e) => {
                                  setNumberDaysUntilExpirationDate(parseInt(e.target.value))
                                }}
                              />
                            </div>
                          </div>
                        </div>
                      </>
                    )}

                    <div className='col-12 mb-3'>
                      <div className='form-group'>
                        <label className='form-label' htmlFor='first_name'>{strings('invoiceActions.accept.advancePayment')}</label>
                        <div className='form-check form-switch ps-0 d-flex align-items-center justify-content-start gap-4'>
                          {strings('button.no')}
                          <input className='form-check-input m-0' type='checkbox' role='switch' id='flexSwitchCheckDefault' onChange={(e) => setAllowPaymentInAdvance(!allowPaymentInAdvance)} checked={allowPaymentInAdvance} />
                          {strings('button.yes')}
                        </div>
                      </div>
                    </div>
                    {(userType !== EUserType.FINANCIAL && allowPaymentInAdvance) && (
                      <div className='col-12 mb-3'>
                        <div className='form-group'>
                          <label className='form-label' htmlFor='first_name'>{strings('paymentPreferences.whoPayInvoicesReceived')}</label>
                          <div className='form-check form-switch ps-0 d-flex align-items-center justify-content-start gap-4'>
                            {strings('paymentPreferences.myCompany')}
                            <input className='form-check-input m-0' type='checkbox' role='switch' id='switchPayer' onChange={handleSwitch} checked={externalPayment} />
                            {strings('paymentPreferences.myCreditProviders')}
                          </div>
                        </div>
                      </div>)}
                    {(userType !== EUserType.FINANCIAL && !externalPayment) && (
                      (allowPaymentInAdvance) && (
                        <>
                          <div className='col-md-6 mb-3'>
                            <div className='form-group'>
                              <label className='form-label' htmlFor='max_percent'>{strings('invoiceActions.accept.dailyDiscount')}</label>
                              <div className='input-group input-group-inline'>
                                <input
                                  type='number'
                                  disabled={!allowPaymentInAdvance || externalPayment}
                                  className='form-control'
                                  id='max_percent'
                                  placeholder='0.00'
                                  aria-label='0.00'
                                  value={dailyDiscountToApply}
                                  min={0}
                                  max={100}
                                  step={1}
                                  onChange={async (e) => {
                                    setDailyDiscountToApply(parseFloat(e.target.value))
                                  }}
                                />
                                <span className='input-group-text'>%</span>
                              </div>
                            </div>
                          </div>
                        </>
                      )
                    )}

                    {(userType === EUserType.FINANCIAL) && (
                      (allowPaymentInAdvance) && (
                        <>
                          <div className='col-md-6 mb-3'>
                            <div className='form-group'>
                              <label className='form-label' htmlFor='max_percent'>{strings('invoiceActions.accept.dailyDiscount')}</label>
                              <div className='input-group input-group-inline'>
                                <input
                                  type='number'
                                  disabled={!allowPaymentInAdvance}
                                  className='form-control'
                                  id='max_percent'
                                  placeholder='0.00'
                                  aria-label='0.00'
                                  value={dailyDiscountToApply}
                                  min={0}
                                  max={100}
                                  step={1}
                                  onChange={async (e) => {
                                    setDailyDiscountToApply(parseFloat(e.target.value))
                                  }}
                                />
                                <span className='input-group-text'>%</span>
                              </div>
                            </div>
                          </div>
                          <div className='col-md-6 mb-3'>
                            <div className='form-group'>
                              <label className='form-label' htmlFor='max_percent'>{strings('invoiceActions.accept.interestArrears')}</label>
                              <div className='input-group input-group-inline'>
                                <input
                                  type='number'
                                  disabled={!allowPaymentInAdvance}
                                  className='form-control'
                                  id='max_percent'
                                  placeholder='0.00'
                                  aria-label='0.00'
                                  value={interestArrears}
                                  min={0}
                                  max={100}
                                  step={1}
                                  onChange={async (e) => {
                                    setInterestArrears(parseFloat(e.target.value))
                                  }}
                                />
                                <span className='input-group-text'>%</span>
                              </div>
                            </div>
                          </div>
                          <div className='col-md-6 mb-3'>
                            <div className='form-group'>
                              <label className='form-label' htmlFor='max_percent'>{strings('placeholder.creditLimit')}</label>
                              <div className='input-group input-group-inline'>
                                <input
                                  type='number'
                                  disabled={!allowPaymentInAdvance}
                                  className='form-control'
                                  id='max_percent'
                                  placeholder='0.00'
                                  aria-label='0.00'
                                  value={creditLimit}
                                  min={0}
                                  step={1}
                                  onChange={async (e) => {
                                    setCreditLimt(parseFloat(e.target.value))
                                  }}
                                />
                                <span className='input-group-text'>$</span>
                              </div>
                            </div>
                          </div>
                        </>
                      )
                    )}
                  </div>
                </form>
              </div>
            )}

            {showAutomatization && (
              (userType !== EUserType.FINANCIAL) && (
                <>
                  <div className='modal-body'>
                    <div className="container mt-5">
                      <div className="row">
                        <div className="col-md-12 border shadow border-2 rounded" style={styles.leftPanel}>
                          <h5 className='mt-2 ms-2'>{strings('placeholder.when')}</h5>                          <div className="d-flex align-items-center">
                            <select className="form-select form-select-sm ms-2 mt-2 mb-4" style={styles.selectLarge} disabled>
                              <option selected>{strings('placeholder.priceWithoutSymbol')}</option>                            </select>
                          </div>
                        </div>
                      </div>
                      <div className="row mt-5">
                        <div className="col-md-12 border shadow border-2 rounded" style={styles.leftPanel}>
                          <div className="d-flex align-items-center mt-2 mb-3">
                            <div className="me-3">
                              <label className="form-label">{strings('placeholder.operator')} *</label>
                              <select id="logicalOperator" value={automationsData.logicalOperator} onChange={(e) => { handleValueForm(e.target.id, e.target.value) }} className="form-select form-select-sm">
                                <option selected ></option>
                                <option value="&lt;">&lt;</option>
                                <option value="&lt;=">&lt;=</option>
                                <option value="&gt;=">&gt;=</option>
                                <option value="&gt;">&gt;</option>
                                <option value="=">=</option>
                              </select>
                            </div>

                            <div style={styles.width}>
                              <label className="form-label">{strings('placeholder.value')} *</label>
                              <input value={automationsData.value} onChange={(e) => { handleValueForm(e.target.id, e.target.value) }} type="number" id="value" className="form-control form-control-sm" />
                            </div>

                            <div className="me-3 ms-3">
                              <label className="form-label">{strings('placeholder.and')}</label>
                              <select disabled id="andOr" value={automationsData.andOr} onChange={(e) => { handleValueForm(e.target.id, e.target.value) }} className="form-select form-select-sm">
                                <option value="AND">AND</option>
                                <option value="AND">AND</option>
                                <option value="OR">OR</option>
                              </select>
                            </div>

                            <div className="me-3">
                              <label className="form-label">{strings('placeholder.operator')} </label>
                              <select id="secondLogicalOperator" value={automationsData.secondLogicalOperator} onChange={(e) => { handleValueForm(e.target.id, e.target.value) }} className="form-select form-select-sm">
                                <option selected ></option>
                                <option value="&lt;">&lt;</option>
                                <option value="&lt;=">&lt;=</option>
                                <option value="&gt;=">&gt;=</option>
                                <option value="&gt;">&gt;</option>
                                <option value="=">=</option>
                              </select>
                            </div>

                            <div style={styles.width}>
                              <label className="form-label">{strings('placeholder.secondValue')}</label>
                              <input value={automationsData.secondValue} onChange={(e) => { handleValueForm(e.target.id, e.target.value) }} type="number" id="secondValue" className="form-control form-control-sm" />
                            </div>

                          </div>
                        </div>
                      </div>
                      <div className="row mt-5">
                        <div className="col-md-12 border shadow border-2 rounded" style={styles.leftPanel}>
                          <h5 className='mt-2 ms-2'>{strings('placeholder.then')} *</h5>
                          <div className="d-flex align-items-center">
                            <p className='ms-2 mt-3 mb-3' style={styles.subtitle}>{strings('placeholder.status')}:</p>
                            <select id="status" value={automationsData.status} className="form-select form-select-sm ms-2 mt-3 mb-3" onChange={(e) => { handleValueForm(e.target.id, e.target.value) }} style={styles.selectWidth} >
                              <option value='' selected>{strings('placeholder.selectStatus')}</option>
                              {
                                status.map((st) =>
                                  <>
                                    <option key={st.key} value={st.key}>{st.value}</option>
                                  </>
                                )
                              }
                            </select>
                          </div>
                        </div>
                      </div>

                      {(Array.isArray(automationRules) && automationRules.length === 0) && (
                        <div className="row mt-5">
                          <div className="col-md-12 p-3 border shadow border-2 rounded" style={styles.leftPanel}>
                            <p>{strings('placeholder.noRulesCreated')}</p>
                          </div>
                        </div>
                      )}
                      {(Array.isArray(automationRules) && automationRules.length !== 0) && (
                        <div className="row mt-5">
                          <div className="col-md-12" style={{ maxHeight: '300px', overflowY: 'auto' }}>
                            <div className="row g-4">

                              {automationRules.map((rule, index) => (
                                <div className="col-md-12 col-lg-12" key={index}>
                                  <div className="card  h-100 w-100 shadow border-2 rounded">
                                    <div className="card-body position-relative">
                                      {/* <h5 className="card-title">{strings('placeholder.type')}: {rule.type}</h5> */}
                                      <h5 className="card-title">
                                        {rule.status !== InvoiceStatus.QUICKPAY_AVAILABLE && (
                                          <span className='badge badge-lg badge-dot'>
                                            <i className={getInvoiceStatusBadgeColor(rule.status) + ''} />
                                            <strong><span className='d-none d-lg-table-cell'>{strings(`invoiceStatus.${getInvoiceStatus(rule.status)}`)}</span></strong>
                                          </span>
                                        )}
                                        {rule.status === InvoiceStatus.QUICKPAY_AVAILABLE && (
                                          <span className='badge badge-lg badge-dot'>
                                            <i className='bg-success' />
                                            <strong><span className='d-none d-lg-table-cell'>{strings(`button.quickpayOffered`)}</span></strong>
                                          </span>
                                        )}
                                      </h5>

                                      <p className="card-text text-sm mb-1"><strong>{strings('placeholder.logicalOperator')}:</strong> {rule.logicalOperator}</p>
                                      <p className="card-text text-sm mb-1"><strong>{strings('placeholder.value')}:</strong> {rule.value}</p>
                                      {rule.andOr && <p className="card-text text-sm mb-1"><strong>{strings('placeholder.andOr')}:</strong> {rule.andOr}</p>}
                                      {rule.secondValue !== undefined && <p className="card-text text-sm mb-1"><strong>{strings('placeholder.secondValue')}:</strong> {rule.secondValue}</p>}
                                      {rule.secondLogicalOperator && <p className="card-text text-sm mb-1"><strong>{strings('placeholder.logicalOperator')}:</strong> {rule.secondLogicalOperator}</p>}
                                      <button
                                        className="btn btn-sm btn-danger mt-3 position-absolute bottom-0 end-0 m-2"
                                        onClick={(e) => { handleRemoveRule(e, index) }}
                                      >
                                        <i className='bi bi-trash' />
                                      </button>
                                      <div className="position-absolute top-0 end-0 p-2">
                                        <span className="badge bg-primary rounded-pill">{index + 1}</span>
                                      </div>
                                    </div>
                                  </div>
                                </div>
                              ))}
                            </div>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                </>
              )
            )}
            <div className='modal-footer justify-content-between d-flex py-2'>

              {showAutomatization && (
                <>
                  <div className='justify-content-start'>
                    <button
                      role='button'
                      className={'btn btn-sm btn-secondary'}
                      onClick={(e) => {
                        setShowAutomatization(false)
                      }}
                    >
                      {strings('button.cancel')}
                      <span className='ps-1'>
                        <i className="bi bi-x custom-x-icon"></i>
                      </span>
                    </button>
                  </div>
                  <div className='justify-content-end'>
                    <button
                      role='button'
                      className={'btn btn-sm btn-primary'}
                      disabled={!isValidData}
                      onClick={(e) => {
                        handleSaveRule()
                      }}
                    >
                      {strings('paymentPreferences.addNewRule')}
                      <span className='ps-1'>
                        <i className="bi bi-plus"></i>
                      </span>
                    </button>
                  </div>
                </>
              )}

              {!showAutomatization && (
                <>
                  <div className='justify-content-start'>
                    <button
                      role='button'
                      className={'btn btn-sm btn-warning'}
                      onClick={(e) => {
                        setShowAutomatization(true)
                      }}
                    >
                      {strings('paymentPreferences.automations')}
                      <span className='ps-2'>
                        <i className="bi bi-gear-fill" />
                      </span>
                    </button>
                  </div>
                  <div className='justify-content-end'>
                    <button
                      role='button'
                      disabled={userType === EUserType.FINANCIAL && (isNaN(creditLimit) || creditLimit <= 0)}
                      className={'btn btn-sm btn-primary'}
                      onClick={(e) => {
                        handleSavePaymentSettings()
                      }}
                    >
                      {strings('button.proceed')}
                      <span className='ps-2'>
                        <i className='bi bi-arrow-right-circle-fill' />
                      </span>
                    </button>
                  </div>
                </>
              )}

            </div>
          </div>
        </div>
      </div>
    </>
  )
}
