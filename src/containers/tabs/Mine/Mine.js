import React, { Component } from 'react'
import { View, Text, TouchableOpacity, Image } from 'react-native'
import { Container } from '../../../components'
import Login from './Login'

import styles from './styles'

export default class Mine extends Component {
  props: {
    navigation: Object,
    user: Object,
    setUser: () => {},
  }

  renderHeader = () => {
    return (
      <View style={styles.header}>
        <TouchableOpacity style={styles.avatarView}>
          <Image style={styles.avatar} source={require('../../../assets/public/icon-avatar-default.png')}/>
        </TouchableOpacity>
        <View style={styles.headerContent}>
          {this.renderHeaderItem(this.props.user.currentUser && this.props.user.currentUser.userName ||'用户名')}
          {this.renderHeaderItem('绑定手机号')}
          {this.renderHeaderItem('邮箱')}
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
    if (this.props.user && this.props.user.currentUser && this.props.user.currentUser.userName) {
      return (
        <Container
          ref={ref => this.container = ref}
          headerProps={{
            title: '我的iTablet',
            withoutBack: true,
            navigation: this.props.navigation,
            // headerRight: <TextBtn btnText="添加" textStyle={styles.headerBtnTitle} btnClick={this.addNewLayerGroup} />,
          }}>
          {this.renderHeader()}
        </Container>
      )
    } else {
      return (
        <Login setUser={this.props.setUser} />
      )
    }
  }
}
