import * as React from 'react'
import {
  View,
  Image,
  TouchableOpacity,
  Text,
  Platform,
  Animated,
} from 'react-native'
import { scaleSize, setSpText } from '../../../../utils'
import styles from './styles'
import { TouchType } from '../../../../constants'
import { color } from '../../../../styles'
import { SMap } from 'imobile_for_reactnative'
import { getLanguage } from '../../../../language'
// import NavigationService from '../../../../containers/NavigationService'
const TOOLBARHEIGHT = Platform.OS === 'ios' ? scaleSize(20) : 0
export default class NavigationStartHead extends React.Component {
  props: {
    setMapNavigation: () => {},
  }

  constructor(props) {
    super(props)
    this.state = {
      show: false,
    }
  }

  setVisible = iShow => {
    this.setState({ show: iShow })
  }

  close = async () => {
    await SMap.clearTrackingLayer()
    this.setVisible(false)
    GLOBAL.NAVIGATIONSTARTBUTTON.setState({
      show: false,
      isroad: true,
      road: getLanguage(GLOBAL.language).Map_Main_Menu.ROAD_DETAILS,
      height: new Animated.Value(scaleSize(200)),
      length: '',
    })
    GLOBAL.toolBox.existFullMap()
    this.props.setMapNavigation({
      isShow: false,
      name: '',
    })
    GLOBAL.STARTNAME = getLanguage(
      GLOBAL.language,
    ).Map_Main_Menu.SELECT_START_POINT
    GLOBAL.ENDNAME = getLanguage(
      GLOBAL.language,
    ).Map_Main_Menu.SELECT_DESTINATION
    GLOBAL.STARTX = undefined
    GLOBAL.STARTY = undefined
    GLOBAL.ENDX = undefined
    GLOBAL.ENDY = undefined
    GLOBAL.CURRENT_NAV_MODE = ''
    GLOBAL.NAV_PARAMS = []
    GLOBAL.ROUTEANALYST = undefined
    GLOBAL.TouchType = TouchType.NORMAL
    await SMap.clearPoint()
    GLOBAL.mapController && GLOBAL.mapController.changeBottom(false)
  }

  _onSelectPointPress = async isStart => {
    let button = isStart
      ? getLanguage(GLOBAL.language).Map_Main_Menu.SET_AS_START_POINT
      : getLanguage(GLOBAL.language).Map_Main_Menu.SET_AS_DESTINATION
    GLOBAL.TouchType = isStart
      ? TouchType.NAVIGATION_TOUCH_BEGIN
      : TouchType.NAVIGATION_TOUCH_END
    GLOBAL.MAPSELECTPOINT.setVisible(true)
    GLOBAL.MAPSELECTPOINTBUTTON.setVisible(
      true,
      {
        button,
      },
      false,
    )
    this.setVisible(false)
    GLOBAL.NAVIGATIONSTARTBUTTON.setVisible(false)
    await SMap.clearTrackingLayer()
    await SMap.clearPoint()
    if (isStart) {
      GLOBAL.STARTX = null
      GLOBAL.STARTY = null
      GLOBAL.STRATNAME = null
    } else {
      GLOBAL.ENDX = null
      GLOBAL.ENDY = null
      GLOBAL.ENDNAME = null
    }
  }
  _renderSearchView = () => {
    if (this.state.show) {
      return (
        <View
          style={{
            paddingTop: TOOLBARHEIGHT + scaleSize(20),
            height: scaleSize(205) + TOOLBARHEIGHT,
            width: '100%',
            backgroundColor: '#303030',
            flexDirection: 'row',
            position: 'absolute',
            top: 0,
          }}
        >
          <TouchableOpacity
            onPress={() => {
              this.close()
            }}
            style={{
              width: scaleSize(60),
              alignItems: 'center',
              paddingTop: scaleSize(10),
              justifyContent: 'flex-start',
            }}
          >
            <Image
              resizeMode={'contain'}
              source={require('../../../../assets/public/Frenchgrey/icon-back-white.png')}
              style={styles.backbtn}
            />
          </TouchableOpacity>
          <View style={styles.pointAnalystView}>
            <View
              style={{
                flexDirection: 'column',
                alignItems: 'flex-start',
                flex: 1,
                marginHorizontal: scaleSize(20),
              }}
            >
              <View
                style={{
                  flexDirection: 'row',
                  justifyContent: 'flex-start',
                  alignItems: 'center',
                  flex: 1,
                }}
              >
                <View
                  style={{
                    width: scaleSize(12),
                    height: scaleSize(12),
                    borderRadius: scaleSize(6),
                    marginRight: scaleSize(20),
                    backgroundColor: '#0dc66d',
                  }}
                />
                <TouchableOpacity
                  style={styles.onInput}
                  onPress={() => {
                    this._onSelectPointPress(true)
                  }}
                >
                  <Text
                    numberOfLines={2}
                    ellipsizeMode={'tail'}
                    style={{ fontSize: setSpText(24) }}
                  >
                    {GLOBAL.STARTNAME}
                  </Text>
                </TouchableOpacity>
              </View>
              <View
                style={{
                  width: '100%',
                  height: 2,
                  backgroundColor: color.gray,
                }}
              />
              <View
                style={{
                  flexDirection: 'row',
                  justifyContent: 'flex-start',
                  alignItems: 'center',
                  flex: 1,
                }}
              >
                <View
                  style={{
                    width: scaleSize(12),
                    height: scaleSize(12),
                    borderRadius: scaleSize(6),
                    marginRight: scaleSize(20),
                    backgroundColor: '#f14343',
                  }}
                />
                <TouchableOpacity
                  style={styles.secondInput}
                  onPress={() => {
                    this._onSelectPointPress(false)
                  }}
                >
                  <Text
                    numberOfLines={2}
                    ellipsizeMode={'tail'}
                    style={{ fontSize: setSpText(24) }}
                  >
                    {GLOBAL.ENDNAME}
                  </Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </View>
      )
    } else {
      return <View />
    }
  }

  render() {
    return this._renderSearchView()
  }
}
