import React, { useEffect } from 'react'
import Link from 'next/link'
import { strings } from '../../src/resources/locales/i18n'
import { useDispatch, useSelector } from 'src/redux/hooks'
import Routing from '../../src/routing'
import { InvoicesReceivedMetricsIsPayer } from './InvoicesReceivedMetricsPayer'
import { InvoicesReceivedMetricsIsFinancial } from './InvoicesReceivedMetricsFinancial'


export const InvoicesReceivedMetrics = () => {
    return (
      <>
        <InvoicesReceivedMetricsIsPayer />
        <InvoicesReceivedMetricsIsFinancial/>
      </>
    )
}
