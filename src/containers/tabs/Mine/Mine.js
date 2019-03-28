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
// import Login from './Login'
import { color, size } from '../../../styles'
import ConstPath from '../../../constants/ConstPath'
import { SOnlineService } from 'imobile_for_reactnative'
import Toast from '../../../utils/Toast'
import { UserType, Const } from '../../../constants'
import { scaleSize } from '../../../utils'
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

  componentDidMount() {
    if (
      this.props.user &&
      this.props.user.currentUser &&
      !this.props.user.currentUser.password
    ) {
      this.props.setUser({
        userName: 'Customer',
        userType: UserType.PROBATION_USER,
      })
    }
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

  goToLogin = () => {
    NavigationService.navigate('Login')
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

  goToMyData = title => {
    NavigationService.navigate('MyData', {
      title,
    })
  }

  goToMyModule = title => {
    NavigationService.navigate('MyModule', { title })
  }

  goToMyBaseMap = () => {
    NavigationService.navigate('MyBaseMap', {})
  }

  goToMyLabel = title => {
    NavigationService.navigate('MyLabel', {
      title,
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
      let fontSize = size.fontSize.fontSizeXl
      return (
        <View
          opacity={1}
          style={{ flex: 1, backgroundColor: color.contentColorWhite }}
        >
          {this._renderHeader(fontSize)}
          <ScrollView
            style={{ flex: 1 }}
            showsHorizontalScrollIndicator={false}
            showsVerticalScrollIndicator={false}
            overScrollMode={'always'}
            bounces={true}
          >
            {this._renderLine()}
            {this._renderItem({
              title: Const.IMPORT,
              leftImagePath: require('../../../assets/Mine/mine_my_local_import.png'),
              onClick: this.goToMyLocalData,
            })}

            {this._renderItem({
              title: Const.DATA,
              leftImagePath: require('../../../assets/Mine/mine_my_local_data.png'),
              onClick: () => this.goToMyData(Const.DATA),
            })}
            {this._renderItem({
              title: Const.MYLABEL,
              leftImagePath: require('../../../assets/Mine/mine_my_plot.png'),
              onClick: () => {
                this.goToMyLabel(Const.MYLABEL)
              },
            })}
            {this._renderItem({
              title: Const.MAP,
              leftImagePath: require('../../../assets/Mine/mine_my_local_map.png'),
              onClick: () => this.goToMyData(Const.MAP),
            })}
            {this._renderItem({
              title: Const.SCENE,
              leftImagePath: require('../../../assets/Mine/mine_my_local_scene.png'),
              onClick: () => this.goToMyData(Const.SCENE),
            })}
            {this._renderItem({
              title: Const.BASEMAP,
              leftImagePath: require('../../../assets/Mine/my_basemap.png'),
              onClick: () => {
                this.goToMyBaseMap()
              },
            })}
            {this._renderItem({
              title: Const.SYMBOL,
              leftImagePath: require('../../../assets/Mine/mine_my_local_symbol.png'),
              onClick: () => this.goToMyData(Const.SYMBOL),
            })}
            {this._renderItem({
              title: Const.MINE_COLOR,
              leftImagePath: require('../../../assets/Mine/mine_my_color_light.png'),
              onClick: () => this.goToMyData(Const.MINE_COLOR),
            })}
            {this._renderItem({
              title: Const.MODULE,
              leftImagePath: require('../../../assets/function/icon_function_style.png'),
              onClick: () => this.goToMyModule(Const.MODULE),
            })}
          </ScrollView>
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
            title: Const.IMPORT,
            leftImagePath: require('../../../assets/Mine/mine_my_local_import.png'),
            onClick: this.goToMyLocalData,
          })}
          {this._renderItem({
            title: Const.SEVER,
            leftImagePath: require('../../../assets/Mine/mine_my_service.png'),
            onClick: this.goToMyService,
          })}
          {this._renderItem({
            title: Const.DATA,
            leftImagePath: require('../../../assets/Mine/mine_my_local_data.png'),
            onClick: () => this.goToMyData(Const.DATA),
          })}
          {this._renderItem({
            title: Const.MYLABEL,
            leftImagePath: require('../../../assets/Mine/mine_my_plot.png'),
            onClick: () => {
              this.goToMyLabel(Const.MYLABEL)
            },
          })}
          {this._renderItem({
            title: Const.MAP,
            leftImagePath: require('../../../assets/Mine/mine_my_local_map.png'),
            onClick: () => this.goToMyData(Const.MAP),
          })}
          {this._renderItem({
            title: Const.SCENE,
            leftImagePath: require('../../../assets/Mine/mine_my_local_scene.png'),
            onClick: () => this.goToMyData(Const.SCENE),
          })}
          {this._renderItem({
            title: Const.BASEMAP,
            leftImagePath: require('../../../assets/Mine/my_basemap.png'),
            onClick: () => {
              this.goToMyBaseMap()
            },
          })}
          {this._renderItem({
            title: Const.SYMBOL,
            leftImagePath: require('../../../assets/Mine/mine_my_local_symbol.png'),
            onClick: () => this.goToMyData(Const.SYMBOL),
          })}
          {this._renderItem({
            title: Const.MINE_COLOR,
            leftImagePath: require('../../../assets/Mine/mine_my_color_light.png'),
            onClick: () => this.goToMyData(Const.MINE_COLOR),
          })}
          {this._renderItem({
            title: Const.MODULE,
            leftImagePath: require('../../../assets/function/icon_function_style.png'),
            onClick: () => this.goToMyModule(Const.MODULE),
          })}
          {/*{this._renderItem({*/}
          {/*title: '我的数据',*/}
          {/*leftImagePath: require('../../../assets/Mine/mine_my_online_data.png'),*/}
          {/*onClick: this.goToMyOnlineData,*/}
          {/*})}*/}
          {/*{this._renderItem({*/}
          {/*title: '我的服务',*/}
          {/*leftImagePath: require('../../../assets/Mine/mine_my_service.png'),*/}
          {/*onClick: this.goToMyService,*/}
          {/*})}*/}
        </ScrollView>
      </View>
    )
  }
  _renderHeader = () => {
    let allColor = color.font_color_white
    let headerHeight = scaleSize(120)
    let imageWidth = scaleSize(70)
    let isPro = this.props.user.currentUser.userType === UserType.PROBATION_USER
    let headerImage = isPro
      ? require('../../../assets/home/system_default_header_image.png')
      : {
        uri:
            'https://cdn3.supermapol.com/web/cloud/84d9fac0/static/images/myaccount/icon_plane.png',
      }
    let headerTitle = isPro ? '立即登录' : this.props.user.currentUser.userName
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
          onPress={() => {
            if (headerTitle !== '立即登录') {
              this.goToPersonal()
            }
          }}
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
            }}
            source={headerImage}
          />
        </TouchableOpacity>
        <TouchableOpacity
          style={{ flex: 1 }}
          onPress={() => {
            if (headerTitle === '立即登录') {
              this.goToLogin()
            }
          }}
        >
          <Text
            style={{
              fontSize: size.fontSize.fontSizeXXl,
              color: allColor,
              fontWeight: 'bold',
            }}
          >
            {headerTitle}
          </Text>
        </TouchableOpacity>
      </View>
    )
  }

  _renderLine = () => {
    return (
      <View
        style={{
          width: '100%',
          height: 2,
          backgroundColor: color.separateColorGray,
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
      itemHeight: scaleSize(90),
      fontSize: size.fontSize.fontSizeXl,
      imageWidth: scaleSize(45),
      imageHeight: scaleSize(45),
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
    let imageColor = color.imageColorBlack
    let txtColor = color.fontColorBlack
    return (
      <View style={{ flex: 1 }} display={this.state.display}>
        <TouchableOpacity
          style={{
            flexDirection: 'row',
            width: itemWidth,
            height: itemHeight,
            alignItems: 'center',
            paddingLeft: 15,
            paddingRight: 15,
          }}
          onPress={onClick}
        >
          <Image
            style={{
              width: imageWidth,
              height: imageHeight,
              tintColor: imageColor,
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
              color: txtColor,
              paddingLeft: 15,
            }}
          >
            {title}
          </Text>
          <Image
            style={{
              width: imageWidth - 5,
              height: imageHeight - 5,
              tintColor: imageColor,
            }}
            resizeMode={'contain'}
            source={rightImagePath}
          />
        </TouchableOpacity>
        <View
          style={{
            flex: 1,
            height: 1,
            backgroundColor: color.separateColorGray,
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
            title: '我的',
            withoutBack: true,
            navigation: this.props.navigation,
          }}
        >
          {this._selectionRender()}
        </Container>
      )
    } else {
      return <View />
      // return <Login setUser={this.props.setUser} user={this.props.user} />
    }
  }
}
