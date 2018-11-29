/*
  Copyright © SuperMap. All rights reserved.
  Author: Wang zihao
  E-mail: zihaowang5325@qq.com
*/

import * as React from 'react'
import { View } from 'react-native'
import { Toast } from '../../../utils'
import NavigationService from '../../NavigationService' //导航模块
import { Container, TextBtn, BtnTwo } from '../../../components'
import Input from './Input'
import Tips from './Tips'
import forge from 'node-forge'

export default class Login extends React.Component {

  props: {
    navigation: Object,
    setUser: () => {},
    onlineServiceObject:Object,
  }

  constructor(props) {
    super(props);
  }

  _forgetPassword = () => {
    NavigationService.navigate('GetBack')
  }

  _register = () => {
    NavigationService.navigate('Register')
  }

  _login = async () => {
    // let userName = this.phone.getValue()
    // let password = this.password.getValue()

    let userName = 'imobile1234';
    let password = 'imobile'
    if (!userName) {
      Toast.show('请输入用户名')
      return
    }

    if (!password) {
      Toast.show('请输入密码')
      return
    }
    this.container.setLoading(true, '登录中')
    try {
      let result = await this.props.onlineServiceObject.login(userName, password)
      this.container.setLoading(false)
      if (typeof result === 'boolean' && result) {

        Toast.show('登录成功')
        let md = forge.md.md5.create()
        md.update(password)
        this.props.setUser({
          userName: userName,
          // password: md.digest().toHex(),
          password: password,

        })
      } else {
        this.props.setUser({
          userName: '',
          password: '',

        })
        Toast.show('登录失败')
      }
    } catch (e) {
      this.container.setLoading(false)
      Toast.show('登录失败')
      this.props.setUser({
        userName: '',
        password: '',

      })

    }
  }

  render() {
    return (
      <Container
        ref={ref => (this.container = ref)}
        headerProps={{
          title: 'iTablet登录',
          navigation: this.props.navigation,
          withoutBack: true,
        }}
      >
        <View
          style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}
        >
          <View style={{ alignItems: 'center' }}>
            {/*<Input ref={ref => this.phone = ref} placeholder='账号/手机号' />*/}
            <Input
              ref={ref => (this.phone = ref)}
              placeholder="账号"
            />
            <Input
              ref={ref => (this.password = ref)}
              placeholder="密码"
              password={true}
              image={require('../../../assets/public/lock.png')}
            />
            <Tips
              tipText="地图慧账户可直接登录"
              btnText="忘记密码"
              btnClick={this._forgetPassword}
            />
            <View style={{ marginTop: 50, marginBottom: 70 }}>
              <BtnTwo text="确定" btnClick={this._login} />
            </View>
            <TextBtn
              width={150}
              height={40}
              btnText="没有账户立即注册"
              btnClick={this._register}
            />
          </View>
        </View>
      </Container>
    )
  }
}

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     backgroundColor: BGCOLOR,
//   },
// })
