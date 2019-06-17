/*
 Copyright © SuperMap. All rights reserved.
 Author: Yangshanglong
 E-mail: yangshanglong@supermap.com
 */
import * as React from 'react'
import { View, ScrollView, KeyboardAvoidingView } from 'react-native'
import { Container, Input, Button } from '../../../../components'
import { color } from '../../../../styles'
import { Toast, scaleSize } from '../../../../utils'
import { getLanguage } from '../../../../language'
import styles from './styles'

export default class IServerLoginPage extends React.Component {
  props: {
    navigation: Object,
    nav: Object,
    language: String,
  }

  constructor(props) {
    super(props)
    const { params } = this.props.navigation.state
    this.cb = params && params.cb
    this.backcb = params && params.backcb
    this.state = {
      headerTitle: params && params.headerTitle ? params.headerTitle : '',
    }

    this.serverUrl = params && params.serverUrl ? params.serverUrl : ''
    this.userName = params && params.userName ? params.userName : ''
    this.password = params && params.password ? params.password : ''
  }

  login = () => {
    if (!this.serverUrl) {
      Toast.show(getLanguage(this.props.language).Profile.ENTER_SERVER_ADDRESS)
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
    // TODO login iserver

    this.cb && this.cb(this.serverUrl)
  }

  back = () => {
    if (this.backcb) {
      this.backcb()
    } else {
      this.props.navigation.goBack()
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
          title: this.state.headerTitle,
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
