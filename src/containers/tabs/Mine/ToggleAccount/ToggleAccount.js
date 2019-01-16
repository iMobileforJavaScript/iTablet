import React, { Component } from 'react'
import { View, Text, TouchableOpacity, Image, FlatList } from 'react-native'
import Container from '../../../../components/Container'
import { color } from '../../../../styles'
import NavigationService from '../../../NavigationService'
import { SOnlineService } from 'imobile_for_reactnative'
import Toast from '../../../../utils/Toast'
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
    if (userName) {
      let itemHeight = 60
      let fontSize = 18
      let imageWidth = itemHeight - 10
      let imageSource =
        userName === 'Customer'
          ? require('../../../../assets/home/系统默认头像.png')
          : {
            uri:
                'https://cdn3.supermapol.com/web/cloud/84d9fac0/static/images/myaccount/icon_plane.png',
          }
      return (
        <TouchableOpacity
          onPress={async () => {
            try {
              let isEmail = info.item.isEmail
              let password = info.item.password
              if (
                this.props.user.currentUser.userName === userName &&
                this.props.user.currentUser.password === password
              ) {
                Toast.show('处于当前用户下，不可切换')
                return
              }
              if (this.containerRef) {
                this.containerRef.setLoading(true, '切换中...')
              }
              this.props.setUser({
                userName: userName,
                password: password,
                isEmail: isEmail,
              })
              if (isEmail === true) {
                await SOnlineService.login(userName, password)
              } else if (isEmail === false) {
                await SOnlineService.loginWithPhoneNumber(userName, password)
              }
              if (this.containerRef) {
                this.containerRef.setLoading(false)
              }

              NavigationService.navigate('Mine')
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
            backgroundColor: color.content,
          }}
        >
          <Image
            style={{ height: imageWidth, width: imageWidth, marginLeft: 10 }}
            source={imageSource}
          />
          <Text style={{ fontSize: fontSize, color: 'white', marginLeft: 10 }}>
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
    let itemHeight = 60
    let fontSize = 18
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
            backgroundColor: color.theme,
          }}
        />
        <TouchableOpacity
          onPress={() => {
            NavigationService.navigate('Login')
          }}
          style={{
            height: itemHeight,
            width: '100%',
            justifyContent: 'center',
            alignItems: 'center',
            backgroundColor: color.content,
          }}
        >
          <Text style={{ fontSize: fontSize, color: 'white' }}>添加账号</Text>
        </TouchableOpacity>
      </View>
    )
  }

  render() {
    return (
      <Container
        ref={ref => (this.containerRef = ref)}
        headerProps={{
          title: '账号管理',
          navigation: this.props.navigation,
        }}
      >
        <FlatList
          style={{ flex: 1, backgroundColor: color.theme }}
          data={this.state.data}
          renderItem={this._renderItem}
          keyExtractor={this._keyExtractor}
          ListFooterComponent={this._renderAddAccount()}
        />
      </Container>
    )
  }
}
