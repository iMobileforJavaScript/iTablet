/*
  Copyright © SuperMap. All rights reserved.
  Author: lu cheng dong
  E-mail: 756355668@qq.com
*/
import React, { Component } from 'react'
import {
  View,
  Text,
  TouchableOpacity,
  Image,
  ScrollView,
  Platform,
} from 'react-native'
import { Container } from '../../../components'
import { FileTools } from '../../../native'
import NavigationService from '../../NavigationService'
import Login from './Login'
import { color } from './styles'
import ConstPath from '../../../constants/ConstPath'
import { SOnlineService } from 'imobile_for_reactnative'
import Toast from '../../../utils/Toast'
import UserType from '../../../constants/UserType'
export default class Mine extends Component {
  props: {
    navigation: Object,
    user: Object,
    setUser: () => {},
    closeWorkspace: () => {},
    openWorkspace: () => {},
  }

  constructor(props) {
    super(props)
    this.state = {
      display: 'flex',
    }
    this.goToMyService = this.goToMyService.bind(this)
    this.goToMyOnlineData = this.goToMyOnlineData.bind(this)
    this.goToMyLocalData = this.goToMyLocalData.bind(this)
  }
  componentDidUpdate(previousProps) {
    if (
      this.props.user.currentUser.userType !== UserType.PROBATION_USER &&
      this.props.user.currentUser.userName !== undefined &&
      this.props.user.currentUser.userName !== '' &&
      this.props.user.currentUser.userName !==
        previousProps.user.currentUser.userName
    ) {
      this.openUserWorkspace()
      SOnlineService.syncAndroidCookie()
    }
  }
  openUserWorkspace = () => {
    this.props.closeWorkspace(async () => {
      let userPath = await FileTools.appendingHomeDirectory(
        ConstPath.UserPath +
          this.props.user.currentUser.userName +
          '/' +
          ConstPath.RelativeFilePath.Workspace,
      )
      this.props.openWorkspace({ server: userPath })
    })
  }

  goToPersonal = () => {
    NavigationService.navigate('Personal')
  }

  goToMyLocalData = () => {
    let userName =
      this.props.user.currentUser.userType === UserType.PROBATION_USER
        ? 'Customer'
        : this.props.user.currentUser.userName
    NavigationService.navigate('MyLocalData', {
      userName: userName,
    })
  }
  goToMyOnlineData = async () => {
    NavigationService.navigate('MyOnlineData')
  }

  goToMyService = () => {
    NavigationService.navigate('MyService')
  }

  _selectionRender = () => {
    if (this.props.user.currentUser.userType === UserType.PROBATION_USER) {
      let fontSize = Platform.OS === 'ios' ? 18 : 16
      return (
        <View
          opacity={1}
          style={{ flex: 1, backgroundColor: color.content_white }}
        >
          {this._renderHeader(fontSize)}
          {this._renderLine()}
          {this._renderItem({
            title: '导入数据',
            leftImagePath: require('../../../assets/Mine/mine_my_local_data.png'),
            onClick: this.goToMyLocalData,
          })}
        </View>
      )
    } else {
      return this._render()
    }
  }

  _render = () => {
    let fontSize = Platform.OS === 'ios' ? 18 : 16
    return (
      <View
        opacity={1}
        style={{ flex: 1, backgroundColor: color.content_white }}
      >
        {this._renderHeader(fontSize)}
        <ScrollView
          style={{ flex: 1 }}
          // contentContainerStyle={{ alignItems:'center' }}
          showsHorizontalScrollIndicator={false}
          showsVerticalScrollIndicator={false}
          overScrollMode={'always'}
          bounces={true}
        >
          {this._renderLine()}
          {this._renderItem({
            title: '导入数据',
            leftImagePath: require('../../../assets/Mine/mine_my_local_data.png'),
            onClick: this.goToMyLocalData,
          })}
          {this._renderItem({
            title: '我的数据',
            leftImagePath: require('../../../assets/Mine/mine_my_online_data.png'),
            onClick: this.goToMyOnlineData,
          })}
          {this._renderItem({
            title: '我的服务',
            leftImagePath: require('../../../assets/Mine/mine_my_service.png'),
            onClick: this.goToMyService,
          })}
        </ScrollView>
      </View>
    )
  }
  _renderHeader = fontSize => {
    let allColor = color.font_color_white
    let headerHeight = 80
    let imageWidth = 40
    let isPro = this.props.user.currentUser.userType === UserType.PROBATION_USER
    let headerImage = isPro
      ? require('../../../assets/home/system_default_header_image.png')
      : {
        uri:
            'https://cdn3.supermapol.com/web/cloud/84d9fac0/static/images/myaccount/icon_plane.png',
      }
    let headerTitle = isPro ? 'Customer' : this.props.user.currentUser.userName
    return (
      <View
        style={{
          flexDirection: 'row',
          height: headerHeight,
          width: '100%',
          alignItems: 'center',
        }}
      >
        <TouchableOpacity
          onPress={this.goToPersonal}
          activeOpacity={1}
          style={{
            width: headerHeight,
            height: headerHeight,
            justifyContent: 'center',
            alignItems: 'center',
          }}
        >
          <Image
            resizeMode={'contain'}
            style={{
              width: imageWidth,
              height: imageWidth,
              borderRadius: 8,
              // tintColor:allColor,
            }}
            source={headerImage}
          />
        </TouchableOpacity>
        <Text
          style={{
            fontSize: fontSize,
            color: allColor,
          }}
        >
          {headerTitle}
        </Text>
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
  _renderItem = (
    itemRequire = {
      title: '',
      leftImagePath: '',
      onClick: () => {
        Toast.show('test')
      },
    },
    itemOptions = {
      itemWidth: '100%',
      itemHeight: 60,
      fontSize: Platform.OS === 'ios' ? 18 : 16,
      imageWidth: 25,
      imageHeight: 25,
      rightImagePath: require('../../../assets/Mine/mine_my_arrow.png'),
    },
  ) => {
    const { title, leftImagePath, onClick } = itemRequire
    const {
      itemWidth,
      itemHeight,
      fontSize,
      imageWidth,
      imageHeight,
      rightImagePath,
    } = itemOptions
    let allColor = color.font_color_white
    return (
      <View display={this.state.display}>
        <TouchableOpacity
          style={{
            flexDirection: 'row',
            width: itemWidth,
            height: itemHeight,
            alignItems: 'center',
            paddingLeft: 10,
            paddingRight: 10,
          }}
          onPress={onClick}
        >
          <Image
            style={{
              width: imageWidth,
              height: imageHeight,
              tintColor: allColor,
            }}
            resizeMode={'contain'}
            source={leftImagePath}
          />
          <Text
            style={{
              lineHeight: itemHeight,
              flex: 1,
              textAlign: 'left',
              fontSize: fontSize,
              color: allColor,
              paddingLeft: 5,
            }}
          >
            {title}
          </Text>
          <Image
            style={{
              width: imageWidth,
              height: imageHeight,
              tintColor: allColor,
            }}
            resizeMode={'contain'}
            source={rightImagePath}
          />
        </TouchableOpacity>
        <View
          style={{
            width: itemWidth,
            height: 1,
            backgroundColor: color.item_separate_white,
          }}
        />
      </View>
    )
  }

  render() {
    if (
      this.props.user &&
      this.props.user.currentUser &&
      (this.props.user.currentUser.userName ||
        this.props.user.currentUser.userType)
    ) {
      return (
        <Container
          ref={ref => (this.container = ref)}
          headerProps={{
            title: '我的iTablet',
            withoutBack: true,
            navigation: this.props.navigation,
          }}
        >
          {this._selectionRender()}
        </Container>
      )
    } else {
      return <Login setUser={this.props.setUser} user={this.props.user} />
    }
  }
}
