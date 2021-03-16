import Head from 'next/head'
import Link from 'next/link'
import Header from '../components/header'

export default function Home() {
  return (
    <div className="container">
      <Head>
        <title>Blog</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <main>
        <Header/>
      </main>
    </div>
  )
}
