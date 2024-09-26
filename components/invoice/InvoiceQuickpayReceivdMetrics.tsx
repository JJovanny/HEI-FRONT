import React from 'react'
import { InvoicesQuickpayReceivedMetricsIsPayer } from './InvoicesQuickpayReceivedMetricsPayer'
import { InvoicesQuickpayReceivedMetricsIsFinancial } from './InvoicesQuickpayReceivedMetricsFinancial'


export const InvoiceQuickpayReceivdMetrics = () => {
    return (
      <>
        <InvoicesQuickpayReceivedMetricsIsPayer />
        <InvoicesQuickpayReceivedMetricsIsFinancial />
      </>
    )
}
