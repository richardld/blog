import styles from './footer.module.css'

import Link from 'next/link'

export default function Footer({}) {
  return (
    <div className={styles.footer}>
      <div className={styles.links}>
        <a href="https://google.com" className={styles.link}>Google</a>
        <a href="https://bing.com" className={styles.link}>Bing</a>
      </div>
      <p>All views expressed on this site are the own of the authors and do not represent the opinions of any other.</p>
    </div>);
}
