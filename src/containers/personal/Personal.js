import React, { Component } from 'react'
import { View, Text, Image } from 'react-native'
import { Container, Button } from '../../components'
import { Toast } from '../../utils'
import NavigationService from '../NavigationService'

import styles from './styles'

export default class Personal extends Component {
  props: {
    navigation: Object,
    user: Object,
    setUser: () => {},
  }

  constructor(props){
    super(props);
    this._objOnlineService = this.props.navigation.getParam("objOnlineService",{});
  }

  logout = () => {
    (async function() {
      try {
        await this._objOnlineService.logout()

        NavigationService.goBack()
        this.props.setUser()
      } catch (e) {
        Toast.show('退出登录失败')
      }
    }.bind(this)())
  }

  renderHeader = () => {
    return (
      <View style={styles.header}>
        {this.renderHeaderItem({
          title: '头像',
          image: require('../../assets/public/icon-avatar-default.png'),
        })}
        {this.renderHeaderItem({
          title: '用户名',
          value: this.props.user.currentUser.userName,
        })}
        {this.renderHeaderItem({
          title: '手机号',
          value: this.props.user.currentUser.phone,
        })}
        {this.renderHeaderItem({
          title: '邮箱',
          value: this.props.user.currentUser.email,
        })}
      </View>
    )
  }

  renderHeaderItem = item => {
    return (
      <View style={styles.item}>
        <Text style={styles.title}>{item.title}</Text>
        {item.image ? (
          <Image
            style={styles.avatar}
            source={require('../../assets/public/icon-avatar-default.png')}
          />
        ) : (
          <Text style={styles.value}>{item.value}</Text>
        )}
      </View>
    )
  }

  renderLogout = () => {
    return (
      <Button
        style={styles.logoutBtn}
        title="退出登录"
        onPress={this.logout}
        activeOpacity={0.8}
        type="RED"
      />
    )
  }

  render() {
    return (
      <Container
        style={styles.container}
        ref={ref => (this.container = ref)}
        headerProps={{
          title: '个人资料',
          navigation: this.props.navigation,
        }}
      >
        {this.renderHeader()}
        {this.renderLogout()}
      </Container>
    )
  }
}
