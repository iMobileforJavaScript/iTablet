/**
 * Copyright © SuperMap. All rights reserved.
 * Author: Asort
 * https://github.com/AsortKeven
 */
import * as React from 'react'
import {
  Animated,
  View,
  Text,
  TouchableOpacity,
  FlatList,
  Image,
} from 'react-native'
import { SMap } from 'imobile_for_reactnative'
import styles from './style'
import { scaleSize } from '../../../../utils'
import PoiData from '../../../pointAnalyst/PoiData'
import Toast from '../../../../utils/Toast'
import { getLanguage } from '../../../../language'

export default class PoiInfoContainer extends React.PureComponent {
  props: {
    device: Object,
  }
  constructor(props) {
    super(props)
    this.state = {
      destination: '',
      location: {},
      address: '',
      showList: false,
      neighbor: [],
      resultList: [],
      visible: false,
    }
    this.bottom = new Animated.Value(scaleSize(-200))
    this.boxHeight = new Animated.Value(scaleSize(200))
    this.height = new Animated.Value(scaleSize(200))
  }

  componentWillUnmount() {
    SMap.deleteGestureDetector()
  }

  setVisible = (visible, radius = 5000) => {
    if (visible === this.state.visible) {
      return
    }
    let value = visible ? 0 : scaleSize(-200)
    Animated.timing(this.bottom, {
      toValue: value,
      duration: 400,
    }).start()
    GLOBAL.toolBox && GLOBAL.toolBox.showFullMap()
    if (!visible) {
      Animated.timing(this.height, {
        toValue: scaleSize(200),
        duration: 400,
      }).start()
      Animated.timing(this.boxHeight, {
        toValue: scaleSize(scaleSize(200)),
        duration: 10,
      }).start()
      GLOBAL.toolBox && GLOBAL.toolBox.existFullMap()
    }
    this.setState({
      visible,
      radius,
    })
  }

  getDistance = (p1, p2) => {
    //经纬度差值转距离 单位 m
    let R = 6371393
    return Math.abs(
      ((p2.x - p1.x) *
        Math.PI *
        R *
        Math.cos((((p2.y + p1.y) / 2) * Math.PI) / 180)) /
        180,
    )
  }

  //属性排序
  compare = prop => (a, b) => {
    return a[prop] - b[prop]
  }

  getSearchResult = params => {
    let searchStr = ''
    let keys = Object.keys(params)
    keys.map(key => {
      searchStr += `&${key}=${params[key]}`
    })
    // location={"x":104.04801859009979,"y":30.64623399251152}&radius=5000keyWords=${key}
    let url = `http://www.supermapol.com/iserver/services/localsearch/rest/searchdatas/China/poiinfos.json?&key=tY5A7zRBvPY0fTHDmKkDjjlr${searchStr}`
    //console.warn(url)
    fetch(url)
      .then(response => response.json())
      .then(async data => {
        if (data.error) {
          Toast.show(getLanguage(global.language).Prompt.NO_SEARCH_RESULTS)
        } else {
          let poiInfos = data.poiInfos
          let resultList = poiInfos.map(item => {
            return {
              pointName: item.name,
              x: item.location.x,
              y: item.location.y,
              address: item.address,
              distance: this.getDistance(item.location, this.state.location),
            }
          })
          resultList.sort(this.compare('distance')).forEach((item, index) => {
            resultList[index].distance =
              item.distance > 1000
                ? (item.distance / 1000).toFixed(2) + 'km'
                : ~~item.distance + 'm'
          })
          Animated.timing(this.height, {
            toValue: scaleSize(450),
            duration: 400,
          }).start()
          Animated.timing(this.boxHeight, {
            toValue: scaleSize(scaleSize(450)),
            duration: 10,
          }).start()
          this.setState(
            {
              resultList,
            },
            async () => {
              await SMap.addCallouts(resultList)
              SMap.setGestureDetector({
                singleTapHandler: this.clear,
              })
            },
          )
        }
      })
  }

  clear = () => {
    SMap.removeAllCallout()
    this.setVisible(false)
  }

  close = () => {
    SMap.removePOICallout()
    this.setVisible(false)
  }
  searchNeighbor = () => {
    Animated.timing(this.height, {
      toValue: scaleSize(340),
      duration: 400,
    }).start()
    Animated.timing(this.boxHeight, {
      toValue: scaleSize(this.props.device.height * 2),
      duration: 10,
    }).start()
    this.setState({
      showList: true,
    })
  }

  renderView = () => {
    let closeIcon = require('../../../../assets/mapTools/icon_close_black.png')
    return (
      <View
        style={{
          flex: 1,
        }}
      >
        <TouchableOpacity
          onPress={() => {
            this.close()
          }}
          style={styles.closeBox}
        >
          <Image
            source={closeIcon}
            style={styles.closeBtn}
            resizeMode={'contain'}
          />
        </TouchableOpacity>
        <View>
          <Text style={styles.title}>{this.state.destination}</Text>
        </View>
        <View>
          <Text style={styles.info}>{this.state.address}</Text>
        </View>
        <TouchableOpacity
          activeOpacity={0.5}
          style={styles.search}
          onPress={() => {
            this.searchNeighbor()
          }}
        >
          <Text style={styles.searchTxt}>搜周边</Text>
        </TouchableOpacity>
      </View>
    )
  }

  renderTable = () => {
    let data = PoiData()
    let renderIcons = ({ item }) => {
      return (
        <TouchableOpacity
          onPress={async () => {
            this.getSearchResult({
              keyWords: item.title,
              location: JSON.stringify(this.state.location),
              radius: this.state.radius,
            })
          }}
          style={styles.searchIconWrap}
        >
          <Image
            style={styles.searchIcon}
            source={item.icon}
            resizeMode={'contain'}
          />
          <Text style={styles.iconTxt}>{item.title}</Text>
        </TouchableOpacity>
      )
    }

    return (
      <FlatList
        style={styles.wrapper}
        renderItem={renderIcons}
        data={data}
        keyExtractor={(item, index) => item.title + index}
        numColumns={4}
      />
    )
  }

  renderList = () => {
    let img = require('../../../../assets/mapToolbar/icon_scene_position.png')
    let renderList = ({ item }) => {
      return (
        <View>
          <TouchableOpacity
            style={styles.itemView}
            onPress={() => {
              SMap.setCenterCallout(item)
              //this.toLocationPoint({item,pointName:item.pointName, index})
            }}
          >
            <Image style={styles.pointImg} source={img} />
            {item.pointName && (
              <Text style={styles.itemText}>{item.pointName}</Text>
            )}
            {item.distance && (
              <Text style={styles.distance}>{item.distance}</Text>
            )}
          </TouchableOpacity>
          <View style={styles.itemSeparator} />
        </View>
      )
    }
    return (
      <FlatList
        style={styles.wrapper}
        renderItem={renderList}
        data={this.state.resultList}
        keyExtractor={(item, index) => item.pointName + index}
        numColumns={1}
      />
    )
  }

  render() {
    return (
      <Animated.View
        style={{
          ...styles.box,
          bottom: this.bottom,
          height: this.boxHeight,
        }}
      >
        <TouchableOpacity
          onPress={() => {
            this.close()
          }}
          style={styles.overlayer}
        />
        <Animated.View
          style={{
            ...styles.container,
            height: this.height,
          }}
        >
          {!this.state.showList && this.renderView()}
          {this.state.showList &&
            this.state.resultList.length === 0 &&
            this.renderTable()}
          {this.state.showList &&
            this.state.resultList.length !== 0 &&
            this.renderList()}
        </Animated.View>
      </Animated.View>
    )
  }
}
