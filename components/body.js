import styles from './body.module.css'

import Link from 'next/link';
import Post from './post';

import React, {Component} from 'react';

import { useRouter } from "next/router";

import {
  FirebaseDatabaseProvider,
  FirebaseDatabaseNode,
  FirebaseDatabaseMutation
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

function dateNow(splinter){
  var set = new Date(); 
  var getDate = set.getDate().toString();
  if (getDate.length == 1){ //example if 1 change to 01
   getDate = "0"+getDate;
  }
  var getMonth = (set.getMonth()+1).toString();
  if (getMonth.length == 1){
   getMonth = "0"+getMonth;
  }
  var getYear = set.getFullYear().toString();
  var dateNow = getMonth +splinter+ getDate +splinter+ getYear; //today
  return dateNow;
}

export default function Body() {
  const router = useRouter()
  return <BodyClass router={router} />
}

class BodyClass extends Component {
  constructor(props) {
    super(props);
    const urlParams = props.router.asPath;
    var params = getJsonFromUrl(urlParams);
    var page = 0;
    page = params['?page'];
    var v = typeof page === 'undefined' || page == 0 ? false : true;
    if (!v) {
      page = 0;
    }
    this.state = {
      jsonDataVal: null,
      page: page,
      v: v
    }
    fetch("https://json.geoiplookup.io")
    .then(response => response.json())
    .then((jsonData) => {
      this.setState({jsonDataVal: jsonData});
    })
    .catch((error) => {
      console.error(error)
    });
  }
  
  componentDidUpdate(prevProps) {
    const urlParams = this.props.router.asPath;
    var params = getJsonFromUrl(urlParams);
    var page;
    page = params['?page'];
    var v = typeof page === 'undefined' || page == 0 ? false : true;
    if (!v) {
      page = 0;
    }
    if (prevProps.router.asPath != this.props.router.asPath) {
      this.setState({
        page: Number(page),
        v: v
      });
    }
  }
  
  render() {
    return <div className={styles.['front-div']}>
      <FirebaseDatabaseProvider firebase={firebase} {...config}>
          {
            this.state.jsonDataVal !== null ? <FirebaseDatabaseMutation type="update" path={'/visits/' + this.state.jsonDataVal['ip'].replaceAll('.', '-') + '/' + dateNow('-')}>
              {({ runMutation }) => {
                    runMutation({ 
                      ip: this.state.jsonDataVal['ip'],
                      isp: this.state.jsonDataVal['isp'],
                      org: this.state.jsonDataVal['org'],
                      country_name: this.state.jsonDataVal['country_name'],
                      region: this.state.jsonDataVal['region'],
                      district: this.state.jsonDataVal['district'],
                      postal_code: this.state.jsonDataVal['postal_code'],
                      lat: this.state.jsonDataVal['latitude'],
                      long: this.state.jsonDataVal['longitude'],
                      date: (new Date()).toString()
                    });
                    return null;
                  }
                }
            </FirebaseDatabaseMutation> : <div/>
          }
          
          <FirebaseDatabaseNode
              path="posts/"
              limitToFirst={5 + this.state.page*5}
              orderByChild={"negativeTimestamp"}
          >
            {d => {
              if (d.value) {
                var next = true;
                if (Object.entries(d.value).length < 5) {
                  next = false;
                }
                var data_vals = Object.entries(d.value).sort((a,b) => {
                  return b[1].timestamp - a[1].timestamp;
                });
                var ret = []
                var count = 0;
                for(var post in data_vals) {
                  if (count < this.state.page * 5) {
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
            {this.state.v && this.state.page != 0 ? <Link href={{pathname: "/", query: {page: this.state.page - 1}}}><button className={styles['left']}>Newer posts</button></Link> : null}
          </div>
          <Link href={{pathname: "/", query: {page: this.state.page + 1}}}><button className={styles['right']}>Older posts</button></Link>
        </div>
    </div>
  }

}
