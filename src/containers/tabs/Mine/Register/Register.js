/*
  Copyright © SuperMap. All rights reserved.
  Author: lu cheng dong
  E-mail: 756355668@qq.com
*/

import * as React from 'react'
import {
  TextInput,
  Text,
  Image,
  View,
  KeyboardAvoidingView,
  TouchableOpacity,
  ScrollView,
  Keyboard,
} from 'react-native'
import { Toast, scaleSize, OnlineServicesUtils } from '../../../../utils'
import { getPublicAssets } from '../../../../assets'
import { Container } from '../../../../components'
import NavigationService from '../../../NavigationService'
import styles, { fontSize } from './Styles'
import { getLanguage } from '../../../../language/index'

let JSOnlineService = undefined
export default class Register extends React.Component {
  props: {
    language: string,
    navigation: Object,
  }

  constructor(props) {
    super(props)
    this.state = {
      readProtocal: true,
      behavior: 'padding',
    }
    JSOnlineService = new OnlineServicesUtils('online')
    JSOnlineService.loadPhoneRegisterPage()
  }

  _goMine = () => {
    NavigationService.goBack()
  }

  _register = async () => {
    try {
      let result
      if (!this.txtPhoneNumberNickname) {
        //请输入昵称
        Toast.show(getLanguage(this.props.language).Profile.ENTER_USERNAME)
        return
      }
      if (!this.txtPhoneNumberRealName) {
        //请输入真实姓名
        Toast.show(getLanguage(this.props.language).Profile.ENTER_REALNAME)
        return
      }
      if (!this.txtPhoneNumberCompany) {
        //请输入工作机构
        Toast.show(getLanguage(this.props.language).Profile.ENTER_COMPANY)
        return
      }
      if (!this.txtPhoneNumberEmail) {
        //请输入个人邮箱
        Toast.show(getLanguage(this.props.language).Profile.ENTER_EMAIL)
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

      let info
      if (typeof result === 'boolean' && result === true) {
        info = getLanguage(this.props.language).Prompt.REGIST_SUCCESS
        //'注册成功'
        Toast.show(info)
        this.container.setLoading(false)
        this._goMine()
        return
      } else {
        if (typeof result === 'string') {
          info = result
        } else {
          info = getLanguage(this.props.language).Prompt.REGIST_FAILED
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

  renderRegister() {
    return (
      <View key={'phone'} style={{ width: '70%' }}>
        <TextInput
          keyboardType={'email-address'}
          //'请输入昵称'
          placeholder={getLanguage(this.props.language).Profile.ENTER_USERNAME}
          placeholderTextColor={'#A7A7A7'}
          clearButtonMode={'while-editing'}
          style={styles.textInputStyle}
          defaultValue={this.txtPhoneNumberNickname}
          onChangeText={text => {
            this.txtPhoneNumberNickname = text
          }}
        />
        <TextInput
          keyboardType={'email-address'}
          //'请输入真实姓名'
          placeholder={getLanguage(this.props.language).Profile.ENTER_REALNAME}
          placeholderTextColor={'#A7A7A7'}
          clearButtonMode={'while-editing'}
          style={styles.textInputStyle}
          defaultValue={this.txtPhoneNumberRealName}
          onChangeText={text => {
            this.txtPhoneNumberRealName = text
          }}
        />
        <TextInput
          keyboardType={'email-address'}
          //'请输入工作机构'
          placeholder={getLanguage(this.props.language).Profile.ENTER_COMPANY}
          placeholderTextColor={'#A7A7A7'}
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
          placeholderTextColor={'#A7A7A7'}
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
          placeholderTextColor={'#A7A7A7'}
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
          placeholderTextColor={'#A7A7A7'}
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
            placeholderTextColor={'#A7A7A7'}
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

  renderServiceProtocal = () => {
    let icon = this.state.readProtocal
      ? getPublicAssets().common.icon_check
      : getPublicAssets().common.icon_uncheck
    return (
      <View style={styles.protocalView}>
        <TouchableOpacity
          style={styles.protocalCheck}
          onPress={() =>
            this.setState({ readProtocal: !this.state.readProtocal })
          }
        >
          <Image source={icon} />
        </TouchableOpacity>
        <View
          style={[
            styles.protocalTextView,
            { flexDirection: global.language === 'EN' ? 'column' : 'row' },
          ]}
        >
          <Text style={styles.protocalText}>
            {getLanguage(global.language).Profile.REGISTER_READ_PROTOCAL}
          </Text>
          <TouchableOpacity
            onPress={() =>
              NavigationService.navigate('Protocol', {
                type: 'SuperMapOnlineProtocal',
              })
            }
          >
            <Text style={[styles.protocalText, { color: '#4680DF' }]}>
              {getLanguage(global.language).Profile.REGISTER_ONLINE_PROTOCAL}
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    )
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
              width: '100%',
            }}
            keyboardDismissMode={'on-drag'}
            keyboardShouldPersistTaps={'handled'}
            showsHorizontalScrollIndicator={false}
            showsVerticalScrollIndicator={false}
          >
            <View style={{ alignItems: 'center', width: '100%' }}>
              {this.renderRegister()}
              {this.renderServiceProtocal()}

              <TouchableOpacity
                style={styles.registerStyle}
                disabled={!this.state.readProtocal}
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
            </View>
          </ScrollView>
        </KeyboardAvoidingView>
      </Container>
    )
  }
}
