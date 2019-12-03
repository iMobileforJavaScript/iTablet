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
import { getLanguage } from '../../../../language'

const TOOLBARHEIGHT = Platform.OS === 'ios' ? scaleSize(20) : 0

export default class NavigationView extends React.Component {
  props: {
    navigation: Object,
  }
  static propTypes = {
    mapNavigation: PropTypes.object,
    setMapNavigation: PropTypes.func,
    setNavigationHistory: PropTypes.func,
    navigationhistory: PropTypes.array,
  }

  constructor(props) {
    super(props)
    let { params } = this.props.navigation.state
    this.changeNavPathInfo = params.changeNavPathInfo
    this.showLocationView = params.showLocationView || false
    this.selectPoint = params.selectPoint
    this.changeMapSelectPoint = params.changeMapSelectPoint
    // this.PointType = null
    this.clickable = true
    this.historyclick = true
  }

  close = async () => {
    if (this.backClicked) return
    this.backClicked = true
    this.props.setMapNavigation({ isShow: false, name: '' })
    GLOBAL.MAPSELECTPOINT.setVisible(false)
    GLOBAL.MAPSELECTPOINTBUTTON.setVisible(false)
    this.changeMapSelectPoint({
      startPoint: getLanguage(GLOBAL.language).Map_Main_Menu.SELECT_START_POINT,
      endPoint: getLanguage(GLOBAL.language).Map_Main_Menu.SELECT_DESTINATION,
    })
    GLOBAL.STARTX = undefined
    GLOBAL.ENDX = undefined
    GLOBAL.ROUTEANALYST = undefined
    GLOBAL.TouchType = TouchType.NORMAL
    await SMap.clearPoint()
    NavigationService.goBack()
  }

  _renderSearchView = () => {
    return (
      <View
        style={{
          flex: 1,
          backgroundColor: color.background,
        }}
      >
        <View
          style={{
            paddingTop: TOOLBARHEIGHT + scaleSize(20),
            height: scaleSize(185) + TOOLBARHEIGHT,
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
                    this.showLocationView &&
                      GLOBAL.LocationView &&
                      GLOBAL.LocationView.setVisible(true, true)
                    GLOBAL.MAPSELECTPOINTBUTTON.setVisible(true, {
                      button: getLanguage(GLOBAL.language).Map_Main_Menu
                        .SET_AS_START_POINT,
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
                    style={{ fontSize: setSpText(24) }}
                  >
                    {this.selectPoint.startPoint}
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
                    this.showLocationView &&
                      GLOBAL.LocationView &&
                      GLOBAL.LocationView.setVisible(true, false)
                    GLOBAL.MAPSELECTPOINTBUTTON.setVisible(true, {
                      button: getLanguage(GLOBAL.language).Map_Main_Menu
                        .SET_AS_DESTINATION,
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
                    style={{ fontSize: setSpText(24) }}
                  >
                    {this.selectPoint.endPoint}
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
            style={{ maxHeight: scaleSize(650) }}
            data={this.props.navigationhistory}
            keyExtractor={(item, index) => item.toString() + index}
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
                {getLanguage(GLOBAL.language).Map_Main_Menu.CLEAR_NAV_HISTORY}
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
                    let pathLength = await SMap.getNavPathLength(false)
                    let path = await SMap.getPathInfos(false)
                    this.changeNavPathInfo({ path, pathLength })
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
                      sFloor: GLOBAL.STARTPOINTFLOOR,
                      eFloor: GLOBAL.ENDPOINTFLOOR,
                      address:
                        this.selectPoint.startPoint +
                        '---' +
                        this.selectPoint.endPoint,
                      start: this.selectPoint.startPoint,
                      end: this.selectPoint.endPoint,
                    })
                    if (this.historyclick) {
                      this.props.setNavigationHistory(history)
                    }
                    if (this.clickable) {
                      this.clickable = false
                      GLOBAL.LocationView &&
                        GLOBAL.LocationView.setVisible(false)
                      NavigationService.goBack()
                    }
                  } else {
                    Toast.show(
                      getLanguage(GLOBAL.language).Prompt.PATH_ANALYSIS_FAILED,
                    )
                  }
                } else {
                  Toast.show(
                    getLanguage(GLOBAL.language).Prompt
                      .SET_START_AND_END_POINTS,
                  )
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
                    let pathLength = await SMap.getNavPathLength(true)
                    let path = await SMap.getPathInfos(true)
                    this.changeNavPathInfo({ path, pathLength })
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
                      sFloor: GLOBAL.STARTPOINTFLOOR,
                      eFloor: GLOBAL.ENDPOINTFLOOR,
                      address:
                        this.selectPoint.startPoint +
                        '---' +
                        this.selectPoint.endPoint,
                      start: this.selectPoint.startPoint,
                      end: this.selectPoint.endPoint,
                    })
                    if (this.historyclick) {
                      this.props.setNavigationHistory(history)
                    }
                    if (this.clickable) {
                      this.clickable = false
                      NavigationService.goBack()
                      GLOBAL.FloorListView &&
                        GLOBAL.FloorListView.changeBottom(true)
                    }
                  } else {
                    Toast.show(
                      getLanguage(GLOBAL.language).Prompt.PATH_ANALYSIS_FAILED,
                    )
                  }
                } else {
                  Toast.show(
                    getLanguage(GLOBAL.language).Prompt
                      .SET_START_AND_END_POINTS,
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
              {getLanguage(GLOBAL.language).Map_Main_Menu.ROUTE_ANALYST}
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
            this.changeMapSelectPoint({
              startPoint: item.start,
              endPoint: item.end,
            })

            GLOBAL.STARTX = item.sx
            GLOBAL.STARTY = item.sy
            GLOBAL.ENDX = item.ex
            GLOBAL.ENDY = item.ey
            GLOBAL.STARTPOINTFLOOR = item.sFloor
            GLOBAL.ENDPOINTFLOOR = item.eFloor

            let result = await SMap.isIndoorPoint(item.sx, item.sy)
            SMap.getStartPoint(item.sx, item.sy, result.isindoor, item.sFloor)
            if (result.isindoor) {
              GLOBAL.INDOORSTART = true
            } else {
              GLOBAL.INDOORSTART = false
            }

            let endresult = await SMap.isIndoorPoint(item.ex, item.ey)
            SMap.getEndPoint(item.ex, item.ey, endresult.isindoor, item.eFloor)
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
