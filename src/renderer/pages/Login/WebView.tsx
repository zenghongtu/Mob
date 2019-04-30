import * as path from 'path';
import React, { Component, useEffect, useRef } from 'react';

const TARGET_URL = 'www.ximalaya.com/passport/sync_set';
const COOKIE_URL = 'https://www.ximalaya.com';
const WebView = ({ onLoadedSession }) => {
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
    webview.addEventListener('dom-ready', handleDOMReady);
    return () => {
      webview.removeEventListener('dom-ready', handleDOMReady);
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
      <webview {...props} />
    </div>
  );
};

export default WebView;
