/*
 Copyright © SuperMap. All rights reserved.
 Author: Yangshanglong
 E-mail: yangshanglong@supermap.com
 */
import * as React from 'react'
import { View, ScrollView, KeyboardAvoidingView } from 'react-native'
import { Container, Input, Button } from '../../../../components'
import { color } from '../../../../styles'
import { Toast, scaleSize, dataUtil } from '../../../../utils'
import { getLanguage } from '../../../../language'
import NavigationService from '../../../NavigationService'
import styles from './styles'

export default class IServerLoginPage extends React.Component {
  props: {
    navigation: Object,
    nav: Object,
    iServerData: Object,
    language: String,

    loginIServer: () => {},
  }

  constructor(props) {
    super(props)
    const { params } = this.props.navigation.state
    this.cb = params && params.cb
    this.backcb = params && params.backcb
    this.state = {
      headerTitle: params && params.headerTitle ? params.headerTitle : '',
    }

    this.serverUrl =
      this.props.iServerData.ip && this.props.iServerData.port
        ? this.props.iServerData.ip + ':' + this.props.iServerData.port
        : ''
    this.userName = this.props.iServerData.userName
      ? this.props.iServerData.userName
      : ''
    this.password = this.props.iServerData.password
      ? this.props.iServerData.password
      : ''
  }

  login = () => {
    if (!this.serverUrl) {
      Toast.show(getLanguage(this.props.language).Profile.ENTER_SERVER_ADDRESS)
      return
    }
    if (!dataUtil.checkIpPort(this.serverUrl)) {
      Toast.show(
        getLanguage(this.props.language).Profile.ENTER_VALID_SERVER_ADDRESS,
      )
      return
    }
    if (!this.userName) {
      Toast.show(getLanguage(this.props.language).Profile.ENTER_USERNAME2)
      return
    }
    if (!this.password) {
      Toast.show(getLanguage(this.props.language).Profile.ENTER_PASSWORD)
      return
    }
    let ip = this.serverUrl.substr(0, this.serverUrl.lastIndexOf(':'))
    let port = this.serverUrl.substr(this.serverUrl.lastIndexOf(':') + 1)

    this.container.setLoading(
      true,
      getLanguage(this.props.language).Prompt.LOG_IN,
    )
    this.props
      .loginIServer({
        ip,
        port,
        userName: this.userName,
        password: this.password,
      })
      .then(async data => {
        if (data && data.succeed) {
          this.cb && (await this.cb({ ip, port }))
          this.container.setLoading(false)
          NavigationService.goBack()
        } else {
          this.container.setLoading(false)
          Toast.show(
            getLanguage(this.props.language).Analyst_Prompt
              .LOGIN_ISERVER_FAILED,
          )
        }
      })
      .catch(error => {
        this.container.setLoading(false)
        Toast.show(error)
      })
  }

  back = () => {
    if (this.backcb) {
      this.backcb()
    } else {
      NavigationService.goBack()
    }
  }

  render() {
    // if (!this.serverUrl) {
    //   const { params } = this.props.navigation.state
    //   this.serverUrl = params && params.serverUrl || ''
    // }
    return (
      <Container
        ref={ref => (this.container = ref)}
        style={styles.container}
        headerProps={{
          title: getLanguage(this.props.language).Analyst_Labels.ISERVER_LOGIN,
          backAction: this.back,
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
            // contentContainerStyle={{ height: 500, alignItems: 'center' }}
            keyboardDismissMode={'on-drag'}
            keyboardShouldPersistTaps={'handled'}
            showsHorizontalScrollIndicator={false}
            showsVerticalScrollIndicator={false}
          >
            <View key={'content'} style={styles.content}>
              <View style={{ width: '70%' }}>
                <Input
                  style={{ marginTop: scaleSize(20) }}
                  inputStyle={styles.input}
                  placeholder={
                    getLanguage(this.props.language).Profile
                      .ENTER_SERVER_ADDRESS
                  }
                  placeholderTextColor={color.themePlaceHolder}
                  defaultValue={this.serverUrl}
                  textContentType={'URL'}
                  onChangeText={text => {
                    this.serverUrl = text
                  }}
                  showClear
                />
                <Input
                  style={{ marginTop: scaleSize(20) }}
                  inputStyle={styles.input}
                  placeholder={
                    getLanguage(this.props.language).Profile.ENTER_USERNAME2
                  }
                  placeholderTextColor={color.themePlaceHolder}
                  defaultValue={this.userName}
                  onChangeText={text => {
                    this.userName = text
                  }}
                  showClear
                />
                <Input
                  style={{ marginTop: scaleSize(20) }}
                  inputStyle={styles.input}
                  placeholder={
                    getLanguage(this.props.language).Profile.ENTER_PASSWORD
                  }
                  placeholderTextColor={color.themePlaceHolder}
                  defaultValue={this.password}
                  textContentType={'password'}
                  secureTextEntry={true}
                  onChangeText={text => {
                    this.password = text
                  }}
                  showClear
                />
              </View>
              <Button
                key="loginBtn"
                style={styles.loginBtn}
                title={getLanguage(this.props.language).Profile.LOGIN}
                //"裁剪"
                onPress={this.login}
              />
            </View>
          </ScrollView>
        </KeyboardAvoidingView>
      </Container>
    )
  }
}
