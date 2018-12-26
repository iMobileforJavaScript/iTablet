import React, { Component } from 'react'
import {
  View,
  Text,
  TouchableOpacity,
  Image,
  ScrollView,
  Dimensions,
} from 'react-native'
import { Container } from '../../../components'
import { FileTools } from '../../../native'
import NavigationService from '../../NavigationService'
import Login from './Login'
import { color } from './styles'
import ConstPath from '../../../constants/ConstPath'
import { SOnlineService } from 'imobile_for_reactnative'

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
    this.goToMyService = this.goToMyService.bind(this)
    this.goToMyOnlineData = this.goToMyOnlineData.bind(this)
  }
  componentDidUpdate(previousProps) {
    if (
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

  goToMyOnlineData = async () => {
    NavigationService.navigate('MyOnlineData')
  }

  goToMyService = () => {
    NavigationService.navigate('MyService')
  }

  _render = () => {
    this.screenWidth = Dimensions.get('window').width
    let fontSize = 16
    return (
      <View style={{ flex: 1, backgroundColor: color.border }}>
        {this._renderHeader(fontSize)}
        <ScrollView style={{ flex: 1 }}>
          <View style={{ flex: 1 }}>
            {this._renderMyOnlineDataItem(50, fontSize)}
            {this._renderMyServiceItem(50, fontSize)}
            {this._renderLine()}
          </View>
        </ScrollView>
      </View>
    )
  }
  _renderHeader = fontSize => {
    let headerHeight = 80
    let imageWidth = 40
    return (
      <View
        style={{
          flexDirection: 'row',
          height: headerHeight,
          width: this.screenWidth,
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
            style={{ width: imageWidth, height: imageWidth, padding: 5 }}
            source={require('../../../assets/public/icon-avatar-default.png')}
          />
        </TouchableOpacity>
        <Text
          style={{
            flex: 1,
            lineHeight: headerHeight,
            fontSize: fontSize,
            color: 'white',
          }}
        >
          {this.props.user.currentUser.userName}
        </Text>
      </View>
    )
  }
  _renderLine = () => {
    return <View style={{ flex: 1, height: 4, backgroundColor: color.theme }} />
  }
  _renderMyServiceItem = (itemHeight, fontSize) => {
    let imageWidth = itemHeight / 2
    return (
      <View>
        <View style={{ flex: 1, height: 4, backgroundColor: color.theme }} />
        <TouchableOpacity
          style={{
            flexDirection: 'row',
            width: this.screenWidth,
            height: itemHeight,
            alignItems: 'center',
            paddingLeft: 10,
            paddingRight: 10,
          }}
          onPress={() => {
            this.goToMyService()
          }}
        >
          <Image
            style={{ width: imageWidth, height: imageWidth }}
            resizeMode={'contain'}
            source={require('../../../assets/Mine/个人主页-我的服务.png')}
          />
          <Text
            style={{
              lineHeight: itemHeight,
              flex: 1,
              textAlign: 'left',
              fontSize: fontSize,
              color: 'white',
              paddingLeft: 5,
            }}
          >
            我的服务
          </Text>
          <Image
            style={{ width: imageWidth, height: imageWidth }}
            resizeMode={'contain'}
            source={require('../../../assets/Mine/个人主页-箭头.png')}
          />
        </TouchableOpacity>
      </View>
    )
  }
  _renderMyOnlineDataItem = (itemHeight, fontSize) => {
    let imageWidth = itemHeight / 2
    return (
      <View>
        <View style={{ flex: 1, height: 4, backgroundColor: color.theme }} />
        <TouchableOpacity
          style={{
            flexDirection: 'row',
            width: this.screenWidth,
            height: itemHeight,
            alignItems: 'center',
            paddingLeft: 10,
            paddingRight: 10,
          }}
          onPress={() => {
            this.goToMyOnlineData()
          }}
        >
          <Image
            style={{ width: imageWidth, height: imageWidth }}
            resizeMode={'contain'}
            source={require('../../../assets/Mine/个人主页-我的数据.png')}
          />
          <Text
            style={{
              lineHeight: itemHeight,
              flex: 1,
              textAlign: 'left',
              fontSize: fontSize,
              color: 'white',
              paddingLeft: 5,
            }}
          >
            在线数据
          </Text>
          <Image
            style={{ width: imageWidth, height: imageWidth }}
            resizeMode={'contain'}
            source={require('../../../assets/Mine/个人主页-箭头.png')}
          />
        </TouchableOpacity>
      </View>
    )
  }

  render() {
    if (
      this.props.user &&
      this.props.user.currentUser &&
      this.props.user.currentUser.userName
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
          {this._render()}
        </Container>
      )
    } else {
      return <Login setUser={this.props.setUser} user={this.props.user} />
    }
  }
}
