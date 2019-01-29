import React, { Component } from 'react'
import {
  WebView,
  View,
  Dimensions,
  Platform,
  UIManager,
  LayoutAnimation,
} from 'react-native'
import { Container } from '../../../../components'
import Toast from '../../../../utils/Toast'

export default class protocol extends Component {
  props: {
    navigation: Object,
  }
  constructor(props) {
    super(props)
    const params = this.props.navigation.state.params
    this.type = params.type
    this.state = {
      progressWidth: Dimensions.get('window').width * 0.4,
      isLoadWebView: false,
    }
    if (Platform.OS === 'android') {
      UIManager.setLayoutAnimationEnabledExperimental &&
        UIManager.setLayoutAnimationEnabledExperimental(true)
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

  componentDidMount() {
    this.setState({ isLoadWebView: true })
  }

  _onLoadStart = () => {
    LayoutAnimation.configureNext({
      duration: 150,
      create: {
        type: LayoutAnimation.Types.linear,
        property: LayoutAnimation.Properties.scaleX,
      },
      update: {
        type: LayoutAnimation.Types.linear,
      },
    })
    this.progressViewWidth = this.state.progressWidth
    let screenWidth = Dimensions.get('window').width
    this.objProgressWidth = setInterval(() => {
      if (this.progressViewRef) {
        let prevProgressWidth = this.progressViewWidth
        let currentPorWidth
        if (prevProgressWidth >= screenWidth - 250) {
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
    }, 150)
  }

  render() {
    let source
    switch (this.type) {
      case 'offcial':
        source = { uri: `https://www.supermap.com` }
        break
      case 'protocol':
        source = {
          uri: `https://www.supermapol.com/zh-cn/servicesagreement.html`,
        }
        break
      default:
        break
    }

    return (
      <Container
        headerProps={{
          title: '关于 SuperMap iTablet',
          navigation: this.props.navigation,
        }}
      >
        {this.state.isLoadWebView ? (
          <WebView
            style={{ flex: 1, paddingTop: 0 }}
            source={source}
            /** 保证release版本时，可加载到html*/
            originWhitelist={['*']}
            automaticallyAdjustContentInsets={true}
            scalesPageToFit={true}
            startInLoadingState={true}
            renderLoading={this._renderLoading}
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
            onLoadStart={this._onLoadStart}
            onLoadEnd={() => {
              // this.setState({isLoadingEnd:true,headerType:''})
              if (this.objProgressWidth !== undefined) {
                clearInterval(this.objProgressWidth)
              }
            }}
          />
        ) : (
          <View style={{ flex: 1, paddingTop: 0 }} />
        )}
      </Container>
    )
  }
}
