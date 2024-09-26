import { useEffect, useState } from 'react'
import { strings } from 'src/resources/locales/i18n'
import { useDispatch, useSelector } from 'src/redux/hooks'
import { IUserState } from 'src/types/user'
import { ISupplierState } from 'src/types/supplier'
import { EUserType } from 'src/types/enums'

type Props = {
  myPreferences: boolean
  setValues: (e?:any) => any,
}

export const PaymentPreferences = (props: Props) => {
  const dispatch = useDispatch()
  const { myPreferences, setValues } = props
  const { supplierPaymentPreferences } = useSelector((state) => state.SupplierReducer as ISupplierState)
  const { putDataUser: { paymentPreferences, externalPayment }, dataUser } = useSelector((state) => state.UserReducer as IUserState)
  const userType = dataUser?.userType

  const [allowPaymentInAdvance, setAllowPaymentInAdvance] = useState((myPreferences ? paymentPreferences?.allowPaymentInAdvance : supplierPaymentPreferences?.allowPaymentInAdvance) || false)
  const [dailyDiscountToApply, setDailyDiscountToApply] = useState(myPreferences ? paymentPreferences?.dailyDiscountToApply : 0)

  useEffect(() => {
    if (Number.isNaN(dailyDiscountToApply) || dailyDiscountToApply === undefined) {
      setDailyDiscountToApply(0)
    }
  },[dailyDiscountToApply])

  useEffect(() => {
   if (userType === EUserType.FINANCIAL) {
    dispatch(setValues({ prop: 'externalPayment', value: true }))
   }
  },[paymentPreferences])

  useEffect(() => {
    if (userType === EUserType.FINANCIAL && externalPayment) {
     dispatch(setValues({ prop: 'paymentPreferences', value: { ...paymentPreferences, externalPayment: true } }))
    }
   },[dailyDiscountToApply])

  return (
    <>

      <div className='row align-items-start mb-2 mb-xl-4 mb-xxl-8' id='config'>
        <div className='col-lg-4 col-xxl-3 mb-5 mb-lg-0'>
          <h4 className='mb-2'>{strings('paymentPreferences.title')}</h4>
        </div>
        <div className='col-lg-8 offset-xxl-1 d-flex flex-column gap-5'>
          <div className='row g-5'>
            <div className='col-12 mb-3'>
              <div className='form-group'>
                {userType !== EUserType.FINANCIAL && (
                  <>
                    <label className='form-label' htmlFor='first_name'>{myPreferences ? strings('paymentPreferences.myTitle') : strings('paymentPreferences.supplierTitle')}</label>
                    <div className='form-check form-switch switch-dual ps-0 d-flex align-items-center justify-content-start gap-4'>
                      {myPreferences ? strings('paymentPreferences.myCompany') : strings('button.no')}
                      {!myPreferences
                        ? <input
                            className='form-check-input m-0'
                            type='checkbox'
                            role='switch'
                            id='flexSwitchCheckDefault'
                            name='allowPaymentInAdvance'
                            onChange={(e) => {
                              setAllowPaymentInAdvance(!allowPaymentInAdvance)
                              dispatch(setValues({ prop: e.target.name, value: !allowPaymentInAdvance }))
                            }}
                            checked={allowPaymentInAdvance}
                          />
                      : <input
                          className='form-check-input m-0'
                          type='checkbox'
                          role='switch'
                          id='externalPayment'
                          name='externalPayment'
                          onChange={(e) => {
                            dispatch(setValues({ prop: e.target.name, value: !externalPayment }))
                          }}
                          checked={externalPayment}
                        />}
                      {myPreferences ? strings('paymentPreferences.myCreditProviders') : strings('button.yes')}
                    </div>
                </>
                )}

                {myPreferences &&
                  <div className='mt-5'>
                    <div className='form-check checkbox-xl mb-0'>
                      <input
                        className='form-check-input'
                        type='checkbox'
                        id='allowPaymentInAdvance'
                        name='allowPaymentInAdvance'
                        onChange={(e) => {
                          setAllowPaymentInAdvance(!allowPaymentInAdvance)
                          dispatch(setValues({ prop: 'paymentPreferences', value: { ...paymentPreferences, allowPaymentInAdvance: !allowPaymentInAdvance } }))
                          if (allowPaymentInAdvance) {
                            dispatch(setValues({ prop: 'paymentPreferences', value: { allowPaymentInAdvance: !allowPaymentInAdvance, days: 0, discountInAdvance: 0 } }))
                          }
                        }}
                        checked={allowPaymentInAdvance}
                        style={{ width: '20px', height: '20px' }}
                      />
                      <label
                        className='form-check-label'
                        htmlFor='allowPaymentInAdvance'
                        style={{ marginLeft: '10px' }}
                      >{strings('paymentPreferences.allowPaymentInAdvance')}
                      </label>
                    </div>
                  </div>}
              </div>
            </div>
            <div className='col-md-6 col-lg-4 mb-3'>
              <div className='form-group'>
                <label className='form-label' htmlFor='max_percent'>{strings('invoiceActions.accept.dailyDiscount')}</label>
                <div className='input-group input-group-inline'>
                  <input
                    type='number'
                    className='form-control'
                    id='max_percent'
                    name='dailyDiscountToApply'
                    placeholder='0.00'
                    aria-label='0.00'
                    value={!myPreferences ? dailyDiscountToApply : !allowPaymentInAdvance ? 0 : dailyDiscountToApply}
                    min={0}
                    max={100}
                    step={1}
                    disabled={myPreferences && !allowPaymentInAdvance}
                    onBlur={async (e) => {
                      if (myPreferences) {
                        dispatch(setValues({ prop: 'paymentPreferences', value: { ...paymentPreferences, dailyDiscountToApply } }))
                      } else {
                        dispatch(setValues({ prop: e.target.name, value: dailyDiscountToApply }))
                      }
                    }}
                    onChange={async (e) => {
                      setDailyDiscountToApply(parseFloat(e.target.value))
                    }}
                  />
                  <span className='input-group-text'>%</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

    </>
  )
}
