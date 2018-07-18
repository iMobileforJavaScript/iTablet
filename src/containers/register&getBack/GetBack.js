/*
  Copyright © SuperMap. All rights reserved.
  Author: Wang zihao
  E-mail: zihaowang5325@qq.com
*/

import * as React from 'react'
import { View, StyleSheet } from 'react-native'
import { constUtil, Toast } from '../../utils'

import BorderInput from './border_input'
import { Container, BtnTwo } from '../../components'

const BGCOLOR = constUtil.USUAL_GREEN
const DEFAULTWIDTH = 300

export default class GetBack extends React.Component {

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
          title: 'iTablet注册',
          navigation: this.props.navigation,
        }}>
        <View style={styles.elementContainer}>
          <BorderInput placeholder='手机号' />
          <View style={styles.message}>
            <BorderInput password={false} placeholder='短信验证码' width={190} />
            <BtnTwo text='发送验证码' width={100} size={13} radius={5} btnClick={this._sendMessage} />
          </View>
          <BorderInput password={true} placeholder='新密码' />
          <BorderInput password={true} placeholder='确认密码' />
          <BtnTwo text='找回密码' width={90} btnClick={this._register} />
        </View>
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