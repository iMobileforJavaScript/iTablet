import React, { Component } from 'react'
import {
  WebView,
  View,
  Dimensions,
  Platform,
  UIManager,
  LayoutAnimation,
  StyleSheet,
  Text,
} from 'react-native'
import { Dialog, CheckBox } from '../../../../components'
import { scaleSize, setSpText, Toast } from '../../../../utils'
import { color } from '../../../../styles'
import { getLanguage } from '../../../../language'

export default class ProtocolDialog extends Component {
  props: {
    language: string,
    confirm: () => {},
  }

  constructor(props) {
    super(props)
    this.state = {
      progressWidth: Dimensions.get('window').width * 0.4,
      confirmBtnDisable: true,
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

  setVisible = visible => {
    this.dialog && this.dialog.setDialogVisible(visible)
  }

  confirm = () => {
    if (this.props.confirm && typeof this.props.confirm === 'function') {
      this.props.confirm(!this.state.confirmBtnDisable)
    }
  }

  render() {
    return (
      <Dialog
        ref={ref => (this.dialog = ref)}
        title={getLanguage(this.props.language).Protocol.PROTOCOL}
        style={{ height: scaleSize(500) }}
        opacityStyle={{ height: scaleSize(240) }}
        confirmAction={this.confirm}
        confirmBtnTitle={getLanguage(this.props.language).Protocol.AGREE}
        cancelBtnVisible={false}
        defaultVisible={true}
        confirmBtnDisable={this.state.confirmBtnDisable}
        type={Dialog.Type.NON_MODAL}
      >
        <WebView
          ref={ref => (this.webView = ref)}
          style={{ flex: 1, paddingVertical: 0 }}
          source={{
            uri:
              global.language === 'CN'
                ? 'http://111.202.121.144:8088/iTablet/home/help/protocol.html'
                : 'http://111.202.121.144:8088/iTablet/home/help/protocol_en.html',
          }}
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
            if (this.objProgressWidth !== undefined) {
              clearInterval(this.objProgressWidth)
            }
          }}
        />
        <View style={styles.checkView}>
          <CheckBox
            style={styles.checkBox}
            onChange={checked => {
              this.setState({
                confirmBtnDisable: !checked,
              })
            }}
          />
          <Text style={styles.tip}>我已阅读并同意上述条款</Text>
        </View>
      </Dialog>
    )
  }
}

const styles = StyleSheet.create({
  overlay: {
    position: 'absolute',
    justifyContent: 'center',
    alignItems: 'center',
    right: 0,
    top: 0,
    left: 0,
    bottom: 0,
  },
  checkView: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: scaleSize(10),
    backgroundColor: color.bgW,
  },
  checkBox: {
    height: scaleSize(15),
    width: scaleSize(40),
  },
  tip: {
    fontSize: setSpText(16),
    textAlign: 'center',
    backgroundColor: 'transparent',
  },
})
