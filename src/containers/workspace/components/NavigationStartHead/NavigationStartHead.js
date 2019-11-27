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
    mapSelectPoint: Object,
    setMapSelectPoint: () => {},
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
    this.props.setMapSelectPoint({
      firstPoint: getLanguage(GLOBAL.language).Map_Main_Menu.SELECT_START_POINT,
      secondPoint: getLanguage(GLOBAL.language).Map_Main_Menu
        .SELECT_DESTINATION,
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
            paddingTop: TOOLBARHEIGHT,
            height: scaleSize(165) + TOOLBARHEIGHT,
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
              width: 60,
              padding: 5,
              marginLeft: scaleSize(20),
              alignItems: 'center',
              justifyContent: 'center',
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
                    width: scaleSize(8),
                    height: scaleSize(8),
                    borderRadius: scaleSize(4),
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
                    style={{ fontSize: setSpText(20) }}
                  >
                    {this.props.mapSelectPoint.firstPoint}
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
                    width: scaleSize(8),
                    height: scaleSize(8),
                    borderRadius: scaleSize(4),
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
                    style={{ fontSize: setSpText(20) }}
                  >
                    {this.props.mapSelectPoint.secondPoint}
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
