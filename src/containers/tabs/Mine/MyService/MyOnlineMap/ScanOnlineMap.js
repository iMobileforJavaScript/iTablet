/*
  Copyright © SuperMap. All rights reserved.
  Author: lu cheng dong
  E-mail: 756355668@qq.com
*/

import * as React from 'react'
import {
  WebView,
  Dimensions,
  ActivityIndicator,
  Text,
  View,
} from 'react-native'
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
    }
  }
  _renderLoading = () => {
    return (
      <View
        style={{
          flex: 1,
          alignItems: 'center',
          justifyContent: 'center',
          backgroundColor: '#353537',
        }}
      >
        <ActivityIndicator color={'gray'} animating={true} size={'large'} />
        <Text style={{ fontSize: 12, color: 'white' }}>Loading...</Text>
      </View>
    )
  }
  _onLoadStart = () => {}
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
        style={{ flex: 1 }}
        headerProps={{
          title: this.state.mapTitle,
          withoutBack: false,
          navigation: this.props.navigation,
        }}
      >
        <WebView
          style={{
            flex: 1,
            height: Dimensions.get('window').height,
            width: Dimensions.get('window').width,
          }}
          source={{
            uri: newUri,
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
      </Container>
    )
  }
}
