import React, { Component } from 'react'
import { View, Text, Image, TouchableOpacity, ScrollView } from 'react-native'
import { Container } from '../../../../components'
import { ConstPath } from '../../../../constants'
import { FileTools } from '../../../../native'
import { color } from '../../../../styles'
// import { Toast } from '../../utils'
import NavigationService from '../../../NavigationService'
import { SOnlineService } from 'imobile_for_reactnative'
import styles from './styles'

export default class Personal extends Component {
  props: {
    navigation: Object,
    user: Object,
    setUser: () => {},
    openWorkspace: () => {},
    closeWorkspace: () => {},
  }

  constructor(props) {
    super(props)
  }

  _logout = () => {
    try {
      SOnlineService.logout()
      this.props.closeWorkspace(async () => {
        let customPath = await FileTools.appendingHomeDirectory(
          ConstPath.CustomerPath + ConstPath.RelativeFilePath.Workspace,
        )
        this.props.setUser()
        NavigationService.goBack()
        await this.props.openWorkspace({ server: customPath })
      })
    } catch (e) {
      // Toast.show('退出登录失败')
      this.props.setUser()
    }
  }

  _renderItem = (key, value) => {
    let itemHeight = 60
    let marginLeft = 15
    let marginRight = 20
    let fontSize = 18
    if (key !== '头像') {
      return (
        <View style={{ width: '100%' }}>
          <View style={{ width: '100%', height: 1 }} />
          <View
            style={{
              backgroundColor: color.content,
              width: '100%',
              height: itemHeight,
              flexDirection: 'row',
              alignItems: 'center',
            }}
          >
            <Text
              style={{
                marginLeft: marginLeft,
                fontSize: fontSize,
                color: 'white',
              }}
            >
              {key}
            </Text>
            <View style={{ flex: 1 }} />
            <Text
              style={{
                marginRight: marginRight,
                fontSize: fontSize,
                color: 'white',
              }}
            >
              {value}
            </Text>
          </View>
        </View>
      )
    } else {
      let isCustomer =
        this.props.user.currentUser.userName === 'Customer' &&
        this.props.user.currentUser.password === 'Customer'
      let image = isCustomer
        ? require('../../../../assets/home/系统默认头像.png')
        : {
          uri:
              'https://cdn3.supermapol.com/web/cloud/84d9fac0/static/images/myaccount/icon_plane.png',
        }
      return (
        <View>
          <View style={{ width: '100%', height: 1 }} />
          <View
            style={{
              backgroundColor: color.content,
              width: '100%',
              height: itemHeight + 10,
              flexDirection: 'row',
              alignItems: 'center',
            }}
          >
            <Text
              style={{
                marginLeft: marginLeft,
                fontSize: fontSize,
                color: 'white',
              }}
            >
              {key}
            </Text>
            <View style={{ flex: 1 }} />
            <Image
              source={image}
              style={{
                width: itemHeight,
                height: itemHeight,
                marginRight: marginRight,
              }}
            />
          </View>
        </View>
      )
    }
  }

  renderHeader = () => {
    return (
      <View style={{ width: '100%' }}>
        {this._renderItem('头像')}
        {this._renderItem('用户名', this.props.user.currentUser.userName)}
        {this._renderItem('手机号', this.props.user.currentUser.phone)}
        {this._renderItem('邮箱', this.props.user.currentUser.email)}
      </View>
    )
  }

  _renderLine = () => {
    return (
      <View
        style={{ width: '100%', height: 4, backgroundColor: color.theme }}
      />
    )
  }

  _renderToggleAccount = () => {
    return (
      <TouchableOpacity
        accessible={true}
        accessibilityLabel={''}
        activeOpacity={0.8}
        style={styles.item2}
        onPress={() => {
          NavigationService.navigate('ToggleAccount')
        }}
      >
        <Text style={{ fontSize: 18, color: 'white' }}>切换账号</Text>
      </TouchableOpacity>
    )
  }

  _renderLogout = () => {
    return (
      <TouchableOpacity
        accessible={true}
        accessibilityLabel={''}
        activeOpacity={0.8}
        style={styles.item2}
        onPress={this._logout}
      >
        <Text style={{ fontSize: 18, color: 'white' }}>退出登录</Text>
      </TouchableOpacity>
    )
  }

  render() {
    return (
      <Container
        ref={ref => (this.container = ref)}
        headerProps={{
          title: '个人主页',
          navigation: this.props.navigation,
        }}
      >
        <ScrollView
          style={{ flex: 1 }}
          contentContainerStyle={[styles.container]}
        >
          {this.renderHeader()}
          {this._renderLine()}
          {this._renderToggleAccount()}
          {this._renderLine()}
          {this._renderLogout()}
        </ScrollView>
      </Container>
    )
  }
}
