import Head from 'next/head'
import Link from 'next/link'
import Header from '../components/header'
import Editor from '../components/editor'
import Footer from '../components/footer'

export default function Edit() {
  return (
    <div className="container">
      <Head>
        <title>Post Editor</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <main>
        <Header/>
        <Editor/>
      </main>
    </div>
  )
}
