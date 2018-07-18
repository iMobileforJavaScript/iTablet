/*
  Copyright © SuperMap. All rights reserved.
  Author: Wang zihao
  E-mail: zihaowang5325@qq.com
*/

import * as React from 'react'
import { View, StyleSheet, Text } from 'react-native'
import { constUtil, Toast } from '../../utils'

import BorderInput from './border_input'
import { Container, BtnTwo, CheckBox} from '../../components'

const DEFAULTWIDTH = 300
const BGCOLOR = constUtil.USUAL_GREEN

export default class Register extends React.Component {

  _sendMessage = () => {
    Toast.show('功能待完善')
  }

  _register = () => {
    Toast.show('功能待完善')
  }

  _checkBoxChange = changed => {
    // Toast.show('功能待完善')
  }

  render() {
    return (
      <Container
        style={styles.container}
        headerProps={{
          title: 'iTablet注册',
          navigation: this.props.navigation,
        }}>
        <View style={styles.containerView}>
          <BorderInput password={false} placeholder='手机号' />
          <BorderInput password={false} placeholder='昵称' />
          <View style={styles.message}>
            <BorderInput password={false} placeholder='短信验证码' width={190} />
            <BtnTwo text='发送验证码' width={100} size={13} radius={5} btnClick={this._sendMessage} />
          </View>
          <BorderInput password={true} placeholder='密码' />
          <View style={styles.checkbox}>
            <CheckBox onChange={this._checkBoxChange} />
            <View style={styles.checkboxTextContainer}>
              <Text style={styles.font}> 我已阅读并接受《超图软件用户服务协议》</Text>
            </View>
          </View>
          <BtnTwo text='注册' btnClick={this._register} />
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