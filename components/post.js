import styles from './post.module.css'

import Link from 'next/link'
import ReactHtmlParser from 'react-html-parser'; 

export default function Post(props) {
  var data = props.data;
  return (
      <div className={styles.['post-div']}>
        <Link href={{pathname: "/posts", query: {id: props.id}}}><a className={styles.link}><h1>{data['title']}</h1></a></Link>
        <div className={styles.['post-div-details']}>
          <p className={styles.['post-div-author']}>{data['author']}</p>
          <p className={styles.['post-div-date']}>{data['date']}</p>
        </div>
        <div className={styles.['post-div-text']}>
          {ReactHtmlParser(data['text'].substring(1, data['text'].length - 1).trim())}
        </div>
        <Link href={{pathname: "/posts", query: {id: props.id}}}><a className={styles.link}><p className={styles['read-text']}>Read more</p></a></Link>
      </div>
      );
  }

