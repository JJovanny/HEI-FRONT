import moment from 'moment'
import { IInvoice } from 'src/types/invoice'
import { getRemainingDays } from 'src/utils/dates'

const discountCalculation = (grandTotal: number, dailyDiscountToApply: number, date: any, country: string, comparisonDate?: string | undefined) => {
  grandTotal = isNaN(grandTotal) ? 0 : grandTotal
  dailyDiscountToApply = isNaN(dailyDiscountToApply) ? 0 : dailyDiscountToApply
  let remainingDays: number = getRemainingDays(date, country, (comparisonDate ? moment.utc(comparisonDate).format('YYYY-MM-DD') : undefined))
  remainingDays = isNaN(remainingDays) ? 0 : remainingDays
  const discount: number = grandTotal * (dailyDiscountToApply / 100) * remainingDays
  const roundedDiscount: number = discount
  return roundedDiscount
}
 
export {
  discountCalculation
}
