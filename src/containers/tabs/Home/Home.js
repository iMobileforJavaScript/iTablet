import React, { Component } from 'react'
import { View } from 'react-native'
import { HomeSwiper, BtnbarHome, HomeUsualMap} from './components'
import NavigationService from '../../NavigationService'

import styles from './styles'

export default class Home extends Component {
  props: {
    latestMap: Array,
  }

  constructor(props) {
    super(props)
    this.state = {
      sceneStyle: styles.invisibleMap,
    }
  }

  _goToMapLoad = () => { NavigationService.navigate('MapLoad',{}) }

  render() {
    return (
      <View style={styles.container}>
        <HomeSwiper />
        <BtnbarHome mapLoad={this._goToMapLoad} style={styles.btnbarhome} />
        <HomeUsualMap data={this.props.latestMap} style={styles.ususalmap}/>
      </View>
    )
  }
}
