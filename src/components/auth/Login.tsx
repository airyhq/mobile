import React, {createRef, useState} from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  NativeSyntheticEvent,
  TextInput,
  Modal,
} from 'react-native';

import AiryLogo from '../../assets/images/logo/airy_primary_rgb.svg';
import {
  colorAiryBlue,
  colorBackgroundBlue,
  colorStateRed,
} from '../../assets/colors';
import WebView from 'react-native-webview';
import {
  WebViewMessage,
  WebViewNavigation,
} from 'react-native-webview/lib/WebViewTypes';
import {RealmDB} from '../../storage/realm';

const getAuthUrl = domain => `${getHost(domain)}/oauth2/authorization/auth0`;
const getHost = domain => `https://${domain}`;

const tokenCookie = 'airy_auth_token';
const getAuthToken = cookieString => {
  const value = `; ${cookieString}`;
  const parts = value.split(`; ${tokenCookie}=`);
  if (parts.length === 2) {
    return parts.pop().split(';').shift();
  }
};

const sendCookieScript = `(function(){
  if(window.ReactNativeWebView) {
    window.ReactNativeWebView.postMessage("Cookie:" + document.cookie);
  }
  return true;
})()`;

const logoutHtml = `
<!doctype html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport"
          content="width=device-width, user-scalable=no, initial-scale=1.0, maximum-scale=1.0, minimum-scale=1.0">
    <meta http-equiv="X-UA-Compatible" content="ie=edge">
    <title>Successful login</title>
</head>
<body>
You are being redirected.
</body>
</html>
`;

export const Login = () => {
  let webViewRef = createRef<WebView>();
  let [domain, setDomain] = useState('');
  let [domainInput, setDomainInput] = useState('');
  let [showLogoutView, setShowLogoutView] = useState(false);
  let [loginErr, setLoginErr] = useState<string>('');
  let [webviewUrl, setWebviewUrl] = useState('');
  const isLogoutSuccessUrl = url => url.indexOf(`${domain}/ui`) !== -1;

  const onNavigationStateChange = (navigationState: WebViewNavigation) => {
    webViewRef.current?.injectJavaScript(sendCookieScript);
    setWebviewUrl(navigationState.url);
  };

  const closeWebview = () => {
    setDomain('');
  };

  const onError = (err: string) => {
    closeWebview();
    setLoginErr(err);
  };

  const onMessage = async (event: NativeSyntheticEvent<WebViewMessage>) => {
    const {data} = event.nativeEvent;
    const parts = data.split('Cookie:');
    if (parts[1]) {
      let authToken = getAuthToken(parts[1]);
      if (!authToken) {
        return;
      }
      if (isLogoutSuccessUrl(webviewUrl)) {
        setShowLogoutView(true);
      }

      try {
        await getAndStoreUser(authToken);
      } catch (e) {
        onError(e?.toString());
      } finally {
        setShowLogoutView(false);
      }
    }
  };

  const getAndStoreUser = async token => {
    const host = getHost(domain);
    const realm = RealmDB.getInstance();
    realm.write(() => {
      realm.create(
        'UserInfo',
        {
          token: token,
          host: host,
        },
        'modified',
      );
    });
  };

  return domain ? (
    <Modal
      animationType="slide"
      transparent={true}
      visible
      onRequestClose={() => {
        closeWebview();
      }}>
      <View style={styles.webviewHeader}>
        <AiryLogo height={200} width={200} />
      </View>
      <WebView
        ref={webViewRef}
        source={
          showLogoutView
            ? {
                html: logoutHtml,
              }
            : {
                uri: getAuthUrl(domain),
              }
        }
        onError={error => {
          onError(error.nativeEvent.description);
        }}
        sharedCookiesEnabled
        onNavigationStateChange={onNavigationStateChange}
        onMessage={onMessage}
        scalesPageToFit
        userAgent="Mozilla/5.0 (Windows NT 6.1; WOW64; Trident/7.0; AS; rv:11.0) like Gecko" //needs to be removed
        originWhitelist={['https://*', 'http://*']}
        style={styles.webview}
      />
      <TouchableOpacity onPress={closeWebview} style={styles.closeButton}>
        <Text style={styles.closeButtonText}>Close</Text>
      </TouchableOpacity>
    </Modal>
  ) : (
    <View style={styles.container}>
      <AiryLogo height={200} width={200} />
      <Text style={styles.infoText}>
        Please provide the domain of the Airy installation you want to access.
      </Text>
      <View style={styles.inputContainer}>
        <TextInput
          style={styles.input}
          value={domainInput}
          autoCapitalize={'none'}
          placeholder={'my-organization'}
          placeholderTextColor="lightgray"
          onChangeText={text => setDomainInput(text.toLowerCase())}
        />
        <Text style={styles.domainText}>.airy.co</Text>
      </View>
      <TouchableOpacity
        style={styles.loginButton}
        onPress={() => {
          setDomain(`${domainInput}.airy.co`);
        }}>
        <Text style={styles.loginButtonText}>Login</Text>
      </TouchableOpacity>
      {!!loginErr && <Text style={styles.loginErr}>{loginErr}</Text>}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    flex: 1,
    width: '100%',
    padding: 20,
    margin: 0,
    backgroundColor: 'white',
  },
  infoText: {
    textAlign: 'center',
    marginTop: 20,
    fontSize: 16,
  },
  inputContainer: {
    marginTop: 40,
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    marginLeft: 40,
    marginRight: 40,
  },
  input: {
    textAlign: 'center',
    borderBottomWidth: 1,
    borderBottomColor: '#aeaeae',
    fontSize: 20,
    paddingBottom: 6,
    marginRight: 0,
    flex: 2,
  },
  domainText: {
    fontSize: 20,
    height: '100%',
    flex: 1,
    color: '#808080',
  },
  loginButton: {
    marginTop: 40,
    backgroundColor: colorBackgroundBlue,
    padding: 8,
    borderRadius: 8,
    width: 120,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: colorAiryBlue,
  },
  loginButtonText: {
    color: colorAiryBlue,
    fontFamily: 'Lato',
    fontSize: 20,
  },
  loginErr: {
    color: colorStateRed,
    fontFamily: 'Lato',
    fontSize: 20,
    marginTop: 20,
  },
  webviewHeader: {
    backgroundColor: 'white',
    alignItems: 'center',
    height: 150,
  },
  webview: {
    flex: 1,
  },
  closeButton: {
    backgroundColor: colorBackgroundBlue,
    paddingBottom: 24,
    paddingTop: 12,
  },
  closeButtonText: {
    color: colorAiryBlue,
    fontFamily: 'Lato',
    fontSize: 20,
    paddingLeft: 24,
  },
});
