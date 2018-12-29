/*
  Copyright © SuperMap. All rights reserved.
  Author: lu cheng dong
  E-mail: 756355668@qq.com
*/

import * as React from 'react'
import { WebView, Dimensions, View } from 'react-native'
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
      progressWidth: Dimensions.get('window').width * 0.4,
    }
  }
  componentDidMount() {
    this.setState({ isLoadWebView: true })
  }
  componentWillUnmount() {
    this._clearInterval()
  }
  _clearInterval = () => {
    if (this.objProgressWidth !== undefined) {
      clearInterval(this.objProgressWidth)
      this.setState({ progressWidth: '100%' })
    }
  }
  _renderLoading = () => {
    return (
      <View style={{ flex: 1, backgroundColor: 'white' }}>
        <View
          ref={ref => (this.progressViewRef = ref)}
          style={{
            height: 2,
            width: this.state.progressWidth,
            backgroundColor: '#1c84c0',
          }}
        />
      </View>
    )
  }
  _onLoadStart = () => {
    this.progressViewWidth = this.state.progressWidth
    this.objProgressWidth = setInterval(() => {
      //  帧动画
      requestAnimationFrame(() => {
        let screenWidth = Dimensions.get('window').width
        if (this.progressViewRef) {
          let prevProgressWidth = this.progressViewWidth
          let currentPorWidth
          if (prevProgressWidth >= screenWidth - 300) {
            currentPorWidth = prevProgressWidth + 1
            if (currentPorWidth >= screenWidth - 50) {
              currentPorWidth = screenWidth - 50
              this.progressViewWidth = currentPorWidth
              return
            }
          } else {
            currentPorWidth = prevProgressWidth * 1.01
          }
          this.progressViewWidth = currentPorWidth
          this.progressViewRef.setNativeProps({
            style: {
              height: 2,
              width: currentPorWidth,
              backgroundColor: '#1c84c0',
              borderBottomRightRadius: 1,
              borderTopRightRadius: 1,
              borderBottomLeftRadius: 0,
              borderTopLeftRadius: 0,
            },
          })
        }
      })
    }, 100)
  }
  _loadWebView = uri => {
    if (this.state.isLoadWebView) {
      return (
        <WebView
          style={{
            height: '100%',
            width: '100%',
          }}
          source={{
            uri: uri,
            // headers: {
            //   'Cookie': 'JSESSIONID=' + this.state.cookie,
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
          onLoadEnd={() => {
            this._clearInterval()
          }}
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
