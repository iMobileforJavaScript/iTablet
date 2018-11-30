import React, { Component } from 'react'
import { View, Text, TouchableOpacity, Image, ScrollView } from 'react-native'
import { Container } from '../../../components'
import NavigationService from '../../NavigationService'
import Login from './Login'
import { SOnlineService } from 'imobile_for_reactnative'
import styles from './styles'

export default class Mine extends Component {
  props: {
    navigation: Object,
    user: Object,
    setUser: () => {},
  }

  constructor(props) {
    super(props)
    this._onlineService = new SOnlineService()
    this.goToMyService = this.goToMyService.bind(this)
    this.goToMyData = this.goToMyData.bind(this)
  }

  goToPersonal = () => {
    NavigationService.navigate('Personal', {
      objOnlineService: this._onlineService,
    })
  }

  goToMyData = () => {
    NavigationService.navigate('MyData')
  }

  goToMyService = () => {
    NavigationService.navigate('MyService', {
      objOnlineService: this._onlineService,
    })
  }

  renderHeader = () => {
    return (
      <View style={{ flex: 1 }}>
        <View style={styles.header}>
          <TouchableOpacity
            onPress={this.goToPersonal}
            activeOpacity={1}
            style={styles.avatarView}
          >
            <Image
              style={styles.avatar}
              source={require('../../../assets/public/icon-avatar-default.png')}
            />
          </TouchableOpacity>
          <View style={styles.headerContent}>
            {this.renderHeaderItem(
              (this.props.user.currentUser &&
                this.props.user.currentUser.userName) ||
                '用户名',
            )}
            {this.renderHeaderItem('绑定手机号')}
            {this.renderHeaderItem('邮箱')}
          </View>
        </View>
        <ScrollView style={{ flex: 1 }}>
          <View style={{ flex: 1 }}>
            {/*  <Text style={{ width: screenWidth, lineHeight: 50, backgroundColor: "#c0c0c0" }} onPress={() => {
              this.goToMyData();
            }}>我的数据
            </Text>

            <Text style={{ width: screenWidth, lineHeight: 1, backgroundColor: "#fff" }}/>*/}

            <Text
              style={[styles.label, styles.labelView]}
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
            // headerRight: (
            //   <BtnOne
            //     image={require('../../../assets/public/icon-setting-white.png')}
            //     onPress={}
            //   />
            // ),
          }}
        >
          {this.renderHeader()}
        </Container>
      )
    } else {
      return (
        <Login
          setUser={this.props.setUser}
          onlineServiceObject={this._onlineService}
        />
      )
    }
  }
}
