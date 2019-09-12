import * as React from 'react'
import { View, Image, TouchableOpacity, Text, FlatList } from 'react-native'
import { scaleSize, setSpText, Toast } from '../../../../utils'
// import { getLanguage } from '../../../../language/index'
import NavigationService from '../../../../containers/NavigationService'
import { MTBtn } from '../../../../components'
import { TouchType } from '../../../../constants'
import styles from './styles'
import { color } from '../../../../styles'
import PropTypes from 'prop-types'
import { SMap } from 'imobile_for_reactnative'

export default class NavigationView extends React.Component {
  static propTypes = {
    mapNavigation: PropTypes.object,
    setMapNavigation: PropTypes.func,
    mapSelectPoint: PropTypes.object,
    setMapSelectPoint: PropTypes.func,
    setNavigationHistory: PropTypes.func,
    navigationhistory: PropTypes.array,
  }

  constructor(props) {
    super(props)
    this.PointType = null
  }

  componentDidMount() {
    SMap.setStartPointNameListener({
      callback: result => {
        this.props.setMapSelectPoint({
          firstPoint: result,
          secondPoint: this.props.mapSelectPoint.secondPoint,
        })
      },
    })
    SMap.setEndPointNameListener({
      callback: result => {
        this.props.setMapSelectPoint({
          firstPoint: this.props.mapSelectPoint.firstPoint,
          secondPoint: result,
        })
      },
    })
  }

  close = () => {
    this.props.setMapNavigation({ isShow: false, name: '' })
    GLOBAL.MAPSELECTPOINT.setVisible(false)
    GLOBAL.MAPSELECTPOINTBUTTON.setVisible(false)
    NavigationService.goBack()
  }

  _renderSearchView = () => {
    return (
      <View style={{ flex: 1, backgroundColor: color.background }}>
        <View
          style={{
            height: scaleSize(165),
            width: '100%',
            backgroundColor: '#303030',
            flexDirection: 'row',
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
                    GLOBAL.MAPSELECTPOINTBUTTON.setVisible(true, {
                      button: '设为起点',
                    })
                    GLOBAL.toolBox.showFullMap(true)
                    this.props.setMapNavigation({
                      isShow: true,
                      name: '',
                    })
                    NavigationService.goBack()
                  }}
                >
                  <Text style={{ fontSize: setSpText(20) }}>
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
                    GLOBAL.MAPSELECTPOINTBUTTON.setVisible(true, {
                      button: '设为终点',
                    })
                    GLOBAL.toolBox.showFullMap(true)
                    this.props.setMapNavigation({
                      isShow: true,
                      name: '',
                    })
                    NavigationService.goBack()
                  }}
                >
                  <Text style={{ fontSize: setSpText(20) }}>
                    {this.props.mapSelectPoint.secondPoint}
                  </Text>
                </TouchableOpacity>
              </View>
            </View>

            <MTBtn
              style={styles.btn}
              size={MTBtn.Size.NORMAL}
              image={require('../../../../assets/Navigation/navi_icon.png')}
              onPress={() => {
                GLOBAL.TouchType = TouchType.NORMAL
                if (!GLOBAL.INDOORSTART && !GLOBAL.INDOOREND) {
                  if (GLOBAL.STARTX !== undefined) {
                    SMap.beginNavigation(
                      GLOBAL.STARTX,
                      GLOBAL.STARTY,
                      GLOBAL.ENDX,
                      GLOBAL.ENDY,
                    )
                    GLOBAL.MAPSELECTPOINT.setVisible(false)
                    GLOBAL.MAPSELECTPOINTBUTTON.setVisible(false, {
                      button: '',
                    })
                    this.props.setMapNavigation({
                      isShow: true,
                      name: '',
                    })
                    GLOBAL.toolBox.showFullMap(true)
                    let history = this.props.navigationhistory
                    history.push({
                      sx: GLOBAL.STARTX,
                      sy: GLOBAL.STARTY,
                      ex: GLOBAL.ENDX,
                      ey: GLOBAL.ENDY,
                      address:
                        this.props.mapSelectPoint.firstPoint +
                        '---' +
                        this.props.mapSelectPoint.secondPoint,
                    })
                    this.props.setNavigationHistory(history)
                    NavigationService.goBack()
                  } else {
                    Toast.show('请先设置起终点')
                  }
                }
                if (GLOBAL.INDOORSTART && GLOBAL.INDOOREND) {
                  if (GLOBAL.STARTX !== undefined) {
                    SMap.beginIndoorNavigation(
                      GLOBAL.STARTX,
                      GLOBAL.STARTY,
                      GLOBAL.ENDX,
                      GLOBAL.ENDY,
                    )
                    GLOBAL.MAPSELECTPOINT.setVisible(false)
                    GLOBAL.MAPSELECTPOINTBUTTON.setVisible(false, {
                      button: '',
                    })
                    this.props.setMapNavigation({
                      isShow: true,
                      name: '',
                    })
                    GLOBAL.toolBox.showFullMap(true)
                    let history = this.props.navigationhistory
                    history.push({
                      sx: GLOBAL.STARTX,
                      sy: GLOBAL.STARTY,
                      ex: GLOBAL.ENDX,
                      ey: GLOBAL.ENDY,
                      address:
                        this.props.mapSelectPoint.firstPoint +
                        '---' +
                        this.props.mapSelectPoint.secondPoint,
                      start: this.props.mapSelectPoint.firstPoint,
                      end: this.props.mapSelectPoint.secondPoint,
                    })
                    this.props.setNavigationHistory(history)
                    NavigationService.goBack()
                  } else {
                    Toast.show('请先设置起终点')
                  }
                }
              }}
            />
            <MTBtn
              style={styles.btn}
              size={MTBtn.Size.NORMAL}
              image={require('../../../../assets/Navigation/clean_route.png')}
              onPress={async () => {
                GLOBAL.TouchType = TouchType.NORMAL
                GLOBAL.STARTX = undefined
                this.props.setMapSelectPoint({
                  firstPoint: '选择起点',
                  secondPoint: '选择终点',
                })
                SMap.clearPoint()
              }}
            />
          </View>
        </View>

        <View>
          <FlatList
            data={this.props.navigationhistory}
            renderItem={this.renderItem}
          />
          {this.props.navigationhistory.length > 0 && (
            <TouchableOpacity
              style={{
                backgroundColor: color.background,
                width: '100%',
                height: scaleSize(70),
                justifyContent: 'center',
                alignItems: 'center',
              }}
              onPress={() => {
                this.props.setNavigationHistory &&
                  this.props.setNavigationHistory([])
              }}
            >
              <Text
                style={{
                  fontSize: setSpText(20),
                }}
              >
                清除记录
              </Text>
            </TouchableOpacity>
          )}
        </View>
      </View>
    )
  }

  renderItem = ({ item }) => {
    return (
      <View>
        <TouchableOpacity
          style={styles.itemView}
          onPress={async () => {
            this.props.setMapSelectPoint({
              firstPoint: item.start,
              secondPoint: item.end,
            })
            GLOBAL.STARTX = item.sx
            GLOBAL.STARTY = item.sy
            GLOBAL.ENDX = item.ex
            GLOBAL.ENDY = item.ey

            let result = await SMap.isIndoorPoint(item.sx, item.sy)
            SMap.getStartPoint(item.sx, item.sy, result.isindoor)
            if (result.isindoor) {
              GLOBAL.INDOORSTART = true
            } else {
              GLOBAL.INDOORSTART = false
            }

            let endresult = await SMap.isIndoorPoint(item.ex, item.ey)
            SMap.getEndPoint(item.ex, item.ey, endresult.isindoor)
            if (endresult.isindoor) {
              GLOBAL.INDOOREND = true
            } else {
              GLOBAL.INDOOREND = false
            }
          }}
        >
          <Image
            style={styles.pointImg}
            source={require('../../../../assets/Navigation/naviagtion-road.png')}
          />
          {item.address && <Text style={styles.itemText}>{item.address}</Text>}
        </TouchableOpacity>
        <View style={styles.itemSeparator} />
      </View>
    )
  }

  render() {
    return this._renderSearchView()
  }
}
