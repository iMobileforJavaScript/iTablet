import React, { Component } from 'react'
import { View, Text, TouchableOpacity, Image, ScrollView } from 'react-native'
import { Container } from '../../../components'
import NavigationService from '../../NavigationService'
import Login from './Login'
import styles, { screen, color } from './styles'

export default class Mine extends Component {
  props: {
    navigation: Object,
    user: Object,
    setUser: () => {},
  }

  constructor(props) {
    super(props)
    this.goToMyService = this.goToMyService.bind(this)
    this.goToMyData = this.goToMyData.bind(this)
  }

  goToPersonal = () => {
    NavigationService.navigate('Personal')
  }

  goToMyData =async () => {
    // let sessionId = await SOnlineService.getAndroidSessionID()
    // let headers = {
    //   method: 'GET',
    //   headers:{
    //     'Host':'www.supermapol.com',
    //     'Cookie':'JSESSIONID='+sessionId,
    //   },
    //   credentials:'include',
    // }
    //
    // let getImage = fetch('https://www.supermapol.com/proxy/iserver/services/map_beijing_new/rest/maps/beijing/entireImage.png',headers)
    NavigationService.navigate('MyOnlineData')
  }

  goToMyService = () => {
    NavigationService.navigate('MyService')
  }

  renderHeader = () => {
    let headerHeight = 80
    let imageWidth = 40
    let fontSize = 16
    return (
      <View style={{ flex: 1, backgroundColor: color.border }}>

        <View
          style={{
            flexDirection: 'row',
            height: headerHeight,
            width: screen.deviceWidth,
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
            style={{ flex: 1, lineHeight: headerHeight, fontSize: fontSize ,color:'white',}}
          >
            {this.props.user.currentUser.userName}
          </Text>
        </View>
        <ScrollView style={{ flex: 1 }}>
          <View style={{ flex: 1 }}>
            {this._renderLine()}
            <Text
              style={{
                lineHeight: 60,
                flex: 1,
                textAlign: 'left',
                fontSize: fontSize,
                paddingLeft: 10,
                color:'white',
              }}
              onPress={() => {
                // NavigationService.navigate('GetBack')
              }}
            >
              本地数据
            </Text>
            {this._renderLine()}
            <Text
              style={{
                lineHeight: 47,
                flex: 1,
                textAlign: 'left',
                fontSize: fontSize,
                paddingLeft: 10,
                color:'white',
              }}
              onPress={() => {
                this.goToMyService()
              }}
            >
              我的服务
            </Text>
          </View>
        </ScrollView>
      </View>
    )
  }
  _renderLine = () => {
    return <View style={{ flex: 1, height: 4, backgroundColor: color.theme }} />
  }
  _renderMyItem = (itemWidth, itemHeight, fontSize, strText = 'wen') => {
    return (
      <View style={{ width: itemWidth, height: itemHeight + 4, padding: 5 }}>
        <View style={{ flex: 1, height: 4, backgroundColor: color.border }} />
        <View
          style={{
            flexDirection: 'row',
            width: itemWidth,
            height: itemHeight,
            justifyContent: 'center',
          }}
          onPress={() => {}}
        >
          <Image
            style={{ width: itemHeight / 2, height: itemHeight / 2 }}
            resizeMode={'contain'}
            source={require('../../../assets/public/icon-avatar-default.png')}
          />
          <Text
            style={{
              lineHeight: itemHeight,
              flex: 1,
              textAlign: 'left',
              fontSize: fontSize,
            }}
          >
            {strText}
          </Text>
          <Image
            style={{ width: itemHeight / 2, height: itemHeight / 2 }}
            resizeMode={'contain'}
            source={require('../../../assets/public/icon-avatar-default.png')}
          />
        </View>
      </View>
    )
  }

  renderHeaderItem = value => {
    return (
      <View style={styles.labelView}>
        <Text style={styles.label}>{value}</Text>
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
          {this.renderHeader()}
        </Container>
      )
    } else {
      return <Login setUser={this.props.setUser} user={this.props.user} />
    }
  }
}
