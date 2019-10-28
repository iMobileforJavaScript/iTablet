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
import { Toast, scaleSize, OnlineServicesUtils } from '../../../../utils'

import { Container } from '../../../../components'
import { SOnlineService } from 'imobile_for_reactnative'
import NavigationService from '../../../NavigationService'
import styles, {
  titleOnFocusBackgroundColor,
  titleOnBlurBackgroundColor,
  fontSize,
} from './Styles'
import color from '../../../../styles/color'
import { getLanguage } from '../../../../language/index'

let JSOnlineService = new OnlineServicesUtils('online')
export default class Register extends React.Component {
  props: {
    language: string,
    navigation: Object,
  }

  constructor(props) {
    super(props)
    this.state = {
      onEmailTitleFocus: true,
      onPhoneTitleFocus: false,
      titleEmailDefaultBg: titleOnFocusBackgroundColor,
      titlePhoneBg: titleOnBlurBackgroundColor,
      behavior: 'padding',
    }
    this._renderEmail = this._renderEmail.bind(this)
  }

  _goMine = () => {
    NavigationService.goBack()
  }

  _register = async () => {
    try {
      let result
      let isEmail = this.state.onEmailTitleFocus
      if (isEmail) {
        if (!this.txtEmail) {
          //请输入QQ邮箱
          Toast.show(getLanguage(this.props.language).Profile.ENTER_EMAIL)
          return
        }
        if (!this.txtEmailNickname) {
          //请输入昵称
          Toast.show(getLanguage(this.props.language).Profile.ENTER_USERNAME)
          return
        }
        if (!this.txtEmailPassword) {
          //请输入密码
          Toast.show(getLanguage(this.props.language).Profile.ENTER_PASSWORD)
          return
        }
        this.container.setLoading(
          true,
          getLanguage(this.props.language).Prompt.REGISTERING,
        )
        //'注册中...')
        result = await SOnlineService.registerWithEmail(
          this.txtEmail,
          this.txtEmailNickname,
          this.txtEmailPassword,
        )
      } else {
        if (!this.txtPhoneNumberNickname) {
          //请输入昵称
          Toast.show(getLanguage(this.props.language).Profile.ENTER_USERNAME)
          return
        }
        if (!this.txtPhoneNumberRealName) {
          //请输入手机号
          Toast.show('请输入真实姓名')
          return
        }
        if (!this.txtPhoneNumberCompany) {
          //请输入手机号
          Toast.show('请输入工作机构')
          return
        }
        if (!this.txtPhoneNumberEmail) {
          //请输入手机号
          Toast.show('请输入个人邮箱')
          return
        }
        if (!this.txtPhoneNumberPassword) {
          //请输入密码
          Toast.show(getLanguage(this.props.language).Profile.ENTER_PASSWORD)
          return
        }
        if (!this.txtPhoneNumber) {
          //请输入手机号
          Toast.show(getLanguage(this.props.language).Profile.ENTER_MOBILE)
          return
        }
        if (!this.txtVerifyCode) {
          //请输入验证码
          Toast.show(getLanguage(this.props.language).Profile.ENTER_CODE)
          return
        }
        this.container.setLoading(
          true,
          getLanguage(this.props.language).Prompt.REGISTERING,
        )
        //'注册中...')
        result = await JSOnlineService.register('phone', {
          nickname: this.txtPhoneNumberNickname,
          realName: this.txtPhoneNumberRealName,
          company: this.txtPhoneNumberCompany,
          email: this.txtPhoneNumberEmail,
          password: this.txtPhoneNumberPassword,
          phoneNumber: this.txtPhoneNumber,
          SMSVerifyCode: this.txtVerifyCode,
        })
      }

      let info
      if (typeof result === 'boolean' && result === true) {
        if (isEmail) {
          info = getLanguage(this.props.language).Prompt.GOTO_ACTIVATE
          //'注册成功，请前往邮箱激活'
          Toast.show(info)
        } else {
          info = getLanguage(this.props.language).Prompt.REGIST_SUCCESS
          //'注册成功'
          Toast.show(info)
        }
        this.container.setLoading(false)
        this._goMine()
        return
      } else {
        let index = result.indexOf('，')
        if (index !== -1) {
          result = result.substring(0, index)
        }
        switch (result) {
          case '手机号已注册':
            info = getLanguage(this.props.language).Prompt
              .PHIONE_HAS_BEEN_REGISTERED
            break
          case '昵称已存在':
            info = getLanguage(this.props.language).Prompt.NICKNAME_IS_EXISTS
            break
          case '短信验证码错误':
            info = getLanguage(this.props.language).Prompt
              .VERIFICATION_CODE_ERROR
            break
          case '邮箱已注册':
            info = getLanguage(this.props.language).Prompt
              .EMAIL_HAS_BEEN_REGISTERED
            break
          case '注册失败':
            info = getLanguage(this.props.language).Prompt.REGIST_FAILED
            break
          case '请输入正确的手机号':
          case '手机格式不正确':
            info = getLanguage(this.props.language).Prompt.ENTER_CORRECT_MOBILE
            break
          case '请输入正确的邮箱号':
          case '邮箱格式不正确':
            info = getLanguage(this.props.language).Prompt.ENTER_CORRECT_EMAIL
            break
          default:
            info = getLanguage(this.props.language).Prompt.REGIST_FAILED
            break
        }
        Toast.show(info)
      }
      this.container.setLoading(false)
    } catch (e) {
      Toast.show(getLanguage(this.props.language).Prompt.NETWORK_ERROR)
      //'网络错误')
      this.container.setLoading(false)
    }
  }

  _renderEmail() {
    return (
      <View key={'email'} style={{ width: '70%' }}>
        <TextInput
          keyboardType={'email-address'}
          clearButtonMode={'while-editing'}
          //'请输入邮箱'
          placeholder={getLanguage(this.props.language).Profile.ENTER_EMAIL}
          style={styles.textInputStyle}
          defaultValue={this.txtEmail}
          onChangeText={text => {
            this.txtEmail = text
          }}
        />
        <TextInput
          clearButtonMode={'while-editing'}
          //'请输入昵称'
          placeholder={getLanguage(this.props.language).Profile.ENTER_USERNAME}
          style={styles.textInputStyle}
          defaultValue={this.txtEmailNickname}
          onChangeText={text => {
            this.txtEmailNickname = text
          }}
        />
        <TextInput
          clearButtonMode={'while-editing'}
          secureTextEntry={true}
          // 请输入密码
          placeholder={getLanguage(this.props.language).Profile.ENTER_PASSWORD}
          style={styles.textInputStyle}
          defaultValue={this.txtEmailPassword}
          onChangeText={text => {
            this.txtEmailPassword = text
          }}
        />
      </View>
    )
  }

  _renderPhone() {
    return (
      <View key={'phone'} style={{ width: '70%' }}>
        <TextInput
          keyboardType={'email-address'}
          //'请输入昵称'
          placeholder={getLanguage(this.props.language).Profile.ENTER_USERNAME}
          clearButtonMode={'while-editing'}
          style={styles.textInputStyle}
          defaultValue={this.txtPhoneNumberNickname}
          onChangeText={text => {
            this.txtPhoneNumberNickname = text
          }}
        />
        <TextInput
          keyboardType={'email-address'}
          //'请输入昵称'
          placeholder={'请输入真实姓名'}
          clearButtonMode={'while-editing'}
          style={styles.textInputStyle}
          defaultValue={this.txtPhoneNumberRealName}
          onChangeText={text => {
            this.txtPhoneNumberRealName = text
          }}
        />
        <TextInput
          keyboardType={'email-address'}
          //'请输入昵称'
          placeholder={'请输入工作机构'}
          clearButtonMode={'while-editing'}
          style={styles.textInputStyle}
          defaultValue={this.txtPhoneNumberCompany}
          onChangeText={text => {
            this.txtPhoneNumberCompany = text
          }}
        />
        <TextInput
          keyboardType={'email-address'}
          clearButtonMode={'while-editing'}
          //'请输入邮箱'
          placeholder={getLanguage(this.props.language).Profile.ENTER_EMAIL}
          style={styles.textInputStyle}
          defaultValue={this.txtPhoneNumberEmail}
          onChangeText={text => {
            this.txtPhoneNumberEmail = text
          }}
        />
        <TextInput
          secureTextEntry={true}
          clearButtonMode={'while-editing'}
          //'请输入密码'
          placeholder={getLanguage(this.props.language).Profile.ENTER_PASSWORD}
          style={styles.textInputStyle}
          defaultValue={this.txtPhoneNumberPassword}
          onChangeText={text => {
            this.txtPhoneNumberPassword = text
          }}
        />
        <TextInput
          keyboardType={'phone-pad'}
          //'请输入手机号'
          placeholder={getLanguage(this.props.language).Profile.ENTER_MOBILE}
          style={styles.textInputStyle}
          clearButtonMode={'while-editing'}
          defaultValue={this.txtPhoneNumber}
          onChangeText={text => {
            this.txtPhoneNumber = text
          }}
        />
        <View style={styles.verifyCodeViewStyle}>
          <TextInput
            keyboardType={'phone-pad'}
            clearButtonMode={'while-editing'}
            //'请输入验证码'
            placeholder={getLanguage(this.props.language).Profile.ENTER_CODE}
            style={{ flex: 1, fontSize: scaleSize(fontSize), padding: 0 }}
            defaultValue={this.txtVerifyCode}
            onChangeText={text => {
              this.txtVerifyCode = text
            }}
          />
          <TouchableOpacity
            onPress={() => {
              if (!this.txtPhoneNumber && this.txtPhoneNumber === undefined) {
                //'请输入手机号'
                Toast.show(
                  getLanguage(this.props.language).Profile.ENTER_MOBILE,
                )
                return
              }
              Toast.show(
                getLanguage(this.props.language).Prompt.VERIFICATION_CODE_SENT,
              )
              //'验证码已发送')
              // SOnlineService.sendSMSVerifyCode(this.txtPhoneNumber)
              JSOnlineService.sendSMSVerifyCode(this.txtPhoneNumber)
            }}
          >
            <Text style={styles.verifyCodeRTextStyle}>
              {/* 获取验证码 */}
              {getLanguage(this.props.language).Profile.GET_CODE}
            </Text>
          </TouchableOpacity>
        </View>
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
  _onPhonePress = async () => {
    await JSOnlineService.loadPhoneRegisterPage()
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
          //'注册'
          title: getLanguage(this.props.language).Profile.REGISTER + ' Online',
          navigation: this.props.navigation,
        }}
      >
        <KeyboardAvoidingView
          enabled={true}
          keyboardVerticalOffset={0}
          style={{ flex: 1 }}
          contentContainerStyle={styles.keyboardAvoidingStyle}
          behavior={this.state.behavior}
        >
          <ScrollView
            style={{ flex: 1 }}
            contentContainerStyle={{
              alignItems: 'center',
              height: 500,
              width: '100%',
            }}
            keyboardDismissMode={'on-drag'}
            keyboardShouldPersistTaps={'handled'}
            showsHorizontalScrollIndicator={false}
            showsVerticalScrollIndicator={false}
          >
            <View style={{ alignItems: 'center', width: '100%' }}>
              <View style={styles.titleStyle}>
                <TouchableOpacity
                  onPress={() => {
                    this._onPhonePress()
                  }}
                  style={[
                    {
                      flex: 1,
                      height: '100%',
                      alignItems: 'center',
                      borderTopLeftRadius: 4,
                      borderBottomLeftRadius: 4,
                      borderTopRightRadius: 0,
                      borderBottomRightRadius: 0,
                      borderColor: color.theme,
                      justifyContent: 'center',
                      backgroundColor: this.state.titlePhoneBg,
                    },
                  ]}
                >
                  <Text style={[styles.titleContainerStyle]}>
                    {/* 手机注册 */}
                    {getLanguage(this.props.language).Profile.MOBILE_REGISTER}
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
                    borderTopRightRadius: 4,
                    borderBottomRightRadius: 4,
                    justifyContent: 'center',
                    backgroundColor: this.state.titleEmailDefaultBg,
                  }}
                >
                  <Text style={[styles.titleContainerStyle]}>
                    {/* 邮箱注册 */}
                    {getLanguage(this.props.language).Profile.EMAIL_REGISTER}
                  </Text>
                </TouchableOpacity>
              </View>
              {this._onSelectTitle()}

              <TouchableOpacity
                style={styles.registerStyle}
                onPress={() => {
                  Keyboard.dismiss()
                  this._register()
                }}
              >
                <Text style={styles.titleContainerStyle}>
                  {/* 注册 */}
                  {getLanguage(this.props.language).Profile.REGISTER}
                </Text>
              </TouchableOpacity>
              <View style={{ flex: 1, height: 200 }} />
            </View>
          </ScrollView>
        </KeyboardAvoidingView>
      </Container>
    )
  }
}
