import React, { Component } from 'react'
import { WebView } from 'react-native'
import { Container } from '../../../../components'
import Toast from '../../../../utils/Toast'
export default class AboutITablet extends Component {
  props: {
    navigation: Object,
  }
  render() {
    return (
      <Container
        headerProps={{
          title: '关于iTablet',
          navigation: this.props.navigation,
        }}
      >
        <WebView
          style={{ flex: 1, paddingTop: 0 }}
          // source={{uri:'https://sso.supermap.com/agreement.html?service=http://www.supermapol.com'}}
          source={require('./UserProtocol.html')}
          automaticallyAdjustContentInsets={true}
          scalesPageToFit={true}
          startInLoadingState={true}
          /**ios*/
          contentInset={{ top: 0, left: 0, bottom: 0, right: 0 }}
          /**android*/
          javaScriptEnabled={true}
          domStorageEnabled={true}
          mixedContentMode={'always'}
          thirdPartyCookiesEnabled={true}
          allowFileAccess={true}
          allowUniversalAccessFromFileURLs={true}
          onError={() => {
            Toast.show('加载失败')
          }}
        />
      </Container>
    )
  }
}
