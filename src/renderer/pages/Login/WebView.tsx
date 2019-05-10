import * as path from 'path';
import React, { Component, useEffect, useRef, useState } from 'react';
import { Spin } from 'antd';

const TARGET_URL = 'www.ximalaya.com/passport/sync_set';
const COOKIE_URL = 'https://www.ximalaya.com';
const WebView = ({ onLoadedSession }) => {
  const [isLoading, setLoading] = useState(true);
  useEffect(() => {
    const webview = document.querySelector('#xmlyWebView') as HTMLElement;
    const handleDOMReady = (e) => {
      if (webview.getURL().includes(TARGET_URL)) {
        // todo fix prevent redirect
        e.preventDefault();
        const { session } = webview.getWebContents();
        onLoadedSession(session, COOKIE_URL);
        webview.reload();
      }
    };
    const handleLoadCommit = () => {
      setLoading(true);
    };
    const handleDidFinishLoad = () => {
      setLoading(false);
    };
    webview.addEventListener('dom-ready', handleDOMReady);
    webview.addEventListener('load-commit', handleLoadCommit);
    webview.addEventListener('did-finish-load', handleDidFinishLoad);
    return () => {
      webview.removeEventListener('dom-ready', handleDOMReady);
      webview.removeEventListener('load-commit', handleLoadCommit);
      webview.removeEventListener('did-finish-load', handleDidFinishLoad);
    };
  }, []);

  const props = {
    id: 'xmlyWebView',
    useragent:
      // tslint:disable-next-line:max-line-length
      'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_13_5) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/73.0.3683.103 Safari/537.36',
    src: `https://${TARGET_URL}`,
    style: { widht: '750px', height: '600px' },
  };
  return (
    <div>
      <Spin tip='Loading...' spinning={isLoading}>
        <webview {...props} />
      </Spin>
    </div>
  );
};

export default WebView;
