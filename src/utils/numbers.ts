import { EUserType, InvoiceStatus } from "src/types/enums";
import { discountCalculation } from "src/validations/numbers";
import { expirationDateWithCurrentDate, getDaysExpired } from "./dates";
import moment from "moment";
import { AutomationRules } from "src/types/client";

export const formatUSD = (amount) => {
    if (amount === undefined || amount === null) return 0
    amount = parseFloat(amount);
    
    if (isNaN(amount)) {
        return 0;
    }
    
    const formatter = new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: 'USD'
    });
    
    return formatter.format(amount);
}

export const formatPrice = (amount, symbol) => {
    if (symbol === '$' && amount) {
        return String(amount).replace('.', ',')
    }

    if (symbol === '€' && amount) {
        return String(amount).replace(',', '.')
    }
}

export const getInvoiceValueCalculations = (invoice: any, ignore = false) => {
    const externalPayment = invoice?.paymentPreferences &&
    invoice?.paymentPreferences.externalPayment !== undefined ? invoice?.paymentPreferences.externalPayment: false

    const country = invoice?.customer && invoice?.customer?.country ?  invoice?.customer?.country?.code : ''
    const isNotAccepted = ignore ? false : (invoice.status === InvoiceStatus.QUICKPAY_AVAILABLE || (expirationDateWithCurrentDate(invoice?.dueDate) && !externalPayment && invoice?.status === InvoiceStatus.QUICKPAY))
    const dailyDiscountToApply = isNotAccepted ? 0 : invoice?.paymentPreferences?.dailyDiscountToApply || 0
    const totalTaxesValidate: number = (invoice.totalTaxes ? invoice.totalTaxes : 0)
    const totalWhittTaxes: number = (invoice.grandTotal - totalTaxesValidate)
    
    const total: number = discountCalculation(totalWhittTaxes, dailyDiscountToApply, invoice?.dueDate,country, invoice?.invoiceDatePaidOrAdvanced)
 
    const totalToPay: number = totalWhittTaxes - total
    const advanceTotal: number = isNaN(totalToPay) ? 0 : parseFloat(totalToPay.toFixed(2));
    let calculate: number = isNaN(totalWhittTaxes) || isNaN(advanceTotal) ? 0 : (totalWhittTaxes - advanceTotal);

    calculate = (invoice?.acceptedWhenExpired && calculate < 0) ? 0 : calculate

    const totalWhitDiscount = invoice.subtotal - calculate
    const subtotal: number = totalWhittTaxes + totalTaxesValidate

        
    let taxes = 0
    invoice?.lines.forEach(line => {
        taxes += (((line?.amount * 1)/totalWhittTaxes) * (totalWhitDiscount) * ((line?.tax?.percentage || 0)/100))
    });

    const totalTaxes = advanceTotal + taxes


    return {totalTaxes, taxes, advanceTotal, subtotal, totalTaxesValidate, totalToPay, totalWhittTaxes, calculate, totalWhitDiscount}
}

export const getInterestArrearsCalculation = (invoice: any, paymentPreferencesExternal: any, totalTaxes: number, userType: string) => {
    const isExternal = invoice?.paymentPreferences ? invoice?.paymentPreferences?.externalPayment : false
    const country = invoice?.customer && invoice?.customer?.country && typeof invoice?.customer?.country !== 'string' ? invoice?.customer?.country?.code : ''
    const remainingDaysWhenIsOverdue = getDaysExpired(invoice?.dueDate,country, (invoice?.invoiceDatePaidOrAdvanced ? moment.utc(invoice?.invoiceDatePaidOrAdvanced).format('YYYY-MM-DD') : undefined)) 
    const interestArrears = paymentPreferencesExternal && paymentPreferencesExternal?.interestArrears !== undefined ? paymentPreferencesExternal?.interestArrears : 0.005
    const interestArrearsCalculation = remainingDaysWhenIsOverdue * (interestArrears / 100) * totalTaxes
    const totalInterestArrearsCalculation = interestArrearsCalculation + totalTaxes
    const isUserPayerOrFinancialAndExternal = isExternal && invoice?.status === InvoiceStatus.OVERDUE && (userType === EUserType.PAYER || userType === EUserType.BOTH || userType === EUserType.FINANCIAL)

    return  {interestArrearsCalculation, totalInterestArrearsCalculation, isUserPayerOrFinancialAndExternal}
}

export const validateSimilarityValueAndOperator = (existingRule: AutomationRules, newRule: AutomationRules) => {

    const { logicalOperator, value, secondValue, secondLogicalOperator } = newRule;

    const {
        logicalOperator: existingLogicalOperator,
        value: existingValue,
        secondValue: existingSecondValue,
        secondLogicalOperator: existingSecondLogicalOperator
      } = existingRule;


      const parseExistingValue = Number(existingValue);
      const parseExistingSecondValue = Number(existingSecondValue);

      const parseValue = Number(value);
      const parseSecondValue = Number(secondValue);

      if (
        (existingLogicalOperator === '>' && logicalOperator === '>=' && parseExistingValue === parseValue) || 
        (existingLogicalOperator === '>=' && logicalOperator === '>' && parseExistingValue === parseValue) || 
        (existingLogicalOperator === '<' && logicalOperator === '<=' && parseExistingValue === parseValue) || 
        (existingLogicalOperator === '<=' && logicalOperator === '<' && parseExistingValue === parseValue) || 
        (existingLogicalOperator === logicalOperator && parseExistingValue === parseValue) ||
        (secondValue && existingSecondValue && (
          (existingSecondLogicalOperator === secondLogicalOperator && parseExistingSecondValue === parseSecondValue) ||
          ((existingLogicalOperator === logicalOperator && parseExistingValue === parseValue) && existingSecondLogicalOperator === secondLogicalOperator && parseExistingSecondValue === parseSecondValue)) ||
          (existingSecondLogicalOperator === '>' && secondLogicalOperator === '>=' && parseExistingSecondValue === parseSecondValue) || 
          (existingSecondLogicalOperator === '>=' && secondLogicalOperator === '>' && parseExistingSecondValue === parseSecondValue) || 
          (existingSecondLogicalOperator === '<' && secondLogicalOperator === '<=' && parseExistingSecondValue === parseSecondValue) || 
          (existingSecondLogicalOperator === '<=' && secondLogicalOperator === '<' && parseExistingSecondValue === parseSecondValue) || 

          (existingLogicalOperator === secondLogicalOperator && parseExistingValue === parseSecondValue) ||

          (existingLogicalOperator === '>' && secondLogicalOperator === '>=' && parseExistingValue === parseSecondValue) || 
          (existingLogicalOperator === '>=' && secondLogicalOperator === '>' && parseExistingValue === parseSecondValue) || 
          (existingLogicalOperator === '<' && secondLogicalOperator === '<=' && parseExistingValue === parseSecondValue) || 
          (existingLogicalOperator === '<=' && secondLogicalOperator === '<' && parseExistingValue === parseSecondValue)
        )){
            return true
        }

        return false


}

export const validateRuleRange = (existingRule: AutomationRules, newRule: AutomationRules) => {

    const { logicalOperator, value, secondValue, secondLogicalOperator } = newRule;

    const {
        logicalOperator: existingLogicalOperator,
        value: existingValue,
        secondValue: existingSecondValue,
        secondLogicalOperator: existingSecondLogicalOperator
      } = existingRule;


      const parseExistingValue = Number(existingValue);
      const parseExistingSecondValue = Number(existingSecondValue);

      const parseValue = Number(value);
      const parseSecondValue = Number(secondValue);

      const isRange = (op1, op2) => op1 && op2;

      const existingIsRange = isRange(existingLogicalOperator, existingSecondLogicalOperator);
      const newIsRange = isRange(logicalOperator, secondLogicalOperator);


      if (!existingIsRange && !newIsRange) {
        if (
          (logicalOperator === '>' && parseValue <= parseExistingValue) ||
          (logicalOperator === '<' && parseValue >= parseExistingValue) ||
          (logicalOperator === '>=' && parseValue < parseExistingValue) ||
          (logicalOperator === '<=' && parseValue > parseExistingValue)
        ) {
            return true
        }
      } else if (!existingIsRange && newIsRange) {
        if (
          (logicalOperator === '>' && parseValue <= parseExistingSecondValue) ||
          (logicalOperator === '<' && parseValue >= parseExistingValue) ||
          (logicalOperator === '>=' && parseValue < parseExistingSecondValue) ||
          (logicalOperator === '<=' && parseValue > parseExistingValue)
        ) {
            return true
        }
      } else if (existingIsRange && !newIsRange) {
        if (
          (existingLogicalOperator === '>=' && parseValue <= parseExistingSecondValue) ||
          (existingLogicalOperator === '<=' && parseValue >= parseExistingValue) ||
          (existingLogicalOperator === '>' && parseValue < parseExistingSecondValue) ||
          (existingLogicalOperator === '<' && parseValue > parseExistingValue)
        ) {
            return true
        }
      } else if (existingIsRange && newIsRange) {
        if (
          parseExistingSecondValue !== null && parseSecondValue !== null &&
          (
            (parseValue < parseExistingSecondValue && parseSecondValue > parseExistingValue) ||
            (parseValue >= parseExistingValue && parseSecondValue <= parseExistingSecondValue)
          )
        ) {
            return true
        }
      }

      return false
}