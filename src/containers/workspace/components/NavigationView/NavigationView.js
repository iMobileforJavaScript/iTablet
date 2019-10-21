import * as React from 'react'
import {
  View,
  Image,
  TouchableOpacity,
  Text,
  FlatList,
  Platform,
} from 'react-native'
import { scaleSize, setSpText, Toast } from '../../../../utils'
// import { getLanguage } from '../../../../language/index'
import NavigationService from '../../../../containers/NavigationService'
// import { MTBtn } from '../../../../components'
import { TouchType } from '../../../../constants'
import styles from './styles'
import { color } from '../../../../styles'
import PropTypes from 'prop-types'
import { SMap } from 'imobile_for_reactnative'

const TOOLBARHEIGHT = Platform.OS === 'ios' ? scaleSize(20) : 0

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
    this.clickable = true
    this.historyclick = true
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
        GLOBAL.ENDPOINT = result
      },
    })
  }

  close = async () => {
    this.props.setMapNavigation({ isShow: false, name: '' })
    GLOBAL.MAPSELECTPOINT.setVisible(false)
    GLOBAL.MAPSELECTPOINTBUTTON.setVisible(false)
    this.props.setMapSelectPoint({
      firstPoint: '选择起点',
      secondPoint: '选择终点',
    })
    GLOBAL.STARTX = undefined
    GLOBAL.ENDX = undefined
    GLOBAL.ROUTEANALYST = undefined
    await SMap.clearPoint()
    NavigationService.goBack()
  }

  _renderSearchView = () => {
    return (
      <View style={{ flex: 1, backgroundColor: color.background }}>
        <View
          style={{
            paddingTop: TOOLBARHEIGHT,
            height: scaleSize(165) + TOOLBARHEIGHT,
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

            {/*<MTBtn*/}
            {/*style={styles.btn}*/}
            {/*size={MTBtn.Size.NORMAL}*/}
            {/*image={require('../../../../assets/Navigation/naviagtion-road.png')}*/}
            {/*onPress={async () => {*/}

            {/*}}*/}
            {/*/>*/}

            {/*<MTBtn*/}
            {/*style={styles.btn}*/}
            {/*size={MTBtn.Size.NORMAL}*/}
            {/*image={require('../../../../assets/Navigation/clean_route.png')}*/}
            {/*onPress={async () => {*/}
            {/*GLOBAL.TouchType = TouchType.NORMAL*/}
            {/*GLOBAL.STARTX = undefined*/}
            {/*GLOBAL.ENDX = undefined*/}
            {/*GLOBAL.ROUTEANALYST = undefined*/}
            {/*this.props.setMapSelectPoint({*/}
            {/*firstPoint: '选择起点',*/}
            {/*secondPoint: '选择终点',*/}
            {/*})*/}
            {/*SMap.clearPoint()*/}
            {/*}}*/}
            {/*/>*/}
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

        <View
          style={{
            position: 'absolute',
            bottom: scaleSize(30),
            width: '100%',
            justifyContent: 'center',
            alignItems: 'center',
          }}
        >
          <TouchableOpacity
            activeOpacity={0.5}
            style={{
              width: '80%',
              height: scaleSize(60),
              borderRadius: 50,
              backgroundColor: color.blue1,
              justifyContent: 'center',
              alignItems: 'center',
            }}
            onPress={async () => {
              GLOBAL.TouchType = TouchType.NORMAL
              if (!GLOBAL.INDOORSTART && !GLOBAL.INDOOREND) {
                if (GLOBAL.STARTX !== undefined && GLOBAL.ENDX !== undefined) {
                  let result = await SMap.beginNavigation(
                    GLOBAL.STARTX,
                    GLOBAL.STARTY,
                    GLOBAL.ENDX,
                    GLOBAL.ENDY,
                  )
                  if (result) {
                    GLOBAL.PATHLENGTH = await SMap.getNavPathLength(false)
                    GLOBAL.PATH = await SMap.getPathInfos(false)
                    GLOBAL.ROUTEANALYST = true
                    GLOBAL.MAPSELECTPOINT.setVisible(false)
                    GLOBAL.MAPSELECTPOINTBUTTON.setVisible(false, {
                      button: '',
                    })
                    GLOBAL.NAVIGATIONSTARTBUTTON.setVisible(true)
                    GLOBAL.NAVIGATIONSTARTHEAD.setVisible(true)
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
                    if (this.historyclick) {
                      this.props.setNavigationHistory(history)
                    }
                    if (this.clickable) {
                      this.clickable = false
                      NavigationService.goBack()
                    }
                  } else {
                    Toast.show('路径分析失败请重新选择起终点')
                  }
                } else {
                  Toast.show('请先设置起终点')
                }
              }

              if (GLOBAL.INDOORSTART && GLOBAL.INDOOREND) {
                if (GLOBAL.STARTX !== undefined && GLOBAL.ENDX !== undefined) {
                  let result = await SMap.beginIndoorNavigation(
                    GLOBAL.STARTX,
                    GLOBAL.STARTY,
                    GLOBAL.ENDX,
                    GLOBAL.ENDY,
                  )
                  if (result) {
                    GLOBAL.PATHLENGTH = await SMap.getNavPathLength(true)
                    GLOBAL.PATH = await SMap.getPathInfos(true)
                    GLOBAL.ROUTEANALYST = true
                    GLOBAL.MAPSELECTPOINT.setVisible(false)
                    GLOBAL.MAPSELECTPOINTBUTTON.setVisible(false, {
                      button: '',
                    })
                    GLOBAL.NAVIGATIONSTARTBUTTON.setVisible(true)
                    GLOBAL.NAVIGATIONSTARTHEAD.setVisible(true)
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
                    if (this.historyclick) {
                      this.props.setNavigationHistory(history)
                    }
                    if (this.clickable) {
                      this.clickable = false
                      NavigationService.goBack()
                    }
                  } else {
                    Toast.show('路径分析失败请重新选择起终点')
                  }
                } else {
                  Toast.show('请先设置起终点')
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
              下一步
            </Text>
          </TouchableOpacity>
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

            GLOBAL.ROUTEANALYST = undefined

            this.historyclick = false
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
