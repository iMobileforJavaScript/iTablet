import React, { Component } from 'react'
import { View, Image, TouchableOpacity, Text } from 'react-native'
import styles from './styles'
import NavigationService from '../../../NavigationService'
// import ConstOnline from '../../../../constants/ConstOnline'
export default class BaseMapItem extends Component {
  props: {
    item: Object,
    index: number,
    saveItemInfo: () => {},
    uploadListOfAdd: () => {},
    removeDataFromUpList: () => {},
  }
  constructor(props) {
    super(props)
    this.state = {
      title: props.item.mapName,
      index: props.index,
      select: false,
    }
  }

  // type: 'Datasource',
  // DSParams: {
  //   server: 'http://openstreetmap.org',
  //   engineType: 228,
  //   alias: 'OpenStreetMaps',
  // },
  // layerIndex: 0,
  // mapName: 'OSM',

  goToMapView = () => {
    let params = {
      wsData: this.props.item,
      isExample: true,
      mapName: this.props.item.mapName,
    }
    NavigationService.navigate('MapView', params)
  }

  render() {
    // let Img = require('../../../../assets/Mine/mine_my_online_data.png')
    let Img
    switch (this.state.title) {
      case '百度地图':
        Img = {
          uri:
            'https://www.supermapol.com/services/../services/../services/../resources/thumbnail/data/data3290.png',
        }
        break
      case 'GOOGLE地图':
        Img = {
          uri:
            'https://www.supermapol.com/services/../services/../resources/thumbnail/data/data4731.png',
        }
        break
      case 'OSM':
        Img = {
          uri:
            'https://www.supermapol.com/services/../services/../resources/thumbnail/data/data3257.png',
        }
        break
      case 'SuperMapCloud':
        Img = {
          uri:
            'https://www.supermapol.com/services/../services/../services/../resources/thumbnail/data/data3255.png',
        }
        break
      default:
        Img = {
          uri:
            'https://www.supermapol.com/services/../services/../services/../resources/thumbnail/data/data3290.png',
        }
        break
    }
    // let moreImg = require('../../../../assets/Mine/icon_more_gray.png')
    // let selectImg = require('../../../../assets/mapTools/icon_multi_unselected_disable_black.png')
    // let selectedImg = require('../../../../assets/mapTools/icon_multi_selected_disable_black.png')
    // console.log(Img)
    return (
      <TouchableOpacity
        style={{ flex: 1 }}
        onPress={() => {
          this.goToMapView()
        }}
      >
        <View style={styles.rowView}>
          <Image source={Img} style={styles.Img} />
          <Text style={styles.title}>{this.state.title}</Text>
        </View>
      </TouchableOpacity>
    )
  }
}
