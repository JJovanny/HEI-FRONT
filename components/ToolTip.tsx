import React, { useState } from 'react';

function Tooltip({ text }) {
  const [showTooltip, setShowTooltip] = useState(false);

  return (
    <div
      style={{ position: 'relative', display: 'inline-block' }}
      onMouseEnter={() => setShowTooltip(true)}
      onMouseLeave={() => setShowTooltip(false)}
    >
     <i className='bi bi-question-circle-fill h4 cursor-pointer' />  
      {showTooltip && (
          <div
          style={{
            visibility: 'visible',
            textAlign: 'start',
            padding: '5px',
            zIndex: '1',
            bottom: '125%',
            right: '100%',
            position: 'absolute',
            minWidth: '470px',
            maxWidth: '470px',
            boxShadow: '0 2px 5px rgba(0,0,0,0.2)', 
            whiteSpace: 'pre-wrap', 
            wordWrap: 'break-word',
            display: 'inline-block',
          }}
        >
        <p className='rounded' style={{ color: 'white', position: 'absolute',padding: '4%',  margin: '0', backgroundColor: '#4f4e4eca'}}>
          {text}
        </p>        
        </div>
      )}
    </div>
  );
}

export default Tooltip;
