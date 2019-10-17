import * as React from 'react'
import {
  View,
  Text,
  TouchableOpacity,
  Animated,
  FlatList,
  Image,
} from 'react-native'
import { scaleSize, setSpText } from '../../../../utils'
import color from '../../../../styles/color'
import { SMap } from 'imobile_for_reactnative'
import { getPublicAssets } from '../../../../assets'

export default class NavigationStartButton extends React.Component {
  props: {}

  constructor(props) {
    super(props)
    this.state = {
      show: false,
      isroad: true,
      road: '路线详情',
      height: new Animated.Value(scaleSize(200)),
      length: '',
    }
    this.directions = [
      '直行',
      '左前转弯',
      '右前转弯',
      '左转弯',
      '右转弯',
      '左后转弯',
      '右后转弯',
      '调头',
      '右转弯绕行至左',
      '直角斜边右转弯',
      '进入环岛',
      '出环岛',
      '到达目的地',
      '电梯上行',
      '电梯下行',
      '扶梯上行',
      '扶梯下行',
      '楼梯上行',
      '楼梯下行',
      '到达途径点',
    ]
  }

  setVisible = iShow => {
    this.setState({ show: iShow })
  }

  changeHeight = () => {
    if (this.state.isroad) {
      this.setState(
        {
          road: '显示地图',
          isroad: false,
        },
        () => {
          Animated.timing(this.state.height, {
            toValue: scaleSize(650),
            duration: 300,
          }).start()
        },
      )
    } else {
      this.setState(
        {
          road: '路线详情',
          isroad: true,
        },
        () => {
          Animated.timing(this.state.height, {
            toValue: scaleSize(200),
            duration: 300,
          }).start()
        },
      )
    }
  }

  getIconByType = type => {
    let icon
    switch (type) {
      case 'start':
        icon = getPublicAssets().navigation.icon_nav_start
        break
      case 'end':
        icon = getPublicAssets().navigation.icon_nav_end
        break
      case 0:
        break
      case 1:
        break
      case 2:
        break
      case 3:
        break
      case 4:
        break
      case 5:
        break
      case 6:
        break
      case 7:
        break
      case 8:
        break
      case 9:
        break
      case 10:
        break
      case 11:
        break
      case 12:
        break
      case 13:
        break
      case 14:
        break
      case 15:
        break
      case 16:
        break
      case 17:
        break
      case 18:
        break
      case 19:
        break
    }
    return icon
  }
  renderItem = ({ item }) => {
    let roadLength = item.roadLength
    if (roadLength > 1000) roadLength = (roadLength / 1000).toFixed(2) + '公里'
    else roadLength = roadLength + '米'
    let str = ''
    if (item.turnType === 'start' || item.turnType === 'end') {
      str = item.text
    } else if (item.turnType === 0) {
      str = `${this.directions[item.turnType]} ${roadLength}`
    } else if (item.turnType === 12) {
      str = `直行${roadLength}`
    } else {
      str = `${roadLength}后 ${this.directions[item.turnType]}`
    }
    let icon = this.getIconByType(item.turnType)
    return (
      <View>
        <View
          style={{
            flexDirection: 'row',
            alignItems: 'center',
            height: scaleSize(50),
          }}
        >
          {icon && (
            <Image
              style={{
                width: scaleSize(40),
                height: scaleSize(40),
              }}
              source={icon}
              resizeMode={'contain'}
            />
          )}
          <Text
            style={{
              marginLeft: scaleSize(10),
              fontSize: setSpText(20),
            }}
          >
            {str}
          </Text>
        </View>
      </View>
    )
  }

  renderMap = () => {
    let length = GLOBAL.PATHLENGTH.length
    if (length > 1000) length = (length / 1000).toFixed(2) + '公里'
    else length = length.toFixed(2)
    return (
      <View style={{ flex: 1, width: '100%' }}>
        {
          <Text style={{ paddingTop: scaleSize(20), fontSize: setSpText(20) }}>
            {'距离:' + length}
          </Text>
        }
        {this.renderRoad()}
      </View>
    )
  }

  renderRoad = () => {
    let data = [
      { text: '从起点出发', turnType: 'start' },
      ...GLOBAL.PATH,
      { text: '到达目的地', turnType: 'end' },
    ]
    return (
      <View>
        {!this.state.isroad && (
          <View
            style={{
              flexDirection: 'column',
              width: '100%',
              height: scaleSize(400),
            }}
          >
            <FlatList data={data} renderItem={this.renderItem} />
          </View>
        )}
      </View>
    )
  }

  renderHeader = () => {
    return (
      <View>
        <Text style={{ fontSize: setSpText(24) }}>{GLOBAL.ENDPOINT}</Text>
      </View>
    )
  }

  render() {
    if (this.state.show) {
      return (
        <Animated.View
          style={[
            {
              position: 'absolute',
              left: 0,
              right: 0,
              bottom: 0,
              height: scaleSize(200),
              padding: scaleSize(20),
              backgroundColor: color.contentWhite,
            },
            { height: this.state.height },
          ]}
        >
          {this.renderHeader()}
          {this.renderMap()}
          <View
            style={{
              height: scaleSize(80),
              flexDirection: 'row',
              // marginTop: scaleSize(20),
            }}
          >
            <TouchableOpacity
              activeOpacity={0.5}
              style={{
                height: scaleSize(60),
                flex: 1,
                borderRadius: 5,
                backgroundColor: color.blue1,
                justifyContent: 'center',
                alignItems: 'center',
                marginTop: scaleSize(20),
              }}
              onPress={() => {
                this.changeHeight()
              }}
            >
              <Text
                style={{
                  fontSize: setSpText(20),
                  color: color.white,
                }}
              >
                {this.state.road}
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              activeOpacity={0.5}
              style={{
                marginLeft: scaleSize(20),
                height: scaleSize(60),
                flex: 1,
                borderRadius: 5,
                backgroundColor: color.blue1,
                justifyContent: 'center',
                alignItems: 'center',
                marginTop: scaleSize(20),
              }}
              onPress={() => {
                this.setVisible(false)
                GLOBAL.NAVIGATIONSTARTHEAD.setVisible(false)
                if (!GLOBAL.INDOORSTART && !GLOBAL.INDOOREND) {
                  SMap.outdoorNavigation(true)
                }
                if (GLOBAL.INDOORSTART && GLOBAL.INDOOREND) {
                  SMap.indoorNavigation(true)
                }
              }}
            >
              <Text
                style={{
                  fontSize: setSpText(20),
                  color: color.white,
                }}
              >
                第一人称
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              activeOpacity={0.5}
              style={{
                marginLeft: scaleSize(20),
                height: scaleSize(60),
                flex: 1,
                borderRadius: 5,
                backgroundColor: color.blue1,
                justifyContent: 'center',
                alignItems: 'center',
                marginTop: scaleSize(20),
              }}
              onPress={() => {
                this.setVisible(false)
                GLOBAL.NAVIGATIONSTARTHEAD.setVisible(false)
                if (!GLOBAL.INDOORSTART && !GLOBAL.INDOOREND) {
                  SMap.outdoorNavigation(false)
                }
                if (GLOBAL.INDOORSTART && GLOBAL.INDOOREND) {
                  SMap.indoorNavigation(false)
                }
              }}
            >
              <Text
                style={{
                  fontSize: setSpText(20),
                  color: color.white,
                }}
              >
                第三人称
              </Text>
            </TouchableOpacity>
          </View>
        </Animated.View>
      )
    } else {
      return <View />
    }
  }
}
