import React, { Component } from 'react'
import {
  WebView,
  View,
  Dimensions,
  Platform,
  UIManager,
  LayoutAnimation,
} from 'react-native'
import { Container, MTBtn } from '../../../../components'
import Toast from '../../../../utils/Toast'
import { getLanguage } from '../../../../language/index'
import { scaleSize } from '../../../../utils'
import { getPublicAssets } from '../../../../assets'

export default class protocol extends Component {
  props: {
    navigation: Object,
  }
  constructor(props) {
    super(props)
    const params = this.props.navigation.state.params
    this.type = params.type
    this.knownItem = params.knownItem || {}
    this.state = {
      progressWidth: Dimensions.get('window').width * 0.4,
      isLoadWebView: false,
      backButtonEnabled: false,
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
    let source, title
    switch (this.type) {
      case 'offcial':
        source = { uri: `https://www.supermap.com` }
        title = 'SuperMap'
        break
      case 'protocol':
        if (global.language === 'CN') {
          source = {
            uri: 'http://111.202.121.144:8088/iTablet/home/help/protocol.html',
          }
        } else {
          source = {
            uri:
              'http://111.202.121.144:8088/iTablet/home/help/protocol_en.html',
          }
        }
        title = getLanguage(global.language).Profile.SERVICE_AGREEMENT
        break
      case 'Privacy':
        if (Platform.OS === 'android') {
          source =
            global.language === 'CN'
              ? {
                uri:
                    'file:///android_asset/SuperMapUserPrivacyPolicy_CN.html',
              }
              : {
                uri:
                    'file:///android_asset/SuperMapUserPrivacyPolicy_EN.html',
              }
        } else {
          source =
            global.language === 'CN'
              ? require('../../../../assets/Protocol/SuperMapUserPrivacyPolicy_CN.html')
              : require('../../../../assets/Protocol/SuperMapUserPrivacyPolicy_EN.html')
        }
        title = getLanguage(global.language).Profile.PRIVACY_POLICY
        break
      case 'superMapForum':
        source = {
          uri: `http://ask.supermap.com/`,
        }
        title = getLanguage(global.language).Prompt.SUPERMAP_FORUM
        //'超图论坛'
        break
      case 'SuperMapGroup':
        // source = {
        //   uri: `http://mp.weixin.qq.com/profile?src=3&timestamp=1552115539&ver=1&signature=Woh7VGjhtLXAgNTVx1F50zmUmCsLKoHFVbmqPbIG9A8hHc0dRRkEY*lxVbf-sH5ULhQ6jonrW-AHDvub42uzsw==`,
        // }
        // title = '超图集团'
        source = {
          uri:
            // 'http://111.202.121.144:8088/officialAccount/SuperMapGroup/html/' +
            'https://mp.weixin.qq.com/s/' + this.knownItem.id,
          //  +
          // '.html',
        }
        title = getLanguage(global.language).Prompt.SUPERMAP_GROUP
        //'超图集团'
        break
      case 'superMapKnown':
        source = {
          uri:
            // 'http://111.202.121.144:8088/officialAccount/zhidao/html/' +
            'https://mp.weixin.qq.com/s/' + this.knownItem.id,
          // +
          // '.html',
        }
        title = getLanguage(global.language).Prompt.SUPERMAP_KNOW
        //'超图知道'
        break
      case 'userHelp':
        if (global.language === 'CN') {
          source = {
            uri: 'http://111.202.121.144:8088/iTablet/home/help/help.html',
          }
        } else {
          source = {
            uri: 'http://111.202.121.144:8088/iTablet/home/help/help_en.html',
          }
        }
        title = getLanguage(global.language).Prompt.INSTRUCTION_MANUAL
        break
      case 'ApplyLicense':
        source = {
          uri: `https://www.supermapol.com/web/pricing/triallicense`,
        }
        title = getLanguage(global.language).Prompt.APPLY_LICENSE
        //'申请许可'
        break
      default:
        break
    }

    let webBackOpacity = this.state.backButtonEnabled ? 1 : 0
    let headerLeft = [
      <MTBtn
        key={'backTo'}
        image={getPublicAssets().common.icon_back}
        customStyle={{
          height: scaleSize(60),
          width: scaleSize(60),
          marginLeft: scaleSize(0),
        }}
        onPress={() => {
          this.props.navigation.goBack()
        }}
      />,
      <MTBtn
        key={'webClose'}
        image={getPublicAssets().common.icon_close}
        customStyle={{
          opacity: webBackOpacity,
          height: scaleSize(60),
          width: scaleSize(60),
          marginLeft: scaleSize(0),
        }}
        onPress={() => {
          this.webView.goBack()
        }}
      />,
    ]
    // headerLeft = this.state.backButtonEnabled ? headerLeft : null
    return (
      <Container
        headerProps={{
          title: title,
          headerLeft: headerLeft,
          navigation: this.props.navigation,
        }}
      >
        {this.state.isLoadWebView ? (
          <WebView
            ref={ref => (this.webView = ref)}
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
            onNavigationStateChange={navState => {
              this.setState({
                backButtonEnabled: navState.canGoBack,
              })
            }}
          />
        ) : (
          <View style={{ flex: 1, paddingTop: 0 }} />
        )}
      </Container>
    )
  }
}
