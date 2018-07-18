/*
  Copyright © SuperMap. All rights reserved.
  Author: Wang zihao
  E-mail: zihaowang5325@qq.com
*/

import * as React from 'react'
import { View, StyleSheet } from 'react-native'
import { constUtil, Toast } from '../../../utils'

import NavigationService from '../../NavigationService'   //导航模块
import { Container, TextBtn, BtnTwo } from '../../../components'
import Input from './Input'
import Tips from './Tips'

const BGCOLOR = constUtil.USUAL_GREEN

export default class Login extends React.Component {

  props: {
    navigation: Object,
  }

  _forgetPassword = () => {
    NavigationService.navigate('GetBack')
  }

  _register = () => {
    NavigationService.navigate('Register')
  }

  _OK = () => {
    Toast.show('功能待完善')
  }

  render() {
    return (
      <Container
        headerProps={{
          title: 'iTablet登录',
          navigation: this.props.navigation,
          withoutBack: true,
        }}>
        <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
          <View style={{ alignItems: 'center' }}>
            <Input placeholder='手机号' />
            <Input placeholder='密码' password={true} image={require('../../../assets/public/lock.png')} />
            <Tips tipText='地图慧账户可直接登录' btnText='忘记密码' btnClick={this._forgetPassword} />
            <View style={{ marginTop: 50, marginBottom: 70 }}>
              <BtnTwo text='确定' btnClick={this._OK} />
            </View>
            <TextBtn width={150} height={40} btnText='没有账户立即注册' btnClick={this._register} />
          </View>
        </View>
      </Container>
    )
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: BGCOLOR,
  },
})