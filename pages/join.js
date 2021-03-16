import Head from 'next/head'
import Link from 'next/link'
import Header from '../components/header'

export default function Home() {
  return (
    <div className="container">
      <Head>
        <title>RL@Berkeley</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <main>
        <Header/>
        <p>Interested in Rocket League Club?</p>
        <p>Join our discord!</p>
      </main>
    </div>
  )
}
