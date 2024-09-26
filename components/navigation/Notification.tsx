import { Notification } from 'components/chat/Notification';
import moment from 'moment';
import React, { useEffect, useState } from 'react';
import { getInvoiceStatusNotification, getInvoiceStatusNotificationColor } from 'src/api/utils';
import { apiGetClientInvoice } from 'src/client/ClientActions';
import { apiGetInvoice, setInvoiceDataProps } from 'src/invoice/InvoiceActions';
import { apiGetNotifications, apiPutNotification, apiPutNotifications } from 'src/notifications/notificationActions';
import { useDispatch, useSelector } from 'src/redux/hooks'
import { strings } from 'src/resources/locales/i18n';
import { EUserType, InvoiceStatus, NotificationStatus } from 'src/types/enums';

function NotificationBar() {
  const [showNotifications, setShowNotifications] = useState(false);
  const dispatch = useDispatch()
  const { notifications } = useSelector(state => state.NotificationReducer)
  const { dataUser: { companyBranchSelected, userType } } = useSelector(state => state.UserReducer) as any

  useEffect(() => {
    dispatch(apiGetNotifications())
  }, [companyBranchSelected])

  const handleShowInvoice = async (notificationId,invoiceId) => {
    await dispatch(apiGetInvoice(invoiceId))
    await dispatch(setInvoiceDataProps({ prop: 'invoiceIdToDelete', value: invoiceId }))
    await dispatch(apiPutNotification(notificationId))
    document.getElementById('modal-open-view-item')?.click()
  }

  const unreadNotifications = Array.isArray(notifications) && notifications.length > 0 ? notifications.filter(notification => !notification.read) : []

  const handleShowNotifications = async () => {
    setShowNotifications(!showNotifications)
    if (!showNotifications === true && unreadNotifications.length !== 0) await dispatch(apiPutNotifications())
  }

  const validNotification = (notificationStatus, invoice) => {

    let text = strings('notifications.'+getInvoiceStatusNotification(notificationStatus))
    let icon = getInvoiceStatusNotificationColor(notificationStatus) === 'bg-success' ? <i className='bi bi-check-circle text-success mb-3 me-4'/> : <i className='bi bi-clock-history text-warning mb-3 me-4'/>

    if (userType === EUserType.BOTH || userType === EUserType.SUPPLIER ) {
      if (
          notificationStatus === NotificationStatus.PAYER_ACCEPTS_INVOICE_WITH_QUICKPAY_OFFER &&
          invoice?.status === InvoiceStatus.QUICKPAY_AVAILABLE
        ) {
            icon = <i className='bi bi-clock-history text-warning mb-3 me-4'/>
          }
      }

    if (userType === EUserType.BOTH || userType === EUserType.PAYER ) {
      switch (notificationStatus) {
        case NotificationStatus.SUPPLIER_UPLOADS_INVOICE:
          if (invoice?.status === InvoiceStatus.QUICKPAY || invoice?.status ===InvoiceStatus.ADVANCED || invoice?.status ===InvoiceStatus.PAID ) {
            icon = <i className='bi bi-check-circle text-success mb-3 me-4'/>
          }
          break;

        case NotificationStatus.SUPPLIER_ACCEPTS_QUICKPAY_OFFER:
            if (invoice?.status ===InvoiceStatus.QUICKPAY) {
              text = strings('notifications.timeToAdvanceIt')
              icon = <i className='bi bi-clock-history text-warning mb-3 me-4'/>
            }
            if (invoice?.status ===InvoiceStatus.ADVANCED || invoice?.status ===InvoiceStatus.PAID ) {
              icon = <i className='bi bi-check-circle text-success mb-3 me-4'/>
            }
          break;
      }
    }

    return {text, icon}
  }


  return (
    <div className='navbar-nav align-items-lg-center d-none d-lg-flex ms-lg-auto'>
    <button 
     style={{
        border: 'none',
      }}
     className='p-0 me-4 nav-link nav-link-icon position-relative cursor-pointer text-dark'
     onClick={(e) => handleShowNotifications()}
    >
        <Notification hasUnread={unreadNotifications.length}/>
        <i className='bi bi-bell h3 text-white me-1' />
        {showNotifications && (
          <div
            style={{
              position: 'absolute',
              top: '100%',
              right: '0',
              backgroundColor: '#fff',
              border: '1px solid #ccc',
              borderTop: 'none',
              width: '290px', 
              maxHeight: '200px',
              overflowY: 'auto',
              marginTop: '10%',
              textAlign: 'start'
            }}
            className='rounded'
          > 
            {Array.isArray(notifications) && notifications.length > 0 ? (
                notifications.map((notification, index) => (
                    <div key={index} style={{ padding: '15px', borderBottom: '1px solid #ccc', width: '100%' }} className='badge-dot'
                        onClick={(e) => {handleShowInvoice(notification?.id, notification.invoice?.id)}}
                    >
                        {validNotification(notification.status, notification.invoice).icon}
                        <p style={notification.readIndividually ? {fontSize: '12px', color: '#68686881'} : {fontSize: '12px', color: 'black'}}>
                          {notification.invoice?.invoiceNumber} - {validNotification(notification.status, notification.invoice).text}</p>
                    </div>
                ))
            ) : (
                <p className='p-4 h6'>{strings('placeholder.noNotifications')}</p>
            )}
          </div>
        )}
      </button>
      

      
      {(userType === EUserType.FINANCIAL) && (
       <button
            type='button'
            id='modal-open-view-item'
            className='d-none'
            data-bs-target={'#modalViewAdvancePayment'}
            data-bs-toggle='modal'
          />
      )}

      {(userType === EUserType.PAYER || userType === EUserType.BOTH || userType === EUserType.SUPPLIER) && (
       <button
            type='button'
            id='modal-open-view-item'
            className='d-none'
            data-bs-target={'#modalViewItem'}
            data-bs-toggle='modal'
          />
      )}
    </div>
  );
}

export default NotificationBar;
