import * as React from 'react'
import { View, Image, TouchableOpacity, Text, Platform } from 'react-native'
import { scaleSize, setSpText } from '../../../../utils'
import styles from './styles'
import { TouchType } from '../../../../constants'
import { color } from '../../../../styles'
import { SMap } from 'imobile_for_reactnative'
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
      firstPoint: '选择起点',
      secondPoint: '选择终点',
    })
    GLOBAL.STARTX = undefined
    GLOBAL.ENDX = undefined
    GLOBAL.ROUTEANALYST = undefined
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
            }}
          >
            <Image
              resizeMode={'contain'}
              source={require('../../../../assets/public/Frenchgrey/icon-back-white.png')}
              style={styles.backbtn}
            />
          </TouchableOpacity>
          <View style={styles.pointAnalystView}>
            <View style={{ flexDirection: 'column', alignItems: 'flex-start' }}>
              <View
                style={{
                  flexDirection: 'row',
                  justifyContent: 'flex-start',
                  alignItems: 'center',
                }}
              >
                <Image
                  resizeMode={'contain'}
                  source={require('../../../../assets/Navigation/icon_tool_start.png')}
                  style={styles.startPoint}
                />
                <TouchableOpacity
                  style={styles.onInput}
                  onPress={async () => {
                    GLOBAL.TouchType = TouchType.NAVIGATION_TOUCH_BEGIN
                    GLOBAL.MAPSELECTPOINT.setVisible(true)
                    GLOBAL.MAPSELECTPOINTBUTTON.setVisible(
                      true,
                      {
                        button: '设为起点',
                      },
                      false,
                    )
                    this.setVisible(false)
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
                  marginLeft: scaleSize(20),
                  width: scaleSize(300),
                  height: 2,
                  backgroundColor: color.gray,
                }}
              />
              <View
                style={{
                  flexDirection: 'row',
                  justifyContent: 'flex-start',
                  alignItems: 'center',
                }}
              >
                <Image
                  resizeMode={'contain'}
                  source={require('../../../../assets/Navigation/icon_tool_end.png')}
                  style={styles.endPoint}
                />
                <TouchableOpacity
                  style={styles.secondInput}
                  onPress={async () => {
                    GLOBAL.TouchType = TouchType.NAVIGATION_TOUCH_END
                    GLOBAL.MAPSELECTPOINT.setVisible(true)
                    GLOBAL.MAPSELECTPOINTBUTTON.setVisible(
                      true,
                      {
                        button: '设为终点',
                      },
                      false,
                    )
                    this.setVisible(false)
                    GLOBAL.NAVIGATIONSTARTBUTTON.setVisible(false)
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
