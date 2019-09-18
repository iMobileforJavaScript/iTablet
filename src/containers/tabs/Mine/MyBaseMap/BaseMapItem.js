import React, { Component } from 'react'
import { View, Image, TouchableOpacity, Text } from 'react-native'
import styles from './styles'
import NavigationService from '../../../NavigationService'
//eslint-disable-next-line
import { ActionPopover } from 'teaset'
// import ConstOnline from '../../../../constants/ConstOnline'
export default class BaseMapItem extends Component {
  props: {
    item: Object,
    index: number,
    saveItemInfo: () => {},
    uploadListOfAdd: () => {},
    removeDataFromUpList: () => {},
    curUserBaseMaps: Array,
    setBaseMap: () => {},
    user: Object,
  }
  constructor(props) {
    super(props)
    // this.state = {
    //   title: props.item.mapName,
    //   index: props.index,
    //   select: false,
    // }
  }

  // type: 'Datasource',
  // DSParams: {
  //   server: 'http://openstreetmap.org',
  //   engineType: 228,
  //   alias: 'OpenStreetMaps',
  // },
  // layerIndex: 0,
  // mapName: 'OSM',
  _showPopover = (pressView, item) => {
    let items = []
    // global.language
    items = [
      {
        title: global.language === 'CN' ? '修改' : 'modify',
        // '删除',
        onPress: () => {
          NavigationService.navigate('LoadServer', {
            setBaseMap: this.props.setBaseMap,
            baseMaps: this.props.curUserBaseMaps,
            item: item,
            user: this.props.user,
          })
        },
      },
      {
        title: global.language === 'CN' ? '删除' : 'delete',
        // '删除',
        onPress: () => {
          let list = this.props.curUserBaseMaps
          for (let i = 0, n = list.length; i < n; i++) {
            if (
              list[i].DSParams.server === item.DSParams.server &&
              list[i].mapName === item.mapName
            ) {
              list.splice(i, 1)
              break
            }
          }
          this.props.setBaseMap &&
            this.props.setBaseMap({
              userId: this.props.user.currentUser.userId,
              baseMaps: list,
            })
        },
      },
    ]
    pressView.measure((ox, oy, width, height, px, py) => {
      ActionPopover.show(
        {
          x: px,
          y: py,
          width,
          height,
        },
        items,
      )
    })
  }
  goToMapView = () => {
    let params = {
      wsData: this.props.item,
      isExample: true,
      mapName: this.props.item.mapName,
      noLegend: true,
    }
    NavigationService.navigate('MapView', params)
  }

  render() {
    // let Img = require('../../../../assets/Mine/mine_my_online_data.png')
    let Img
    switch (this.props.item.mapName) {
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
        Img = require('../../../../assets/public/mapLoad.png')
        break
    }
    // let moreImg = require('../../../../assets/Mine/icon_more_gray.png')
    // let selectImg = require('../../../../assets/mapTools/icon_multi_unselected_disable_black.png')
    // let selectedImg = require('../../../../assets/mapTools/icon_multi_selected_disable_black.png')
    // console.log(Img)
    let iTemView
    return (
      <TouchableOpacity
        style={{ flex: 1 }}
        // ref={ref => (iTemView = ref)}
        onLongPress={() => {
          if (this.props.item.userAdd) {
            this._showPopover(iTemView, this.props.item)
          }
        }}
        onPress={() => {
          this.goToMapView()
        }}
      >
        <View style={styles.rowView}>
          <Image source={Img} style={styles.Img} />
          <Text style={styles.title}>{this.props.item.mapName}</Text>
        </View>
      </TouchableOpacity>
    )
  }
}
