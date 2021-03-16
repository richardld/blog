import styles from './postpage.module.css'

import Link from 'next/link'
import Post from './post'
import Comment from './comment'

import ReactHtmlParser from 'react-html-parser'; 

import {
  FirebaseDatabaseProvider,
  FirebaseDatabaseNode,
  FirebaseDatabaseMutation
} from "@react-firebase/database";
import firebase from "firebase/app";
import "firebase/database";

import { useRouter } from "next/router";

const config = {
    apiKey: "AIzaSyCc-95DkioDpeQbqRMGIRmo5zilUPXPt4I",
    authDomain: "blog-be17b.firebaseapp.com",
    projectId: "blog-be17b",
    storageBucket: "blog-be17b.appspot.com",
    messagingSenderId: "453331594806",
    appId: "1:453331594806:web:958b3284bbb70593be7297"
};

export default function PostPage(id) {
  const urlParams = useRouter().asPath;
  var id = urlParams.substring(10);
  for (var i = 0; i < 30; i++) {
    id = id.replace("+", " ");
  }
  return (
    <div className={styles.['front-div']}>
      <FirebaseDatabaseProvider firebase={firebase} {...config}>
          <FirebaseDatabaseNode
              path={"posts/" + id}
          >
            {d => {
              if (d.value) {
                var data = d.value;
                return(
                <div>
                  <div className={styles.['post-div']}>
                    <Link href={urlParams}><a className={styles.link}><h1>{data['title']}</h1></a></Link>
                    <div className={styles.['post-div-details']}>
                      <p className={styles.['post-div-author']}>{data['author']}</p>
                      <p className={styles.['post-div-date']}>{data['date']}</p>
                    </div>
                    <div className={styles.['post-div-text']}>{ReactHtmlParser(data['text'].substring(1, data['text'].length - 1).trim())}</div>
                  </div>
                    <div className={styles['comments-div']}>
                      <p className={styles['comments-div-title']}>Comments:</p>
                      <FirebaseDatabaseMutation type="push" path={"posts/" + id + "/comments/"}>
                        {({ runMutation }) => {
                          var months = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
                          return (
                            <div className={styles['make-div']}>
                              <p className={styles['make-title']}>Make a comment:</p>
                              <input id="author" placeholder="Author name" className={styles['make-author']}/>
                              <input id="text" placeholder="Wow! What a nice post!" className={styles['make-text']}/>
                              <button className={styles['make-comment']} data-testid="comment"
                              onClick={async () => {
                                if (document.getElementById('author').value && document.getElementById('text').value) {
                                  const { key } = await runMutation({ 
                                    author: document.getElementById('author').value,
                                    date: months[(new Date()).getMonth()] + " " + (new Date()).getDate() + ", " + (new Date()).getFullYear(),
                                    timestamp: (new Date()).getTime(),
                                    negativeTimestamp: -(new Date()).getTime(),
                                    text: document.getElementById('text').value
                                  });
                                  document.getElementById('author').value = "";
                                  document.getElementById('text').value = ""
                                }
                              }}>Comment!</button>
                            </div>
                          );
                        }}
                      </FirebaseDatabaseMutation>
                      <FirebaseDatabaseNode
                          path={"posts/" + id + "/comments"}
                      >
                        {d => {
                            var ret = [];
                            console.log(d);
                            for (var c in d.value) {
                              ret.push(<Comment data={d.value[c]}/>)
                            }
                            return(ret);
                          }
                        }
                      </FirebaseDatabaseNode>

                    </div>
                </div>)
              }
              return null;
              
            }}
          </FirebaseDatabaseNode>
        </FirebaseDatabaseProvider>
    </div>
  );
}
