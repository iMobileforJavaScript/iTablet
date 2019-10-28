/*
  Copyright © SuperMap. All rights reserved.
  Author: Wang zihao
  E-mail: zihaowang5325@qq.com
*/

import * as React from 'react'
import { StyleSheet, WebView } from 'react-native'
import { constUtil, Toast } from '../../utils'

import { Container } from '../../components'
import { getLanguage } from '../../language/index'

const BGCOLOR = constUtil.USUAL_GREEN
const DEFAULTWIDTH = 300

export default class GetBack extends React.Component {
  props: {
    navigation: Object,
  }

  _register = () => {
    Toast.show('功能待完善')
  }

  _sendMessage = () => {
    Toast.show('功能待完善')
  }

  render() {
    return (
      <Container
        style={styles.container}
        headerProps={{
          title: getLanguage(global.language).Profile.RESET_PASSWORD,
          navigation: this.props.navigation,
        }}
      >
        {/*<View style={styles.elementContainer}>*/}
        {/*<BorderInput placeholder='手机号' />*/}
        {/*<View style={styles.message}>*/}
        {/*<BorderInput password={false} placeholder='短信验证码' width={190} />*/}
        {/*<BtnTwo text='发送验证码' width={100} size={13} radius={5} btnClick={this._sendMessage} />*/}
        {/*</View>*/}
        {/*<BorderInput password={true} placeholder='新密码' />*/}
        {/*<BorderInput password={true} placeholder='确认密码' />*/}
        {/*<BtnTwo text='找回密码' width={90} btnClick={this._register} />*/}
        {/*</View>*/}
        {/*let uri ='https://sso.supermap.com/password?service=https://www.supermapol.com' */}
        <WebView
          scalesPageToFit={true}
          // scalesPageToFit={true}
          // automaticallyAdjustContentInsets={true}
          contentInset={{ top: 0, left: 0, right: 0, bottom: 0 }}
          style={styles.webView}
          source={{
            uri:
              'https://sso.supermap.com/password?service=https://www.supermapol.com',
          }}
          javaScriptEnabled={true}
          domStorageEnabled={true}
          startInLoadingState={true}
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
    alignItems: 'center',
  },
  elementContainer: {
    height: 0.4 * constUtil.HEIGHT,
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
})
