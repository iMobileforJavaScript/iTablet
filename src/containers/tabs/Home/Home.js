import React, { Component } from 'react'
import { View, Text, TouchableOpacity, Image } from 'react-native'
import { Container } from '../../../components'
import { ModuleList } from './components'
import styles from './styles'

export default class Home extends Component {
  props: {
    nav: Object,
    latestMap: Array,
  }

  constructor(props) {
    super(props)
  }

  headrender() {
    let userimgsrc = require('../../../assets/home/icon_mine_select.png')
    let elseimg = require('../../../assets/home/icon_else_selected.png')
    const title = 'SuperMap Itablet'
    return (
      <View style={styles.header}>
        <TouchableOpacity style={styles.userview}>
          <Image source={userimgsrc} style={styles.userimg} />
        </TouchableOpacity>
        <Text style={styles.headtitle}>{title}</Text>
        <TouchableOpacity style={styles.elseimg}>
          <Image
            resizeMode={'contain'}
            source={elseimg}
            style={styles.elseimg}
          />
        </TouchableOpacity>
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
        {this.headrender()}
        <ModuleList />
      </Container>
    )
  }
}
