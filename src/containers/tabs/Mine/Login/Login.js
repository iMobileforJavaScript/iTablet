/*
  Copyright © SuperMap. All rights reserved.
  Author: lu cheng dong
  E-mail: 756355668@qq.com
*/

import * as React from 'react'
import {
  TextInput,
  Text,
  View,
  KeyboardAvoidingView,
  TouchableOpacity,
  ScrollView,
} from 'react-native'
import { Toast } from '../../../../utils/index'

import { Container } from '../../../../components'
import { FileTools } from '../../../../native'
import { SOnlineService } from 'imobile_for_reactnative'
import styles, {
  titleOnFocusBackgroundColor,
  titleOnBlurBackgroundColor,
} from './Styles'
import ConstPath from '../../../../constants/ConstPath'
import NavigationService from '../../../NavigationService'
import color from '../../../../styles/color'
import UserType from '../../../../constants/UserType'
export default class Login extends React.Component {
  props: {
    navigation: Object,
    user: Object,
    setUser: () => {},
  }

  constructor(props) {
    super(props)
    this.state = {
      onEmailTitleFocus: true,
      onPhoneTitleFocus: false,
      titleEmailDefaultBg: titleOnFocusBackgroundColor,
      titlePhoneBg: titleOnBlurBackgroundColor,
      behavior: 'padding',
      isChangeOrientation: false,
      isFirstLogin: this.props.navigation === undefined,
    }
  }

  // 初始用户化文件目录
  initUserDirectories = async userName => {
    try {
      let paths = Object.keys(ConstPath.RelativePath)
      let isCreate = true,
        absolutePath = ''
      for (let i = 0; i < paths.length; i++) {
        let path =
          ConstPath.UserPath + userName + '/' + ConstPath.RelativePath[paths[i]]
        absolutePath = await FileTools.appendingHomeDirectory(path)
        let exist = await FileTools.fileIsExistInHomeDirectory(path)
        let fileCreated =
          exist || (await FileTools.createDirectory(absolutePath))
        isCreate = fileCreated && isCreate
      }
      if (isCreate) {
        FileTools.initUserDefaultData(userName).then(result => {
          !result && Toast.show('初始化用户数据失败')
        })
      } else {
        Toast.show('创建用户目录失败')
      }
    } catch (e) {
      Toast.show('创建用户目录失败')
    }
  }
  /**试用*/
  _probation = () => {
    this.props.setUser({
      userName: 'Customer',
      userType: UserType.PROBATION_USER,
    })
    if (!this.state.isFirstLogin) {
      // NavigationService.navigate('Mine')
      NavigationService.reset('Tabs')
    }
  }

  _login = async () => {
    let result
    let isEmail = this.state.onEmailTitleFocus
    let userName = ''
    let password = ''
    try {
      userName = 'imobile1234'
      password = 'imobile'
      result = await SOnlineService.login(userName, password)
      // if (isEmail) {
      //   if (!this.txtEmail) {
      //     Toast.show('请输入邮箱或昵称')
      //     return
      //   }
      //   if (!this.txtEmailPassword) {
      //     Toast.show('请输入密码')
      //     return
      //   }
      //   this.container.setLoading(true, '登录中...')
      //   userName = this.txtEmail
      //   password = this.txtEmailPassword
      //   result = await SOnlineService.login(userName, password)
      // } else {
      //   if (!this.txtPhoneNumber) {
      //     Toast.show('请输入手机号')
      //     return
      //   }
      //   if (!this.txtPhoneNumberPassword) {
      //     Toast.show('请输入密码')
      //     return
      //   }
      //   this.container.setLoading(true, '登录中...')
      //   userName = this.txtPhoneNumber
      //   password = this.txtPhoneNumberPassword
      //   result = await SOnlineService.loginWithPhoneNumber(userName, password)
      // }

      if (typeof result === 'boolean' && result) {
        let isAccountExist
        for (let i = 0; i < this.props.user.users.length; i++) {
          isAccountExist =
            this.props.user.users[i].userName === userName &&
            this.props.user.users[i].password === password
          if (isAccountExist) {
            break
          }
        }
        if (!isAccountExist) {
          this.initUserDirectories(userName)
        }
        // Toast.show('登录成功')
        this.container.setLoading(false)
        this.props.setUser({
          userName: userName,
          password: password,
          isEmail: isEmail,
          // userType:UserType.COMMON_USER,
        })
        if (!this.state.isFirstLogin) {
          NavigationService.reset('Tabs')
        }
      } else {
        this.props.setUser({
          userName: '',
          password: '',
          // userType:UserType.COMMON_USER,
        })
        Toast.show('登录失败')
        this.container.setLoading(false)
      }
    } catch (e) {
      this.container.setLoading(false)
      Toast.show('登录异常')
      this.props.setUser({
        userName: '',
        password: '',
        // userType:UserType.COMMON_USER,
      })
    }
  }
  _renderEmail() {
    return (
      <View style={{ width: '70%' }}>
        <TextInput
          clearButtonMode={'while-editing'}
          keyboardType={'email-address'}
          placeholder={'请输入邮箱或昵称'}
          multiline={false}
          style={styles.textInputStyle}
          onChangeText={text => {
            this.txtEmail = text
          }}
        />
        <TextInput
          clearButtonMode={'while-editing'}
          secureTextEntry={true}
          placeholder={'请输入密码'}
          multiline={false}
          password={true}
          style={styles.textInputStyle}
          onChangeText={text => {
            this.txtEmailPassword = text
          }}
        />
      </View>
    )
  }
  _renderPhone() {
    return (
      <View style={{ width: '70%' }}>
        <TextInput
          clearButtonMode={'while-editing'}
          placeholder={'请输入手机号'}
          defaultValue={''}
          keyboardType={'number-pad'}
          style={styles.textInputStyle}
          onChangeText={text => {
            this.txtPhoneNumber = text
          }}
        />
        <TextInput
          secureTextEntry={true}
          multiline={false}
          textContentType={'password'}
          placeholder={'请输入密码'}
          defaultValue={''}
          style={styles.textInputStyle}
          onChangeText={text => {
            this.txtPhoneNumberPassword = text
          }}
        />
      </View>
    )
  }
  _onEmailPress = () => {
    if (!this.state.onEmailTitleFocus) {
      this.setState({
        onEmailTitleFocus: true,
        onPhoneTitleFocus: false,
        titleEmailDefaultBg: titleOnFocusBackgroundColor,
        titlePhoneBg: titleOnBlurBackgroundColor,
      })
    }
  }
  _onPhonePress = () => {
    if (!this.state.onPhoneTitleFocus) {
      this.setState({
        onEmailTitleFocus: false,
        onPhoneTitleFocus: true,
        titleEmailDefaultBg: titleOnBlurBackgroundColor,
        titlePhoneBg: titleOnFocusBackgroundColor,
      })
    }
  }
  _onSelectTitle = () => {
    if (this.state.onEmailTitleFocus) {
      return this._renderEmail()
    } else {
      return this._renderPhone()
    }
  }
  render() {
    return (
      <Container
        ref={ref => (this.container = ref)}
        style={styles.container}
        headerProps={{
          title: '登录',
          withoutBack: this.state.isFirstLogin,
          navigation: this.props.navigation,
        }}
      >
        <KeyboardAvoidingView
          enabled={true}
          keyboardVerticalOffset={0}
          style={{ flex: 1 }}
          contentContainerStyle={{
            flex: 1,
            alignItems: 'center',
            flexDirection: 'column',
          }}
          behavior={this.state.behavior}
        >
          <ScrollView
            style={{ flex: 1 }}
            contentContainerStyle={{ height: 500, alignItems: 'center' }}
            keyboardDismissMode={'on-drag'}
            keyboardShouldPersistTaps={'handled'}
            showsHorizontalScrollIndicator={false}
            showsVerticalScrollIndicator={false}
          >
            <View style={styles.keyboardAvoidingStyle}>
              <View style={styles.titleStyle}>
                <TouchableOpacity
                  onPress={() => {
                    this._onEmailPress()
                  }}
                  style={[
                    {
                      flex: 1,
                      height: '100%',
                      alignItems: 'center',
                      borderTopLeftRadius: 2,
                      borderBottomLeftRadius: 2,
                      borderTopRightRadius: 0,
                      borderBottomRightRadius: 0,
                      borderColor: color.theme,
                      justifyContent: 'center',
                      backgroundColor: this.state.titleEmailDefaultBg,
                    },
                  ]}
                >
                  <Text style={[styles.titleContainerStyle]}>邮箱登录</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  onPress={() => {
                    this._onPhonePress()
                  }}
                  style={{
                    flex: 1,
                    height: '100%',
                    alignItems: 'center',
                    borderTopLeftRadius: 0,
                    borderBottomLeftRadius: 0,
                    borderTopRightRadius: 2,
                    borderBottomRightRadius: 2,
                    justifyContent: 'center',
                    backgroundColor: this.state.titlePhoneBg,
                  }}
                >
                  <Text style={[styles.titleContainerStyle]}>手机登录</Text>
                </TouchableOpacity>
              </View>
              {this._onSelectTitle()}
              <View style={styles.viewStyle}>
                <Text
                  style={{
                    paddingLeft: 5,
                    width: 100,
                    lineHeight: 40,
                    textAlign: 'left',
                    color: color.font_color_white,
                  }}
                  onPress={() => {
                    NavigationService.navigate('Register')
                  }}
                >
                  注册
                </Text>
                {this.state.isFirstLogin ? (
                  <Text
                    style={{
                      paddingRight: 5,
                      width: 100,
                      lineHeight: 40,
                      textAlign: 'right',
                      color: color.font_color_white,
                    }}
                    onPress={() => {
                      NavigationService.navigate('GetBack')
                    }}
                  >
                    忘记密码
                  </Text>
                ) : null}
              </View>
              <TouchableOpacity
                accessible={true}
                accessibilityLabel={'登录'}
                style={styles.loginStyle}
                onPress={() => {
                  this._login()
                }}
              >
                <Text style={[styles.titleContainerStyle]}>登录</Text>
              </TouchableOpacity>
              {/*<View style={{marginTop: 5}}/>*/}
              <TouchableOpacity
                accessible={true}
                accessibilityLabel={'游客'}
                style={styles.probationStyle}
                onPress={() => {
                  this._probation()
                }}
              >
                <Text style={[styles.titleContainerStyle]}>游客</Text>
              </TouchableOpacity>
              <View style={{ flex: 1, height: 200 }} />
            </View>
          </ScrollView>
        </KeyboardAvoidingView>
      </Container>
    )
  }
}
