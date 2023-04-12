import { Html, Head, Main, NextScript } from 'next/document'
import Header from './head'

export default function Document() {
  return (
    <Html lang="en">
      <Header />
      <Head />
      <body>
        <Main />
        <NextScript />
      </body>
    </Html>
  )
}
