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

  setVisible = (iShow, isOnline = false) => {
    this.setState({ show: iShow })
    this.isOnline = isOnline
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
  realNavigation = async () => {
    if (this.isOnline) {
      Toast.show(
        getLanguage(GLOBAL.language).Prompt.NOT_SUPPORT_ONLINE_NAVIGATION,
      )
      return
    }
    let position = await SMap.getCurrentPosition()
    if (GLOBAL.CURRENT_NAV_MODE === 'INDOOR') {
      let isindoor = await SMap.isIndoorPoint(position.x, position.y)
      if (isindoor) {
        SMap.indoorNavigation(0)
        this.setVisible(false)
        GLOBAL.NAVIGATIONSTARTHEAD.setVisible(false)
      } else {
        Toast.show(getLanguage(GLOBAL.language).Prompt.POSITION_OUT_OF_MAP)
      }
    } else if (GLOBAL.CURRENT_NAV_MODE === 'OUTDOOR') {
      let naviData = this.props.getNavigationDatas()
      let isInBounds = await SMap.isInBounds(position, naviData.selectedDataset)
      if (isInBounds) {
        SMap.outdoorNavigation(0)
        this.setVisible(false)
        GLOBAL.NAVIGATIONSTARTHEAD.setVisible(false)
      } else {
        Toast.show(getLanguage(GLOBAL.language).Prompt.POSITION_OUT_OF_MAP)
      }
    }
  }

  simulatedNavigation = async () => {
    if (this.isOnline) {
      Toast.show(
        getLanguage(GLOBAL.language).Prompt.NOT_SUPPORT_ONLINE_NAVIGATION,
      )
      return
    }
    this.setVisible(false)
    GLOBAL.NAVIGATIONSTARTHEAD.setVisible(false)
    if (GLOBAL.CURRENT_NAV_MODE === 'OUTDOOR') {
      SMap.outdoorNavigation(1)
    } else if (GLOBAL.CURRENT_NAV_MODE === 'INDOOR') {
      SMap.indoorNavigation(1)
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
        icon = getPublicAssets().navigation.icon_go_straight
        break
      case 1:
        icon = getPublicAssets().navigation.icon_front_left_turn
        break
      case 2:
        icon = getPublicAssets().navigation.icon_front_right_turn
        break
      case 3:
        icon = getPublicAssets().navigation.icon_turn_left
        break
      case 4:
        icon = getPublicAssets().navigation.icon_turn_right
        break
      case 5:
        icon = getPublicAssets().navigation.icon_back_left_turn
        break
      case 6:
        icon = getPublicAssets().navigation.icon_back_right_turn
        break
      case 7:
        icon = getPublicAssets().navigation.icon_U_turn
        break
      case 8:
      case 9:
        icon = null
        break
      case 10:
        icon = getPublicAssets().navigation.icon_enter_roundabout
        break
      case 11:
        icon = getPublicAssets().navigation.icon_exit_roundabout
        break
      case 12:
        icon = getPublicAssets().navigation.icon_arrive_destination
        break
      case 13:
        icon = getPublicAssets().navigation.icon_elevator_up
        break
      case 14:
        icon = getPublicAssets().navigation.icon_elevator_down
        break
      case 15:
        icon = getPublicAssets().navigation.icon_escalator_up
        break
      case 16:
        icon = getPublicAssets().navigation.icon_escalator_down
        break
      case 17:
        icon = getPublicAssets().navigation.icon_stairs_up
        break
      case 18:
        icon = getPublicAssets().navigation.icon_stairs_down
        break
      case 19:
        icon = getPublicAssets().navigation.icon_route_point
        break
    }
    return icon
  }
  renderItem = ({ item }) => {
    let roadLength = item.roadLength || item.length
    let turnType =
      item.turnType !== undefined ? item.turnType : item.dirToSwerve
    if (roadLength > 1000)
      roadLength =
        (roadLength / 1000).toFixed(1) +
        getLanguage(GLOBAL.language).Map_Main_Menu.KILOMETERS
    else
      roadLength =
        (roadLength || 1) + getLanguage(GLOBAL.language).Map_Main_Menu.METERS
    let str = ''
    let thenInfo = GLOBAL.language === 'CN' ? '然后' : 'and then'
    if (turnType === 'start' || turnType === 'end') {
      str = item.text
    } else if (turnType === 0) {
      str = `${this.directions[turnType]} ${roadLength}`
    } else if (turnType === 12) {
      str = `${
        getLanguage(GLOBAL.language).Map_Main_Menu.GO_STRAIGHT
      }${roadLength}`
    } else {
      str = `${
        getLanguage(GLOBAL.language).Map_Main_Menu.GO_STRAIGHT
      } ${roadLength} ${thenInfo} ${this.directions[turnType]}`
    }
    if (item.routeName && GLOBAL.language === 'CN') {
      str = `沿${item.routeName}${str}`
    }
    let icon = this.getIconByType(turnType)
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
          {GLOBAL.ENDNAME}
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
              onPress={() => {
                this.realNavigation()
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
                this.simulatedNavigation()
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
