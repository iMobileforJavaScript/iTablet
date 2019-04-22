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
import { Toast } from '../../../../utils'

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
        this.container.setLoading(true, '注册中...')
        result = await SOnlineService.registerWithEmail(
          this.txtEmail,
          this.txtEmailNickname,
          this.txtEmailPassword,
        )
      } else {
        if (!this.txtPhoneNumber) {
          //请输入手机号
          Toast.show(getLanguage(this.props.language).Profile.ENTER_MOBILE)
          return
        }
        if (!this.txtPhoneNumberNickname) {
          //请输入昵称
          Toast.show(getLanguage(this.props.language).Profile.ENTER_USERNAME)
          return
        }
        if (!this.txtVerifyCode) {
          //请输入验证码
          Toast.show(getLanguage(this.props.language).Profile.ENTER_CODE)
          return
        }
        if (!this.txtPhoneNumberPassword) {
          //请输入密码
          Toast.show(getLanguage(this.props.language).Profile.ENTER_PASSWORD)
          return
        }
        this.container.setLoading(true, '注册中...')
        result = await SOnlineService.registerWithPhone(
          this.txtPhoneNumber,
          this.txtVerifyCode,
          this.txtPhoneNumberNickname,
          this.txtPhoneNumberPassword,
        )
      }

      if (typeof result === 'boolean' && result === true) {
        let info
        if (isEmail) {
          info = '注册成功，请前往邮箱激活'
          Toast.show(info)
        } else {
          info = '注册成功'
          Toast.show(info)
        }
        this.container.setLoading(false)
        this._goMine()
        return
      } else {
        Toast.show(result)
      }
      this.container.setLoading(false)
    } catch (e) {
      Toast.show('网络错误')
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
        <View style={styles.verifyCodeViewStyle}>
          <TextInput
            keyboardType={'phone-pad'}
            clearButtonMode={'while-editing'}
            //'请输入验证码'
            placeholder={getLanguage(this.props.language).Profile.ENTER_CODE}
            style={{ flex: 1, fontSize: fontSize }}
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
              Toast.show('验证码已发送')
              SOnlineService.sendSMSVerifyCode(this.txtPhoneNumber)
            }}
          >
            <Text style={styles.verifyCodeRTextStyle}>
              {/* 获取验证码 */}
              {getLanguage(this.props.language).Profile.GET_CODE}
            </Text>
          </TouchableOpacity>
        </View>
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
          //'注册'
          title: getLanguage(this.props.language).Profile.REGISTER,
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
