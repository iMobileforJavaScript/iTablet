/*
  Copyright © SuperMap. All rights reserved.
  Author: lu cheng dong
  E-mail: 756355668@qq.com
*/

import * as React from 'react'
import { WebView, Dimensions, ActivityIndicator, View } from 'react-native'
import { Container } from '../../../../../components'
import Toast from '../../../../../utils/Toast'
export default class ScanOnlineMap extends React.Component {
  props: {
    navigation: Object,
  }

  constructor(props) {
    super(props)
    this.state = {
      mapTitle: this.props.navigation.getParam('mapTitle', ''),
      mapUrl: this.props.navigation.getParam('mapUrl', ''),
      cookie: this.props.navigation.getParam('cookie', ''),
      isLoadWebView: false,
    }
  }
  componentDidMount() {
    this.setState({ isLoadWebView: true })
  }
  _renderLoading = () => {
    return (
      <View
        style={{
          flex: 1,
          alignItems: 'center',
          justifyContent: 'center',
          backgroundColor: 'white',
        }}
      >
        <ActivityIndicator color={'gray'} animating={true} size={'small'} />
      </View>
    )
  }
  _onLoadStart = () => {}
  _loadWebView = uri => {
    if (this.state.isLoadWebView) {
      return (
        <WebView
          style={{
            height: Dimensions.get('window').height,
            width: Dimensions.get('window').width,
          }}
          source={{
            uri: uri,
            // headers: {
            //   Cookie: 'JSESSIONID=' + this.state.cookie,
            //   'Cache-Control': 'no-cache',
            // },
            // cache: 'reload',
            // credentials: 'include',
          }}
          scalesPageToFit={true}
          startInLoadingState={true}
          renderLoading={this._renderLoading}
          /* android */
          javaScriptEnabled={true}
          domStorageEnabled={true}
          mixedContentMode={'always'}
          thirdPartyCookiesEnabled={true}
          onError={() => {
            Toast.show('加载失败')
          }}
          onLoadStart={this._onLoadStart}
        />
      )
    }
  }
  render() {
    let uri = this.state.mapUrl + '.ol3'
    let newUri
    if (uri.indexOf('https') !== -1) {
      let subUri = uri.substring(5)
      newUri = 'http' + subUri
    } else {
      newUri = uri
    }
    return (
      <Container
        headerProps={{
          title: this.state.mapTitle,
          withoutBack: false,
          navigation: this.props.navigation,
        }}
      >
        {this._loadWebView(newUri)}
      </Container>
    )
  }
}
