import styles from './comment.module.css'

import Link from 'next/link'
import ReactHtmlParser from 'react-html-parser'; 

export default function Comment(props) {
  var data = props.data;
  return (
        <div className={styles['comment-div']}>
          <div className={styles['comment-details']}>
            <p className={styles['comment-author']}>{data.author}</p>
            <p className={styles['comment-date']}>{data.date}</p>
          </div>
          <p className={styles['comment-text']}>{data.text}</p>
        </div>
      );
  }