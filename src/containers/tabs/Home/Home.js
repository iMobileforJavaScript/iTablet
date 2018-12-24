import React, { Component } from 'react'
import { View, Text, TouchableOpacity, Image } from 'react-native'
import { Container } from '../../../components'
import { ModuleList } from './components'
import styles from './styles'
// import Orientation from '../../../constants/Orientation'
export default class Home extends Component {
  props: {
    nav: Object,
    latestMap: Array,
    currentUser: Object,
    setShow: () => {},
    device: Object,
  }

  constructor(props) {
    super(props)
  }

  headRender() {
    let userImg = require('../../../assets/home/icon_mine_select.png')
    let moreImg = require('../../../assets/home/icon_else_selected.png')
    const title = 'SuperMap iTablet'
    return (
      <View style={styles.header}>
        <View style={{ flex: 1.5 }} />
        <TouchableOpacity style={styles.userView}>
          <Image source={userImg} style={styles.userImg} />
        </TouchableOpacity>
        <Text style={styles.headTitle}>{title}</Text>
        <TouchableOpacity style={styles.moreImg}>
          <Image
            resizeMode={'contain'}
            source={moreImg}
            style={styles.moreImg}
          />
        </TouchableOpacity>
        <View style={{ flex: 1.5 }} />
      </View>
    )
  }

  render() {
    return (
      <Container
        ref={ref => (this.container = ref)}
        scrollable={true}
        withoutHeader
        style={styles.container}
      >
        {this.headRender()}
        <ModuleList
          currentUser={this.props.currentUser}
          styles={styles.modulelist}
          device={this.props.device}
        />
      </Container>
    )
  }
}
