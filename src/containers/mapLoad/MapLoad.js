import React, { Component } from 'react'
import { View, PixelRatio } from 'react-native'

import { BtnbarLoad, ExampleMapList, OffLineList } from './components'
import { UsualTitle, Container } from '../../components'
import { Toast } from '../../utils'
import NavigationService from '../NavigationService'

import styles from './styles'

export default class MapLoad extends Component {
  props: {
    navigation: Object,
  }

  _offLine_More = () => {
    Toast.show('待完善')
  }

  render() {
    return (
      <Container
        headerProps={{
          title: '打开数据',
          navigation: this.props.navigation,
          headerRight: [

          ],
        }}>
        <UsualTitle title='本地地图'/>
        <OffLineList />
        <UsualTitle title='在线地图' themeColor='#F5FCFF' />
        <View style={styles.btnTabContainer}>
          <BtnbarLoad
            TD={() => { NavigationService.navigate('MapView', { type: 'TD' }) }}
            Baidu={() => { NavigationService.navigate('MapView', { type: 'Baidu' }) }}
            OSM={() => { NavigationService.navigate('MapView', { type: 'OSM' }) }}
            Google={() => { NavigationService.navigate('MapView', { type: 'Google' }) }}
          />
          {/*<BtnbarLoad*/}
          {/*TD={() => { NavigationService.navigate('Map', { type: 'TD' }) }}*/}
          {/*Baidu={() => { NavigationService.navigate('Map', { type: 'Baidu' }) }}*/}
          {/*OSM={() => { NavigationService.navigate('Map', { type: 'OSM' }) }}*/}
          {/*Google={() => { NavigationService.navigate('Map', { type: 'Google' }) }}*/}
          {/*/>*/}
        </View>
        <View style={{ height: 2 / PixelRatio.get(), backgroundColor: '#bbbbbb'}} />
        <UsualTitle title='示例地图' isRightBtn={true} btnText='更多' btnClick={this._offLine_More} />
        <ExampleMapList />
      </Container>
    )
  }
}
