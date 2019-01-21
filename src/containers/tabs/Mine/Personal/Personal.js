import React, { Component } from 'react'
import { View, Text, Image, TouchableOpacity, ScrollView } from 'react-native'
import { Container } from '../../../../components'
import { ConstPath } from '../../../../constants'
import { FileTools } from '../../../../native'
import { color } from '../../../../styles'
import UserType from '../../../../constants/UserType'
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
    if (this.container) {
      this.container.setLoading(true, '注销中...')
    }
    try {
      SOnlineService.logout()
      this.props.closeWorkspace(async () => {
        let customPath = await FileTools.appendingHomeDirectory(
          ConstPath.CustomerPath + ConstPath.RelativeFilePath.Workspace,
        )
        if (this.container) {
          this.container.setLoading(false)
        }
        this.props.setUser()
        // NavigationService.goBack()
        NavigationService.reset('Tabs')
        await this.props.openWorkspace({ server: customPath })
      })
    } catch (e) {
      // Toast.show('退出登录失败')
      this.props.setUser()
      if (this.container) {
        this.container.setLoading(false)
      }
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
          <View
            style={{
              width: '100%',
              height: 1,
              backgroundColor: color.item_separate_white,
            }}
          />
          <View
            style={{
              backgroundColor: color.content_white,
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
                color: color.font_color_white,
              }}
            >
              {key}
            </Text>
            <View style={{ flex: 1 }} />
            <Text
              style={{
                marginRight: marginRight,
                fontSize: fontSize,
                color: color.font_color_white,
              }}
            >
              {value}
            </Text>
          </View>
        </View>
      )
    } else {
      let isCustomer =
        this.props.user.currentUser.userType === UserType.PROBATION_USER
      let image = isCustomer
        ? require('../../../../assets/home/system_default_header_image.png')
        : {
          uri:
              'https://cdn3.supermapol.com/web/cloud/84d9fac0/static/images/myaccount/icon_plane.png',
        }
      return (
        <View>
          <View style={{ width: '100%', height: 1 }} />
          <View
            style={{
              backgroundColor: color.content_white,
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
                color: color.font_color_white,
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
        style={{
          width: '100%',
          height: 8,
          backgroundColor: color.item_separate_white,
        }}
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
        <Text style={{ fontSize: 18, color: color.font_color_white }}>
          切换账号
        </Text>
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
        <Text style={{ fontSize: 18, color: color.font_color_white }}>
          退出登录
        </Text>
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
          {/*{this._renderLine()}*/}
        </ScrollView>
      </Container>
    )
  }
}
