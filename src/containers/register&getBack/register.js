/*
  Copyright © SuperMap. All rights reserved.
  Author: Wang zihao
  E-mail: zihaowang5325@qq.com
*/

import * as React from 'react'
import { StyleSheet, WebView, Platform } from 'react-native'
import { constUtil, Toast } from '../../utils'

import { Container } from '../../components'

const DEFAULTWIDTH = 300
const BGCOLOR = constUtil.USUAL_GREEN

export default class OldRegister extends React.Component {
  props: {
    navigation: Object,
  }

  _sendMessage = () => {
    Toast.show('功能待完善')
  }

  _register = () => {
    Toast.show('功能待完善')
  }

  _checkBoxChange = () => {
    // Toast.show('功能待完善')
  }

  render() {
    return (
      <Container
        style={styles.container}
        headerProps={{
          title: 'iTablet注册',
          navigation: this.props.navigation,
        }}
      >
        {/*<View style={styles.containerView}>*/}
        {/*<BorderInput password={false} placeholder='手机号' />*/}
        {/*<BorderInput password={false} placeholder='昵称' />*/}
        {/*<View style={styles.message}>*/}
        {/*<BorderInput password={false} placeholder='短信验证码' width={190} />*/}
        {/*<BtnTwo text='发送验证码' width={100} size={13} radius={5} btnClick={this._sendMessage} />*/}
        {/*</View>*/}
        {/*<BorderInput password={true} placeholder='密码' />*/}
        {/*<View style={styles.checkbox}>*/}
        {/*<CheckBox onChange={this._checkBoxChange} />*/}
        {/*<View style={styles.checkboxTextContainer}>*/}
        {/*<Text style={styles.font}> 我已阅读并接受《超图软件用户服务协议》</Text>*/}
        {/*</View>*/}
        {/*</View>*/}
        {/*<BtnTwo text='注册' btnClick={this._register} />*/}
        {/*</View>*/}
        <WebView
          // javaScriptEnabled={true}
          scalesPageToFit={Platform.OS === 'ios'}
          // automaticallyAdjustContentInsets={true}
          contentInset={{ top: 0, left: 0, right: 0, bottom: 0 }}
          style={styles.webView}
          source={{
            uri:
              'https://sso.supermap.com/register?service=http://www.supermapol.com',
          }}
          // injectedJavaScript="var body = document.getElementsByTagName('body');
          //    body.style.cssText += 'width: 100% !important; height: 100% !important'"
        />
      </Container>
    )
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: BGCOLOR,
    alignItems: 'center',
    justifyContent: 'center',
  },
  webView: {
    flex: 1,
    // height: '100%',
    // width: '100%',
    height: constUtil.HEIGHT,
    width: constUtil.WIDTH,
  },
  containerView: {
    height: 0.45 * constUtil.HEIGHT,
    width: DEFAULTWIDTH,
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  message: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: DEFAULTWIDTH,
  },
  checkbox: {
    display: 'flex',
    flexDirection: 'row',
    width: DEFAULTWIDTH,
    alignSelf: 'center',
  },
  checkboxTextContainer: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  font: {
    fontSize: 14,
  },
})
