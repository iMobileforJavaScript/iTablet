import * as React from 'react'
import { View, Image, TouchableOpacity, Text, Platform } from 'react-native'
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
    selectPoint: Object,
    changeMapSelectPoint: () => {},
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
    this.setVisible(false)
    GLOBAL.NAVIGATIONSTARTBUTTON.setVisible(false)
    GLOBAL.toolBox.existFullMap()
    await SMap.clearPoint()
    this.props.setMapNavigation({
      isShow: false,
      name: '',
    })
    this.props.changeMapSelectPoint({
      startPoint: getLanguage(GLOBAL.language).Map_Main_Menu.SELECT_START_POINT,
      endPoint: getLanguage(GLOBAL.language).Map_Main_Menu.SELECT_DESTINATION,
    })
    GLOBAL.STARTX = undefined
    GLOBAL.ENDX = undefined
    GLOBAL.ROUTEANALYST = undefined
    GLOBAL.FloorListView && GLOBAL.FloorListView.changeBottom(false)
  }

  _renderSearchView = () => {
    if (this.state.show) {
      return (
        <View
          style={{
            paddingTop: TOOLBARHEIGHT + scaleSize(20),
            height: scaleSize(185) + TOOLBARHEIGHT,
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
                  onPress={async () => {
                    GLOBAL.TouchType = TouchType.NAVIGATION_TOUCH_BEGIN
                    GLOBAL.MAPSELECTPOINT.setVisible(true)
                    GLOBAL.MAPSELECTPOINTBUTTON.setVisible(
                      true,
                      {
                        button: getLanguage(GLOBAL.language).Map_Main_Menu
                          .SET_AS_START_POINT,
                      },
                      false,
                    )
                    this.setVisible(false)
                    !GLOBAL.INDOORSTART &&
                      GLOBAL.LocationView &&
                      GLOBAL.LocationView.setVisible(true, true)
                    GLOBAL.NAVIGATIONSTARTBUTTON.setVisible(false)
                    await SMap.clearPoint()
                  }}
                >
                  <Text
                    numberOfLines={2}
                    ellipsizeMode={'tail'}
                    style={{ fontSize: setSpText(24) }}
                  >
                    {this.props.selectPoint.startPoint}
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
                  onPress={async () => {
                    GLOBAL.TouchType = TouchType.NAVIGATION_TOUCH_END
                    GLOBAL.MAPSELECTPOINT.setVisible(true)
                    GLOBAL.MAPSELECTPOINTBUTTON.setVisible(
                      true,
                      {
                        button: getLanguage(GLOBAL.language).Map_Main_Menu
                          .SET_AS_DESTINATION,
                      },
                      false,
                    )
                    this.setVisible(false)
                    GLOBAL.NAVIGATIONSTARTBUTTON.setVisible(false)
                    !GLOBAL.INDOOREND &&
                      GLOBAL.LocationView &&
                      GLOBAL.LocationView.setVisible(true, false)
                    await SMap.clearPoint()
                  }}
                >
                  <Text
                    numberOfLines={2}
                    ellipsizeMode={'tail'}
                    style={{ fontSize: setSpText(24) }}
                  >
                    {this.props.selectPoint.endPoint}
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
