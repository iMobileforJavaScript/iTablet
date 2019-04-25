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
  Keyboard,
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
import { getLanguage } from '../../../../language/index'

export default class Login extends React.Component {
  props: {
    language: string,
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
      if (isEmail) {
        if (!this.txtEmail) {
          //请输入邮箱或昵称
          Toast.show(
            getLanguage(this.props.language).Profile.ENTER_EMAIL_OR_USERNAME,
          )
          return
        }
        if (!this.txtEmailPassword) {
          //请输入密码
          Toast.show(getLanguage(this.props.language).Profile.ENTER_PASSWORD)
          return
        }
        this.container.setLoading(
          true,
          getLanguage(this.props.language).Prompt.LOG_IN,
        )
        //'登录中...')
        userName = this.txtEmail
        password = this.txtEmailPassword
        /// debugger
        result = await SOnlineService.login(userName, password)
        // debugger
      } else {
        if (!this.txtPhoneNumber) {
          //请输入手机号
          Toast.show(getLanguage(this.props.language).Profile.ENTER_MOBILE)
          return
        }
        if (!this.txtPhoneNumberPassword) {
          //请输入密码
          Toast.show(getLanguage(this.props.language).Profile.ENTER_PASSWORD)
          return
        }
        this.container.setLoading(
          true,
          getLanguage(this.props.language).Prompt.LOG_IN,
        )
        //'登录中...')
        userName = this.txtPhoneNumber
        password = this.txtPhoneNumberPassword
        //debugger
        result = await SOnlineService.loginWithPhoneNumber(userName, password)
        // debugger
      }
      // debugger
      if (typeof result === 'boolean' && result) {
        //debugger
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
          await this.initUserDirectories(userName)
        }

        let bGetUserInfo = false
        let userInfo = {}
        userInfo = await SOnlineService.getUserInfo()

        if (userInfo !== false) {
          let userID = await SOnlineService.getUserInfoBy(userInfo.nickname, 0)
          if (userID === false) {
            //有的online账号拿不到ID
            userInfo['userId'] = userInfo.nickname //
          } else {
            userInfo['userId'] = userID[0]
          }
          bGetUserInfo = true
        }
        //下载好友列表
        if (bGetUserInfo !== false) {
          //优先加载在线的
          let userPath = await FileTools.appendingHomeDirectory(
            ConstPath.UserPath + userName,
          )
          userPath = userPath + '/ol_fl'
          SOnlineService.downloadFileWithCallBack(userPath, 'friend.list', {
            onResult: value => {
              // console.warn("-------------")
              if (value === true) {
                this.props.setUser({
                  userName: userName,
                  password: password,
                  nickname: userInfo.nickname,
                  email: userInfo.email,
                  phoneNumber: userInfo.phoneNumber,
                  userId: userInfo.userId,
                  isEmail: isEmail,
                  userType: UserType.COMMON_USER,
                  hasUpdateFriend: true,
                })
              } else {
                this.props.setUser({
                  userName: userName,
                  password: password,
                  nickname: userInfo.nickname,
                  email: userInfo.email,
                  phoneNumber: userInfo.phoneNumber,
                  userId: userInfo.userId,
                  isEmail: isEmail,
                  userType: UserType.COMMON_USER,
                  hasUpdateFriend: false,
                })
              }
            },
          })
        }

        if (bGetUserInfo !== false) {
          // Toast.show('登录成功')
          this.container.setLoading(false)
          this.props.setUser({
            userName: userName,
            password: password,
            nickname: userInfo.nickname,
            email: userInfo.email,
            phoneNumber: userInfo.phoneNumber,
            userId: userInfo.userId,
            isEmail: isEmail,
            userType: UserType.COMMON_USER,
            hasUpdateFriend: undefined,
          })
        } else {
          // Toast.show('登录成功')
          this.container.setLoading(false)
          this.props.setUser({
            userName: userName,
            password: password,
            isEmail: isEmail,
            userId: userName,
            userType: UserType.COMMON_USER,
          })
        }
        // this.container.setLoading(false)
        // this.props.setUser({
        //   userName: userName,
        //   password: password,
        //   isEmail: isEmail,
        //   userId: userName,
        //   userType: UserType.COMMON_USER,
        // })
        if (!this.state.isFirstLogin) {
          NavigationService.reset('Tabs')
        }
      } else {
        this.props.setUser({
          userName: '',
          password: '',
          // userType:UserType.COMMON_USER,
        })
        Toast.show(getLanguage(this.props.language).Prompt.FAILED_TO_LOG)
        //'登录失败')
        this.container.setLoading(false)
      }
    } catch (e) {
      //console.warn(e)
      this.container.setLoading(false)
      Toast.show(getLanguage(this.props.language).Prompt.FAILED_TO_LOG)
      //'登录异常')
      this.props.setUser({
        userName: '',
        password: '',
        // userType:UserType.COMMON_USER,
      })
    }
  }
  _renderEmail = () => {
    return (
      <View key={'email'} style={{ width: '70%' }}>
        <TextInput
          clearButtonMode={'while-editing'}
          keyboardType={'email-address'}
          // 请输入邮箱或昵称
          placeholder={
            getLanguage(this.props.language).Profile.ENTER_EMAIL_OR_USERNAME
          }
          multiline={false}
          defaultValue={this.txtEmail || ''}
          style={styles.textInputStyle}
          onChangeText={text => {
            this.txtEmail = text
          }}
        />
        <TextInput
          clearButtonMode={'while-editing'}
          secureTextEntry={true}
          // 请输入密码
          placeholder={getLanguage(this.props.language).Profile.ENTER_PASSWORD}
          multiline={false}
          password={true}
          style={styles.textInputStyle}
          defaultValue={this.txtEmailPassword || ''}
          onChangeText={text => {
            this.txtEmailPassword = text
          }}
        />
      </View>
    )
  }
  _renderPhone = () => {
    return (
      <View key={'phone'} style={{ width: '70%' }}>
        <TextInput
          clearButtonMode={'while-editing'}
          //请输入手机号
          placeholder={getLanguage(this.props.language).Profile.ENTER_MOBILE}
          defaultValue={this.txtPhoneNumber}
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
          //请输入密码
          placeholder={getLanguage(this.props.language).Profile.ENTER_PASSWORD}
          defaultValue={this.txtPhoneNumberPassword}
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
          //登录
          title: getLanguage(this.props.language).Profile.LOGIN,
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
              <View
                style={[
                  styles.titleStyle,
                  {
                    borderRadius: 6,
                    borderColor: color.itemColorBlack,
                    borderWidth: 2,
                  },
                ]}
              >
                <TouchableOpacity
                  onPress={() => {
                    this._onPhonePress()
                  }}
                  style={[
                    {
                      flex: 1,
                      height: '100%',
                      alignItems: 'center',
                      borderTopLeftRadius: 1,
                      borderBottomLeftRadius: 1,
                      borderTopRightRadius: 0,
                      borderBottomRightRadius: 0,
                      borderColor: color.borderColorBlack,
                      justifyContent: 'center',
                      backgroundColor: this.state.titlePhoneBg,
                    },
                  ]}
                >
                  <Text style={[styles.titleContainerStyle]}>
                    {/* 手机登录 */}
                    {getLanguage(this.props.language).Profile.MOBILE_LOGIN}
                  </Text>
                </TouchableOpacity>
                <TouchableOpacity
                  onPress={() => {
                    this._onEmailPress()
                  }}
                  style={{
                    flex: 1,
                    height: '100%',
                    alignItems: 'center',
                    borderTopLeftRadius: 0,
                    borderBottomLeftRadius: 0,
                    borderTopRightRadius: 1,
                    borderBottomRightRadius: 1,
                    borderColor: color.borderColorBlack,
                    justifyContent: 'center',
                    backgroundColor: this.state.titleEmailDefaultBg,
                  }}
                >
                  <Text style={[styles.titleContainerStyle]}>
                    {/* 邮箱登录 */}
                    {getLanguage(this.props.language).Profile.EMAIL_LOGIN}
                  </Text>
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
                  {/* 注册 */}
                  {getLanguage(this.props.language).Profile.REGISTER}
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

              {/* 登录 */}
              <TouchableOpacity
                accessible={true}
                accessibilityLabel={
                  getLanguage(this.props.language).Profile.LOGIN
                }
                style={styles.loginStyle}
                onPress={() => {
                  Keyboard.dismiss()
                  this._login()
                }}
              >
                <Text style={[styles.titleContainerStyle]}>
                  {/* 登录 */}
                  {getLanguage(this.props.language).Profile.LOGIN}
                </Text>
              </TouchableOpacity>
              {/*<View style={{marginTop: 5}}/>*/}
              {/* <TouchableOpacity
                accessible={true}
                accessibilityLabel={'游客'}
                style={styles.probationStyle}
                onPress={() => {
                  this._probation()
                }}
              >
                <Text style={[styles.titleContainerStyle]}>游客</Text>
              </TouchableOpacity>*/}
              <View style={{ flex: 1, height: 200 }} />
            </View>
          </ScrollView>
        </KeyboardAvoidingView>
      </Container>
    )
  }
}
