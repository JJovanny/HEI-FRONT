export const Notification = ({ hasUnread }) => {
    return (
      <>
        {hasUnread !== 0 && (
          <div 
            style={{ 
              position: 'absolute',
              top: '0px', 
              right: '-20px', 
              width: '17px', 
              height: '17px', 
              backgroundColor: 'red', 
              borderRadius: '50%',
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
              color: 'white',
              fontSize: '14px', 
              padding: '11px'
            }}
          >
            {hasUnread}
          </div>
     )}
     </>
    )
  }
  