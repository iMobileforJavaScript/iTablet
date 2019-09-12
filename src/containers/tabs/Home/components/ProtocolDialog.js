import React, { Component } from 'react'
import { WebView, View, StyleSheet, Text } from 'react-native'
import { Dialog, CheckBox, MTBtn } from '../../../../components'
import { scaleSize, setSpText, Toast } from '../../../../utils'
import { color } from '../../../../styles'
import { getLanguage } from '../../../../language'

export default class ProtocolDialog extends Component {
  props: {
    language: string,
    device: Object,
    confirm: () => {},
    setLanguage: () => {},
  }

  constructor(props) {
    super(props)
    this.state = {
      confirmBtnDisable: true,
    }
  }

  setVisible = visible => {
    this.dialog && this.dialog.setDialogVisible(visible)
  }

  confirm = () => {
    if (this.props.confirm && typeof this.props.confirm === 'function') {
      this.props.confirm(!this.state.confirmBtnDisable)
    }
  }

  renderWebView = () => {
    return (
      <WebView
        ref={ref => (this.webView = ref)}
        style={{ flex: 1, paddingVertical: 0, backgroundColor: 'transparent' }}
        source={{
          uri:
            this.props.language === 'CN'
              ? 'http://111.202.121.144:8088/iTablet/home/help/protocol.html'
              : 'http://111.202.121.144:8088/iTablet/home/help/protocol_en.html',
        }}
        /** 保证release版本时，可加载到html*/
        originWhitelist={['*']}
        automaticallyAdjustContentInsets={true}
        scalesPageToFit={true}
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
          Toast.show(getLanguage(this.props.language).Prompt.NETWORK_ERROR)
        }}
      />
    )
  }

  renderOption = () => {
    return (
      <View style={styles.optionView}>
        <View style={styles.checkView}>
          <CheckBox
            style={styles.checkBox}
            onChange={checked => {
              this.setState({
                confirmBtnDisable: !checked,
              })
            }}
          />
          <Text style={styles.tip}>
            {getLanguage(this.props.language).Protocol.READ_AND_AGREE}
          </Text>
        </View>
        <MTBtn
          title={this.props.language === 'EN' ? '中文' : 'EN'}
          textStyle={{ color: color.blue1 }}
          onPress={() => {
            if (this.props.language === 'EN') {
              this.props.setLanguage('CN')
            } else {
              this.props.setLanguage('EN')
            }
          }}
        />
      </View>
    )
  }

  render() {
    let height = this.props.device.height - scaleSize(120)
    let width = this.props.device.width - scaleSize(60)
    return (
      <Dialog
        ref={ref => (this.dialog = ref)}
        title={getLanguage(this.props.language).Protocol.PROTOCOL}
        style={{
          height: scaleSize(700),
          width: scaleSize(500),
          maxHeight: height,
          maxWidth: width,
        }}
        opacityStyle={{ height: scaleSize(240) }}
        confirmAction={this.confirm}
        confirmBtnTitle={getLanguage(this.props.language).Protocol.AGREE}
        cancelBtnVisible={false}
        defaultVisible={true}
        confirmBtnDisable={this.state.confirmBtnDisable}
        type={Dialog.Type.NON_MODAL}
      >
        {this.renderWebView()}
        {this.renderOption()}
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
  optionView: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    paddingVertical: scaleSize(10),
    backgroundColor: color.bgW,
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