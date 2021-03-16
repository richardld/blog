import Head from 'next/head'
import Link from 'next/link'
import Header from '../components/header'
import Body from '../components/body'
import Footer from '../components/footer'


export default function Home() {
  return (
    <div className="container">
      <Head>
        <title>Blog</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <main>
        <Header/>
        <Body/>
      </main>
    </div>
  )
}
