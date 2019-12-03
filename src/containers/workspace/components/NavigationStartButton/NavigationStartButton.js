import * as React from 'react'
import {
  View,
  Text,
  TouchableOpacity,
  Animated,
  FlatList,
  Image,
} from 'react-native'
import { scaleSize, setSpText, Toast } from '../../../../utils'
import color from '../../../../styles/color'
import { SMap } from 'imobile_for_reactnative'
import { getPublicAssets } from '../../../../assets'
import { getLanguage } from '../../../../language'

export default class NavigationStartButton extends React.Component {
  props: {
    pathLength: Object,
    path: Array,
    getNavigationDatas: () => {},
  }
  static defaultProps = {
    pathLength: { length: 0 },
    path: [],
  }

  constructor(props) {
    super(props)
    this.state = {
      show: false,
      isroad: true,
      road: getLanguage(GLOBAL.language).Map_Main_Menu.ROAD_DETAILS,
      height: new Animated.Value(scaleSize(200)),
      length: '',
    }

    this.directions =
      GLOBAL.language === 'CN'
        ? [
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
        : [
          'go straight',
          'front-left turn',
          'front-right turn',
          'turn left',
          'turn right',
          'back-left turn',
          'back-right turn',
          'U-turn',
          'turn right and turn around to the left',
          'right angle bevel right turn',
          'enter the roundabout',
          'going out the roundabout',
          'arrive at the destination',
          'take the elevator up',
          'take the elevator down',
          'take the escalator up',
          'take the escalator down',
          'take the stairs up',
          'take the stairs down',
          'arrival route point',
        ]
  }

  setVisible = iShow => {
    this.setState({ show: iShow })
  }

  changeHeight = () => {
    if (this.state.isroad) {
      this.setState(
        {
          road: getLanguage(GLOBAL.language).Map_Main_Menu.DISPLAY_MAP,
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
          road: getLanguage(GLOBAL.language).Map_Main_Menu.ROAD_DETAILS,
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

  //todo 各种方向相关的符号没图
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
    if (roadLength > 1000)
      roadLength =
        (roadLength / 1000).toFixed(1) +
        getLanguage(GLOBAL.language).Map_Main_Menu.KILOMETERS
    else
      roadLength =
        (roadLength || 1) + getLanguage(GLOBAL.language).Map_Main_Menu.METERS
    let str = ''
    let thenInfo = GLOBAL.language === 'CN' ? '然后' : 'and then'
    if (item.turnType === 'start' || item.turnType === 'end') {
      str = item.text
    } else if (item.turnType === 0) {
      str = `${this.directions[item.turnType]} ${roadLength}`
    } else if (item.turnType === 12) {
      str = `${
        getLanguage(GLOBAL.language).Map_Main_Menu.GO_STRAIGHT
      }${roadLength}`
    } else {
      str = `${
        getLanguage(GLOBAL.language).Map_Main_Menu.GO_STRAIGHT
      } ${roadLength} ${thenInfo} ${this.directions[item.turnType]}`
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
    let length = this.props.pathLength.length
    if (length > 1000)
      length =
        (length / 1000).toFixed(1) +
        getLanguage(GLOBAL.language).Map_Main_Menu.KILOMETERS
    else length = length + getLanguage(GLOBAL.language).Map_Main_Menu.METERS
    return (
      <View style={{ flex: 1, width: '100%' }}>
        {
          <Text style={{ paddingTop: scaleSize(20), fontSize: setSpText(20) }}>
            {getLanguage(GLOBAL.language).Map_Main_Menu.DISTANCE + length}
          </Text>
        }
        {this.renderRoad()}
      </View>
    )
  }

  renderRoad = () => {
    let data = [
      {
        text: getLanguage(GLOBAL.language).Map_Main_Menu.START_FROM_START_POINT,
        turnType: 'start',
      },
      ...this.props.path,
      {
        text: getLanguage(GLOBAL.language).Map_Main_Menu
          .ARRIVE_AT_THE_DESTINATION,
        turnType: 'end',
      },
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
            <FlatList
              data={data}
              renderItem={this.renderItem}
              keyExtractor={(item, index) => item.toString() + index}
            />
          </View>
        )}
      </View>
    )
  }

  renderHeader = () => {
    return (
      <View>
        <Text
          style={{ fontSize: setSpText(24) }}
          numberOfLines={1}
          ellipsizeMode={'tail'}
        >
          {GLOBAL.ENDPOINT}
        </Text>
      </View>
    )
  }

  render() {
    if (this.state.show) {
      return (
        <Animated.View
          style={{
            position: 'absolute',
            left: 0,
            right: 0,
            bottom: 0,
            elevation: 100,
            padding: scaleSize(20),
            backgroundColor: color.contentWhite,
            height: this.state.height,
          }}
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
              onPress={async () => {
                let position = await SMap.getCurrentPosition()
                if (GLOBAL.INDOORSTART && GLOBAL.INDOOREND) {
                  let rel = await SMap.isIndoorPoint(position.x, position.y)
                  if (rel.isindoor) {
                    SMap.indoorNavigation(0)
                    this.setVisible(false)
                    GLOBAL.NAVIGATIONSTARTHEAD.setVisible(false)
                  } else {
                    Toast.show(
                      getLanguage(GLOBAL.language).Prompt.POSITION_OUT_OF_MAP,
                    )
                  }
                } else if (!GLOBAL.INDOORSTART && !GLOBAL.INDOOREND) {
                  let naviData = this.props.getNavigationDatas()
                  let isInBounds = await SMap.isInBounds(
                    position,
                    naviData.selectedDataset,
                  )
                  if (isInBounds) {
                    SMap.outdoorNavigation(0)
                    this.setVisible(false)
                    GLOBAL.NAVIGATIONSTARTHEAD.setVisible(false)
                  } else {
                    Toast.show(
                      getLanguage(GLOBAL.language).Prompt.POSITION_OUT_OF_MAP,
                    )
                  }
                }
              }}
            >
              <Text
                style={{
                  fontSize: setSpText(20),
                  color: color.white,
                }}
              >
                {getLanguage(GLOBAL.language).Map_Main_Menu.REAL_NAVIGATION}
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
                  SMap.outdoorNavigation(1)
                }
                if (GLOBAL.INDOORSTART && GLOBAL.INDOOREND) {
                  SMap.indoorNavigation(1)
                }
              }}
            >
              <Text
                style={{
                  fontSize: setSpText(20),
                  color: color.white,
                }}
              >
                {
                  getLanguage(GLOBAL.language).Map_Main_Menu
                    .SIMULATED_NAVIGATION
                }
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
