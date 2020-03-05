import React, { Component } from 'react'
import { View, Text, Image, TouchableOpacity, ScrollView } from 'react-native'
import { Container } from '../../../../components'
import { ConstPath } from '../../../../constants'
import { FileTools } from '../../../../native'
import { color, size } from '../../../../styles'
import UserType from '../../../../constants/UserType'
import NavigationService from '../../../NavigationService'
import { SOnlineService, SIPortalService } from 'imobile_for_reactnative'
import styles from './styles'
import { scaleSize } from '../../../../utils'
import { getLanguage } from '../../../../language/index'
import { SimpleDialog } from '../../Friend'

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

  _logoutConfirm = () => {
    this.SimpleDialog.setConfirm(() => {
      this.SimpleDialog.setVisible(false)
      this._logout()
    })
    this.SimpleDialog.setText(getLanguage(global.language).Prompt.LOG_OUT)
    this.SimpleDialog.setVisible(true)
  }

  _logout = () => {
    if (this.container) {
      //this.container.setLoading(true, '注销中...')
    }
    try {
      let userType = this.props.user.currentUser.userType
      if (userType === UserType.COMMON_USER) {
        SOnlineService.logout()
      } else if (userType === UserType.IPORTAL_COMMON_USER) {
        SIPortalService.logout()
      }
      this.props.closeWorkspace(async () => {
        SOnlineService.removeCookie()
        let customPath = await FileTools.appendingHomeDirectory(
          ConstPath.CustomerPath +
            ConstPath.RelativeFilePath.Workspace[
              global.language === 'CN' ? 'CN' : 'EN'
            ],
        )
        if (this.container) {
          this.container.setLoading(false)
        }
        this.props.setUser({
          userName: 'Customer',
          userType: UserType.PROBATION_USER,
        })
        NavigationService.popToTop()
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
    let itemHeight = scaleSize(80)
    let marginLeft = 15
    let marginRight = 20
    let fontSize = size.fontSize.fontSizeXl
    if (key !== getLanguage(global.language).Profile.PROFILE_PHOTO) {
      //'头像') {
      return (
        <View style={{ width: '100%' }}>
          <View
            style={{
              width: '100%',
              height: 1,
              backgroundColor: color.separateColorGray,
            }}
          />
          <View
            style={{
              backgroundColor: color.contentColorWhite,
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
                color: color.fontColorBlack,
              }}
            >
              {key}
            </Text>
            <View style={{ flex: 1 }} />
            <Text
              style={{
                marginRight: marginRight,
                fontSize: fontSize,
                color: color.fontColorBlack,
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
              backgroundColor: color.contentColorWhite,
              width: '100%',
              height: itemHeight + scaleSize(10),
              flexDirection: 'row',
              alignItems: 'center',
            }}
          >
            <Text
              style={{
                marginLeft: marginLeft,
                fontSize: fontSize,
                color: color.fontColorBlack,
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
        {this._renderItem(
          //'头像'
          getLanguage(global.language).Profile.PROFILE_PHOTO,
        )}
        {this._renderItem(
          //'用户名'
          getLanguage(global.language).Profile.USERNAME,
          this.props.user.currentUser.userName,
        )}
        {this._renderItem(
          //'手机号'
          getLanguage(global.language).Profile.PHONE,
          this.props.user.currentUser.phone,
        )}
        {this._renderItem(
          //'邮箱'
          getLanguage(global.language).Profile.E_MAIL,
          this.props.user.currentUser.email === ' 立即绑定'
            ? getLanguage(global.language).Profile.CONNECT
            : this.props.user.currentUser.email,
        )}
      </View>
    )
  }

  _renderLine = () => {
    return (
      <View
        style={{
          width: '100%',
          height: 4,
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
        <Text
          style={{
            fontSize: size.fontSize.fontSizeXl,
            color: color.fontColorBlack,
          }}
        >
          {getLanguage(global.language).Profile.SWITCH_ACCOUNT}
          {/* 切换账号 */}
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
        onPress={this._logoutConfirm}
      >
        <Text
          style={{
            fontSize: size.fontSize.fontSizeXl,
            color: color.fontColorBlack,
          }}
        >
          {getLanguage(global.language).Profile.LOG_OUT}
          {/* 退出登录 */}
        </Text>
      </TouchableOpacity>
    )
  }

  _renderSimpleDialog = () => {
    return <SimpleDialog ref={ref => (this.SimpleDialog = ref)} />
  }

  render() {
    return (
      <Container
        ref={ref => (this.container = ref)}
        headerProps={{
          title: getLanguage(global.language).Profile.MY_ACCOUNT,
          //'个人主页',
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
          {this._renderSimpleDialog()}
          {/*{this._renderLine()}*/}
        </ScrollView>
      </Container>
    )
  }
}
