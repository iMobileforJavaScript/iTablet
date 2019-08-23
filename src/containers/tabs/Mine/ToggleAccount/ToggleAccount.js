import React, { Component } from 'react'
import { View, Text, TouchableOpacity, Image, FlatList } from 'react-native'
import Container from '../../../../components/Container'
import { color, size } from '../../../../styles'
import NavigationService from '../../../NavigationService'
import { SOnlineService, SIPortalService } from 'imobile_for_reactnative'
import Toast from '../../../../utils/Toast'
import { scaleSize } from '../../../../utils'
import { getLanguage } from '../../../../language/index'
import UserType from '../../../../constants/UserType'
export default class ToggleAccount extends Component {
  props: {
    navigation: Object,
    user: Object,
    setUser: () => {},
  }

  constructor(props) {
    super(props)
    this.state = {
      data: this.props.user.users,
    }
  }

  _renderItem = info => {
    let userName = info.item.userName
    let password = info.item.password
    let userType = info.item.userType
    if (userName && password) {
      let itemHeight = scaleSize(80)
      let fontSize = size.fontSize.fontSizeXl
      let imageWidth = itemHeight - scaleSize(10)
      let imageSource = {
        uri:
          'https://cdn3.supermapol.com/web/cloud/84d9fac0/static/images/myaccount/icon_plane.png',
      }
      return (
        <TouchableOpacity
          onPress={async () => {
            try {
              if (
                this.props.user.currentUser.userType === userType &&
                this.props.user.currentUser.userName === userName &&
                this.props.user.currentUser.password === password
              ) {
                Toast.show(getLanguage(global.language).Profile.SWITCH_CURRENT)
                return
              }
              if (this.containerRef) {
                this.containerRef.setLoading(
                  true,
                  getLanguage(global.language).Profile.SWITCHING,
                )
              }
              let result
              if (userType === UserType.COMMON_USER) {
                result = await SOnlineService.login(userName, password)
              } else if (userType === UserType.IPORTAL_COMMON_USER) {
                let url = info.item.serverUrl
                result = await SIPortalService.login(
                  url,
                  userName,
                  password,
                  true,
                )
              }
              if (this.containerRef) {
                this.containerRef.setLoading(false)
              }
              if (result) {
                this.props.setUser(info.item)
                NavigationService.popToTop('Tabs')
                // NavigationService.navigate('Mine')
              } else {
                Toast.show(getLanguage(global.language).Profile.SWITCH_FAIL)
              }
            } catch (e) {
              if (this.containerRef) {
                this.containerRef.setLoading(false)
              }
            }
          }}
          style={{
            height: itemHeight,
            width: '100%',
            flexDirection: 'row',
            alignItems: 'center',
            backgroundColor: color.content_white,
          }}
        >
          <Image
            style={{ height: imageWidth, width: imageWidth, marginLeft: 10 }}
            source={imageSource}
          />
          <Text
            style={{
              fontSize: fontSize,
              color: color.fontColorBlack,
              marginLeft: 10,
            }}
          >
            {userName}
          </Text>
        </TouchableOpacity>
      )
    }
  }

  _keyExtractor = (item, index) => {
    return 'id' + index
  }

  _renderAddAccount = () => {
    let itemHeight = scaleSize(80)
    let fontSize = size.fontSize.fontSizeXl
    return (
      <View
        style={{
          height: 4 + itemHeight,
          width: '100%',
        }}
      >
        <View
          style={{
            height: 4,
            width: '100%',
            backgroundColor: color.item_separate_white,
          }}
        />
        <TouchableOpacity
          onPress={() => {
            NavigationService.navigate('SelectLogin')
          }}
          style={{
            height: itemHeight,
            width: '100%',
            justifyContent: 'center',
            alignItems: 'center',
            backgroundColor: color.content_white,
          }}
        >
          <Text style={{ fontSize: fontSize, color: color.fontColorBlack }}>
            {getLanguage(global.language).Profile.ADD_ACCOUNT}
            {/* 添加账号 */}
          </Text>
        </TouchableOpacity>
      </View>
    )
  }

  render() {
    return (
      <Container
        ref={ref => (this.containerRef = ref)}
        headerProps={{
          title: getLanguage(global.language).Profile.MANAGE_ACCOUNT,
          //'账号管理',
          navigation: this.props.navigation,
        }}
      >
        <FlatList
          style={{ flex: 1, backgroundColor: color.content_white }}
          data={this.state.data}
          renderItem={this._renderItem}
          keyExtractor={this._keyExtractor}
          ListFooterComponent={this._renderAddAccount()}
        />
      </Container>
    )
  }
}
