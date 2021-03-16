import styles from './header.module.css'

import Link from 'next/link'

export default function Header({}) {
  return (
    <div className={styles.header}>
      <Link href="/"><a className={styles['header-title']}>Blog</a></Link>
      <div className={styles['right-div']}>
        <Link href="/about"><a className={styles['header-link']}>About</a></Link>
        <Link href="/about"><a className={styles['header-link']}>Contact</a></Link>
        <Link href="/about"><a className={styles['header-link']}>Link</a></Link>
        <Link href="/edit"><button className={styles['header-button']}>Write!</button></Link>
      </div>
    </div>);
}
