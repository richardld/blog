import { useState } from 'react';
import React from "react"
import dynamic from 'next/dynamic';
const ReactQuill = dynamic(() => import('react-quill'), { ssr: false });
import Modal from '@material-ui/core/Modal';
import Button from '@material-ui/core/Button';
import '../node_modules/react-quill/dist/quill.snow.css';
import styles from './editor.module.css'

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

class Editor extends React.Component {
    constructor(props) {
        super(props);
        this.state = { editorHtml: '' };
        this.handleChange = this.handleChange.bind(this);
    }

    handleChange(html) {
        this.setState({ editorHtml: html });
    }

    apiPostNewsImage() {
        // API post, returns image location as string e.g. 'http://www.example.com/images/foo.png'
    }
    
    toHTML() {
      var s = JSON.stringify(this.state.editorHtml)
      var s2 = s
      for(var i = 0; i < 10000; i++) {
        s2 = s
        s = s.replace('\\"', '"');
        if (s2 == s) {
          break;
        }
      }
      return s
    }

    imageHandler() {
        const input = document.createElement('input');

        input.setAttribute('type', 'file');
        input.setAttribute('accept', 'image/*');
        input.click();

        input.onchange = async () => {
            const file = input.files[0];
            const formData = new FormData();

            formData.append('image', file);

            // Save current cursor state
            const range = this.quill.getSelection(true);

            // Insert temporary loading placeholder image
            this.quill.insertEmbed(range.index, 'image', `${window.location.origin}/images/loaders/placeholder.gif`);

            // Move cursor to right side of image (easier to continue typing)
            this.quill.setSelection(range.index + 1);

            const res = await apiPostNewsImage(formData); // API post, returns image location as string e.g. 'http://www.example.com/images/foo.png'

            // Remove placeholder image
            this.quill.deleteText(range.index, 1);

            // Insert uploaded image
            // this.quill.insertEmbed(range.index, 'image', res.body.image);
            this.quill.insertEmbed(range.index, 'image', res);
        };
    }
    
    handleChangeTitle(event) {
      this.setState({title: event.target.value});
    }
    
    handleChangeAuthor(event) {
      this.setState({author: event.target.value});
    }

    render() {
      console.log(this.toHTML());
        var path="/posts";
        var months = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
        return (
            <div className={styles['text-editor']}>
                <input value={this.state.title} onChange={this.handleChangeTitle.bind(this)} type="text" className={styles['post-title']} placeholder="Post Title"></input>
                <input value={this.state.author} onChange={this.handleChangeAuthor.bind(this)} type="text" className={styles['post-author']} placeholder="Post Author"></input>
                <ReactQuill
                    ref={el => {
                        this.quill = el;
                    }}
                    onChange={this.handleChange}
                    placeholder={this.props.placeholder}
                    modules={{
                        toolbar: {
                            container: [
                                [{ header: '1' }, { header: '2' }, { header: [3, 4, 5, 6] }, { font: [] }],
                                [{ size: [] }],
                                ['bold', 'italic', 'underline', 'strike', 'blockquote'],
                                [{ list: 'ordered' }, { list: 'bullet' }],
                                ['link', 'video'],
                                ['link', 'image', 'video'],
                                ['clean'],
                                ['code-block']
                            ],
                            handlers: {
                                image: this.imageHandler
                            }
                        }
                    }}
                />
                <div className={styles['button-div']}>
                  <div className={styles['button-div-horizontal']}>
                    <FirebaseDatabaseProvider firebase={firebase} {...config}>
                      <FirebaseDatabaseMutation type="update" path={path + '/' + this.state.title + " " + (new Date()).getTime() % 100 }>
                        {({ runMutation }) => {
                          return (
                            <div>
                              <button className={styles['button-grey']}>Preview</button>
                              <button className={styles['button-yellow']} data-testid="update"
                              onClick={async () => {
                                if (this.state.title && this.state.author && this.toHTML()) {
                                  const { key } = await runMutation({ 
                                    title: this.state.title,
                                    author: this.state.author,
                                    date: months[(new Date()).getMonth()] + " " + (new Date()).getDate() + ", " + (new Date()).getFullYear(),
                                    timestamp: (new Date()).getTime(),
                                    negativeTimestamp: -(new Date()).getTime(),
                                    text: this.toHTML(),
                                    comments: "none"
                                  });
                                }
                              }}>Publish!</button>
                            </div>
                          );
                        }}
                      </FirebaseDatabaseMutation>
                    </FirebaseDatabaseProvider>
                  </div>
                </div>
              </div>
        );
    }
}

export default Editor;
