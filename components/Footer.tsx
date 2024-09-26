import { strings } from 'src/resources/locales/i18n'

export const Footer = () => {
  const year = '2024'
  const appName = 'EHI - All rights reserved'
  return (
    <>
      <footer className='text-xs text-muted text-center mb-5'>
        <div className='w-full px-3'>
          {strings('global.footer', { year, appName })}
        </div>
      </footer>
    </>
  )
}
