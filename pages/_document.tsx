import Document, { Html, Main, NextScript, Head } from 'next/document'

class MyDocument extends Document {
  render () {
    return (
      <Html>
        <Head>
          <link rel='shortcut icon' href='/favicon.svg' />
          <link href='https://unpkg.com/@webpixels/css@1.2.3/dist/index.css' rel='stylesheet' />
          <link rel='stylesheet' href='https://cdn.jsdelivr.net/npm/bootstrap-icons@1.10.5/font/bootstrap-icons.css' />
        </Head>
        <body className='bg-surface-secondary'>
          <Main />
          <NextScript />
        </body>
      </Html>
    )
  }
}

export default MyDocument
