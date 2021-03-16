import styles from './body.module.css'

import Link from 'next/link'
import Post from './post'

import { useRouter } from "next/router";

import {
  FirebaseDatabaseProvider,
  FirebaseDatabaseNode
} from "@react-firebase/database";
import firebase from "firebase/app";
import "firebase/database";

const config = {
    apiKey: "AIzaSyCc-95DkioDpeQbqRMGIRmo5zilUPXPt4I",
    authDomain: "blog-be17b.firebaseapp.com",
    projectId: "blog-be17b",
    storageBucket: "blog-be17b.appspot.com",
    messagingSenderId: "453331594806",
    appId: "1:453331594806:web:958b3284bbb70593be7297"
};

function getJsonFromUrl(url) {
  if(!url) url = location.search;
  var query = url.substr(1);
  var result = {};
  query.split("&").forEach(function(part) {
    var item = part.split("=");
    result[item[0]] = decodeURIComponent(item[1]);
  });
  return result;
}

export default function Body({}) {
  const urlParams = useRouter().asPath;
  var id = getJsonFromUrl(urlParams)
  var page = id['?page'];
  var v = typeof page === 'undefined'? false : true;
  if (!v) {
    page = 0;
  }
  console.log(v);
  return (
    <div className={styles.['front-div']}>
      <FirebaseDatabaseProvider firebase={firebase} {...config}>
          <FirebaseDatabaseNode
              path="posts/"
              limitToFirst={5 + page*5}
              orderByChild={"negativeTimestamp"}
          >
            {d => {
              if (d.value) {
                console.log(Object.entries(d.value));
                var data_vals = Object.entries(d.value).sort((a,b) => {
                  return b[1].timestamp - a[1].timestamp;
                });
                var ret = []
                var count = 0;
                for(var post in data_vals) {
                  if (count < page * 5) {
                    count += 1;
                  } else {
                    ret.push(<Post data={data_vals[post][1]} id={data_vals[post][0].replaceAll("+", " ")}></Post>)
                  }
                }
                return ret;
              }
              return null;
              
            }}
          </FirebaseDatabaseNode>
        </FirebaseDatabaseProvider>
        <div className={styles['button-div']}>
          <div>
            {v && page != 0 ? <Link href={{pathname: "/", query: {page: Number(page) - 1}}}><button className={styles['left']}>Newer posts</button></Link> : null}
          </div>
          <Link href={{pathname: "/", query: {page: Number(page) + 1}}}><button className={styles['right']}>Older posts</button></Link>
        </div>
    </div>
  );
}
