import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { View, Text } from 'react-native'
import { Carousel, HomeSwiper, BtnbarHome, HomeUsualTitle, HomeUsualMap} from './components'
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
  
  _goToMapLoad = () => { NavigationService.navigate('MapLoad') }

  render() {
    return (
      <View style={styles.container}>
        <HomeSwiper />
        <BtnbarHome mapLoad={this._goToMapLoad} />
        {/*<HomeUsualTitle />*/}
        <HomeUsualMap data={this.props.latestMap} />
      </View>
    )
  }
}
