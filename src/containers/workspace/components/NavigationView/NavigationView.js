import * as React from 'react'
import {
  View,
  Image,
  TouchableOpacity,
  Text,
  FlatList,
  Platform,
} from 'react-native'
import { FetchUtils, scaleSize, setSpText, Toast } from '../../../../utils'
import NavigationService from '../../../../containers/NavigationService'
import { TouchType } from '../../../../constants'
import styles from './styles'
import { color } from '../../../../styles'
import PropTypes from 'prop-types'
import { SMap } from 'imobile_for_reactnative'
import { getLanguage } from '../../../../language'
import Loading from '../../../../components/Container/Loading'
import { Dialog } from '../../../../components'

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
    this.getNavgationDatas = params.getNavigationDatas
    this.changeNavPathInfo = params.changeNavPathInfo
    // this.PointType = null
    this.clickable = true
    this.historyclick = true
    this.state = {
      startName: '',
      endName: '',
    }
  }

  close = async () => {
    if (this.backClicked) return
    this.backClicked = true
    this.props.setMapNavigation({ isShow: false, name: '' })
    GLOBAL.MAPSELECTPOINT.setVisible(false)
    GLOBAL.MAPSELECTPOINTBUTTON.setVisible(false)
    GLOBAL.STARTNAME = getLanguage(
      GLOBAL.language,
    ).Map_Main_Menu.SELECT_START_POINT
    GLOBAL.ENDNAME = getLanguage(
      GLOBAL.language,
    ).Map_Main_Menu.SELECT_DESTINATION
    GLOBAL.STARTX = undefined
    GLOBAL.ENDX = undefined
    GLOBAL.ROUTEANALYST = undefined
    GLOBAL.TouchType = TouchType.NORMAL
    await SMap.clearPoint()
    NavigationService.goBack()
  }

  selectStartPoint = async () => {
    if (this.backClicked) return
    this.backClicked = true
    GLOBAL.TouchType = TouchType.NAVIGATION_TOUCH_BEGIN
    GLOBAL.MAPSELECTPOINT.setVisible(true)
    GLOBAL.MAPSELECTPOINTBUTTON.setVisible(true, {
      button: getLanguage(GLOBAL.language).Map_Main_Menu.SET_AS_START_POINT,
    })
    GLOBAL.toolBox.showFullMap(true)
    //导航选点 全屏时保留mapController
    GLOBAL.mapController && GLOBAL.mapController.setVisible(true)
    this.props.setMapNavigation({
      isShow: true,
      name: '',
    })
    //考虑搜索界面跳转，不能直接goBack
    NavigationService.navigate('MapView')
  }

  selectEndPoint = async () => {
    if (this.backClicked) return
    this.backClicked = true
    GLOBAL.TouchType = TouchType.NAVIGATION_TOUCH_END
    GLOBAL.MAPSELECTPOINT.setVisible(true)
    GLOBAL.MAPSELECTPOINTBUTTON.setVisible(true, {
      button: getLanguage(GLOBAL.language).Map_Main_Menu.SET_AS_DESTINATION,
    })
    GLOBAL.toolBox.showFullMap(true)
    //导航选点 全屏时保留mapController
    GLOBAL.mapController && GLOBAL.mapController.setVisible(true)
    this.props.setMapNavigation({
      isShow: true,
      name: '',
    })
    NavigationService.navigate('MapView')
  }

  // [{datasourceName:'',datasetName:''}]
  // [{datasourceName:''}]
  //获取数组中相同的对象
  getSameInfoFromArray = (arr1, arr2) => {
    let result = []
    if (arr1.length === 0 || arr2.length === 0) return result
    arr1.forEach(item => {
      arr2.forEach(item2 => {
        if (JSON.stringify(item) === JSON.stringify(item2)) {
          result.push(item)
        }
      })
    })
    return result
  }

  routeAnalyst = async () => {
    if (GLOBAL.STARTX !== undefined && GLOBAL.ENDX !== undefined) {
      GLOBAL.TouchType = TouchType.NORMAL
      this.loading.setLoading(
        true,
        getLanguage(GLOBAL.language).Prompt.ROUTE_ANALYSING,
      )
      let startPointInfo
      let endPointInfo
      try {
        startPointInfo = await SMap.getPointBelongs(
          GLOBAL.STARTX,
          GLOBAL.STARTY,
        )
        endPointInfo = await SMap.getPointBelongs(GLOBAL.ENDX, GLOBAL.ENDY)
      } catch (e) {
        this.loading.setLoading(false)
        Toast.show(' 获取数据失败')
        return
      }
      let startIndoorInfo = startPointInfo.filter(item => item.isIndoor)
      let startOutdoorInfo = startPointInfo.filter(item => !item.isIndoor)
      let endIndoorInfo = endPointInfo.filter(item => item.isIndoor)
      let endOutdoorInfo = endPointInfo.filter(item => !item.isIndoor)
      let commonIndoorInfo = this.getSameInfoFromArray(
        startIndoorInfo,
        endIndoorInfo,
      )
      let commonOutdoorInfo = this.getSameInfoFromArray(
        startOutdoorInfo,
        endOutdoorInfo,
      )

      let selectedData = this.getNavgationDatas()
      if (selectedData.modelFileName) {
        let newData = { ...selectedData }
        newData.isIndoor = false
        newData.datasetName = selectedData.name
        commonOutdoorInfo[0] = newData
      }

      let path, pathLength
      if (commonIndoorInfo.length > 0) {
        // todo 室内点的问题 图标问题 最好统一js显示
        //有公共室内数据源，室内导航
        // await SMap.clearPoint
        try {
          await SMap.getStartPoint(
            GLOBAL.STARTX,
            GLOBAL.STARTY,
            true,
            GLOBAL.STARTPOINTFLOOR,
          )
          await SMap.getEndPoint(
            GLOBAL.ENDX,
            GLOBAL.ENDY,
            true,
            GLOBAL.ENDPOINTFLOOR,
          )
          await SMap.startIndoorNavigation()
          let rel = await SMap.beginIndoorNavigation()
          if (!rel) {
            this.loading.setLoading(false)
            Toast.show(getLanguage(GLOBAL.language).Prompt.PATH_ANALYSIS_FAILED)
            return
          }
        } catch (e) {
          this.loading.setLoading(false)
          Toast.show(getLanguage(GLOBAL.language).Prompt.PATH_ANALYSIS_FAILED)
          return
        }
        pathLength = await SMap.getNavPathLength(true)
        path = await SMap.getPathInfos(true)
        GLOBAL.CURRENT_NAV_MODE = 'INDOOR'
      } else if (commonOutdoorInfo.length > 0) {
        //有公共室外数据集，分情况
        if (startIndoorInfo.length > 0 && endIndoorInfo.length > 0) {
          //todo 有不同的室内数据源 三段室内外一体化导航
          //getDoorPoint两次 获取最近的两个门的位置，然后启动室内导航
        } else if (startIndoorInfo.length > 0) {
          //起点室内数据源 两段室内外一体化导航 先室内
          let params = {
            startX: GLOBAL.STARTX,
            startY: GLOBAL.STARTY,
            endX: GLOBAL.ENDX,
            endY: GLOBAL.ENDY,
            datasourceName: startIndoorInfo[0].datasourceName,
          }
          let doorPoint = await SMap.getDoorPoint(params)
          if (doorPoint.x && doorPoint.y && doorPoint.floorID) {
            GLOBAL.NAV_PARAMS = [
              {
                startX: GLOBAL.STARTX,
                startY: GLOBAL.STARTY,
                endX: doorPoint.x,
                endY: doorPoint.y,
                datasourceName: startIndoorInfo[0].datasourceName,
                isIndoor: true,
                hasNaved: true,
              },
              {
                startX: doorPoint.x,
                startY: doorPoint.y,
                startFloor: doorPoint.floorID,
                endX: GLOBAL.ENDX,
                endY: GLOBAL.ENDY,
                endFloor: GLOBAL.ENDPOINTFLOOR || doorPoint.floorID,
                isIndoor: false,
                hasNaved: false,
                datasourceName: commonOutdoorInfo[0].datasourceName,
                datasetName: commonOutdoorInfo[0].datasetName,
                modelFileName: commonOutdoorInfo[0].modelFileName,
              },
            ]
            // await SMap.clearPoint()
            try {
              await SMap.getStartPoint(
                GLOBAL.STARTX,
                GLOBAL.STARTY,
                true,
                GLOBAL.STARTPOINTFLOOR || doorPoint.floorID,
              )
              await SMap.getEndPoint(
                doorPoint.x,
                doorPoint.y,
                true,
                doorPoint.floorID,
              )
              await SMap.startIndoorNavigation()
              let rel = await SMap.beginIndoorNavigation()
              if (!rel) {
                this.loading.setLoading(false)
                Toast.show(
                  getLanguage(GLOBAL.language).Prompt.PATH_ANALYSIS_FAILED,
                )
                return
              }
              await SMap.addLineOnTrackingLayer(doorPoint, {
                x: GLOBAL.ENDX,
                y: GLOBAL.ENDY,
              })
            } catch (e) {
              this.loading.setLoading(false)
              Toast.show(
                getLanguage(GLOBAL.language).Prompt.PATH_ANALYSIS_FAILED,
              )
              return
            }

            pathLength = await SMap.getNavPathLength(true)
            path = await SMap.getPathInfos(true)
            GLOBAL.CURRENT_NAV_MODE = 'INDOOR'
          } else {
            //分析失败(找不到最近的门的情况（数据问题）) 进行在线路径分析
            this.loading.setLoading(false)
            this.dialog.setDialogVisible(true)
          }
        } else if (endIndoorInfo.length > 0) {
          //终点室内数据源 两段室内外一体化导航 先室外
          let params = {
            startX: GLOBAL.STARTX,
            startY: GLOBAL.STARTY,
            endX: GLOBAL.ENDX,
            endY: GLOBAL.ENDY,
            datasourceName: endIndoorInfo[0].datasourceName,
          }
          let doorPoint = await SMap.getDoorPoint(params)
          if (doorPoint.x && doorPoint.y && doorPoint.floorID) {
            GLOBAL.NAV_PARAMS = [
              {
                startX: GLOBAL.STARTX,
                startY: GLOBAL.STARTY,
                endX: doorPoint.x,
                endY: doorPoint.y,
                isIndoor: false,
                hasNaved: true,
                datasourceName: commonOutdoorInfo[0].datasourceName,
                datasetName: commonOutdoorInfo[0].datasetName,
                modelFileName: commonOutdoorInfo[0].modelFileName,
              },
              {
                startX: doorPoint.x,
                startY: doorPoint.y,
                startFloor: doorPoint.floorID,
                endX: GLOBAL.ENDX,
                endY: GLOBAL.ENDY,
                endFloor: GLOBAL.ENDPOINTFLOOR || doorPoint.floorID,
                datasourceName: endIndoorInfo[0].datasourceName,
                isIndoor: true,
                hasNaved: false,
              },
            ]

            try {
              await SMap.getStartPoint(GLOBAL.STARTX, GLOBAL.STARTY, false)
              await SMap.getEndPoint(GLOBAL.ENDX, GLOBAL.ENDY, false)
              await SMap.startNavigation(GLOBAL.NAV_PARAMS[0])
              let canNav = await SMap.beginNavigation(
                GLOBAL.STARTX,
                GLOBAL.STARTY,
                doorPoint.x,
                doorPoint.y,
              )
              if (!canNav) {
                Toast.show(
                  '当前选点不在路网数据集范围内,请重新选点或者重设路网数据集',
                )
                this.loading.setLoading(false)
                return
              }
              await SMap.addLineOnTrackingLayer(doorPoint, {
                x: GLOBAL.ENDX,
                y: GLOBAL.ENDY,
              })
            } catch (e) {
              this.loading.setLoading(false)
              Toast.show(
                getLanguage(GLOBAL.language).Prompt.PATH_ANALYSIS_FAILED,
              )
              return
            }
            pathLength = await SMap.getNavPathLength(false)
            path = await SMap.getPathInfos(false)
            GLOBAL.CURRENT_NAV_MODE = 'OUTDOOR'
          } else {
            //分析失败(找不到最近的门的情况（数据问题）) 进行在线路径分析
            this.loading.setLoading(false)
            this.dialog.setDialogVisible(true)
          }
        } else {
          //无室内数据源  室外导航
          //直接导航
          try {
            await SMap.startNavigation(commonOutdoorInfo[0])
            let result = await SMap.beginNavigation(
              GLOBAL.STARTX,
              GLOBAL.STARTY,
              GLOBAL.ENDX,
              GLOBAL.ENDY,
            )
            if (result) {
              pathLength = await SMap.getNavPathLength(false)
              path = await SMap.getPathInfos(false)
              GLOBAL.CURRENT_NAV_MODE = 'OUTDOOR'
            } else {
              //分析失败(500m范围内找不到路网点的情况)或者选择的点不在选择的路网数据集bounds范围内
              Toast.show(
                '当前选点不在路网数据集范围内,请重新选点或者重设路网数据集',
              )
              this.loading.setLoading(false)
              return
            }
          } catch (e) {
            this.loading.setLoading(false)
            Toast.show(getLanguage(GLOBAL.language).Prompt.PATH_ANALYSIS_FAILED)
            return
          }
        }
      } else {
        //在线路径分析
        this.loading.setLoading(false)
        this.dialog.setDialogVisible(true)
      }
      if (path && pathLength) {
        this.changeNavPathInfo({ path, pathLength })
        GLOBAL.ROUTEANALYST = true
        GLOBAL.MAPSELECTPOINT.setVisible(false)
        GLOBAL.MAPSELECTPOINTBUTTON.setVisible(false, {
          button: '',
        })
        GLOBAL.NAVIGATIONSTARTBUTTON.setVisible(true, false)
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
          address: GLOBAL.STARTNAME + '---' + GLOBAL.ENDNAME,
          start: GLOBAL.STARTNAME,
          end: GLOBAL.ENDNAME,
          isOutDoor: true,
        })
        if (this.historyclick) {
          this.props.setNavigationHistory(history)
        }
        if (this.clickable) {
          this.clickable = false
          this.loading.setLoading(false)
          GLOBAL.TouchType = TouchType.NULL
          //考虑搜索界面跳转，不能直接goBack
          NavigationService.navigate('MapView')
          GLOBAL.mapController && GLOBAL.mapController.changeBottom(true)
        }
      }
    }
  }

  _confirm = async () => {
    this.dialog.setDialogVisible(false)
    this.loading.setLoading(
      true,
      getLanguage(GLOBAL.language).Prompt.ROUTE_ANALYSING,
    )
    await SMap.getStartPoint(GLOBAL.STARTX, GLOBAL.STARTY, false)
    await SMap.getEndPoint(GLOBAL.ENDX, GLOBAL.ENDY, false)
    let path, pathLength
    let result = await FetchUtils.routeAnalyst(
      GLOBAL.STARTX,
      GLOBAL.STARTY,
      GLOBAL.ENDX,
      GLOBAL.ENDY,
    )
    if (result && result[0] && result[0].pathInfos) {
      pathLength = { length: result[0].pathLength }
      path = result[0].pathInfos
      await SMap.drawOnlinePath(result[0].pathPoints)
      await SMap.moveToPoint({ x: GLOBAL.STARTX, y: GLOBAL.STARTY })
    } else {
      Toast.show(getLanguage(GLOBAL.language).Prompt.PATH_ANALYSIS_FAILED)
    }
    if (pathLength && path) {
      this.changeNavPathInfo({ path, pathLength })
      GLOBAL.ROUTEANALYST = true
      GLOBAL.MAPSELECTPOINT.setVisible(false)
      GLOBAL.MAPSELECTPOINTBUTTON.setVisible(false, {
        button: '',
      })
      GLOBAL.NAVIGATIONSTARTBUTTON.setVisible(true, true)
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
        address: GLOBAL.STARTNAME + '---' + GLOBAL.ENDNAME,
        start: GLOBAL.STARTNAME,
        end: GLOBAL.ENDNAME,
      })
      if (this.historyclick) {
        this.props.setNavigationHistory(history)
      }
      if (this.clickable) {
        this.clickable = false
        this.loading.setLoading(false)
        GLOBAL.TouchType = TouchType.NULL
        //考虑搜索界面跳转，不能直接goBack
        NavigationService.navigate('MapView')
        GLOBAL.mapController && GLOBAL.mapController.changeBottom(true)
      }
    }
  }
  _renderSearchView = () => {
    // let renderHistory = this.props.navigationhistory.filter(
    //   item => item.isOutDoor === GLOBAL.ISOUTDOORMAP,
    // )
    let renderHistory = this.props.navigationhistory
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
            height: scaleSize(205) + TOOLBARHEIGHT,
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
                  onPress={() => {
                    this.selectStartPoint()
                  }}
                >
                  <Text
                    numberOfLines={2}
                    ellipsizeMode={'tail'}
                    style={{ fontSize: setSpText(24) }}
                  >
                    {this.state.startName || GLOBAL.STARTNAME}
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
                    this.selectEndPoint()
                  }}
                >
                  <Text
                    numberOfLines={2}
                    ellipsizeMode={'tail'}
                    style={{ fontSize: setSpText(24) }}
                  >
                    {this.state.endName || GLOBAL.ENDNAME}
                  </Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </View>

        <View>
          <FlatList
            style={{ maxHeight: scaleSize(650) }}
            data={renderHistory}
            extraData={GLOBAL.STARTX}
            keyExtractor={(item, index) => item.toString() + index}
            renderItem={this.renderItem}
          />
          {renderHistory.length > 0 && (
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
            onPress={() => {
              this.routeAnalyst()
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
        <Loading ref={ref => (this.loading = ref)} initLoading={false} />
        <Dialog
          ref={ref => (this.dialog = ref)}
          confirmAction={this._confirm}
          opacity={1}
          opacityStyle={styles.dialogBackground}
          style={styles.dialogBackground}
          confirmBtnTitle={getLanguage(GLOBAL.language).Prompt.YES}
          cancelBtnTitle={getLanguage(GLOBAL.language).Prompt.NO}
        >
          <View style={styles.dialogHeaderView}>
            <Image
              source={require('../../../../assets/home/Frenchgrey/icon_prompt.png')}
              style={styles.dialogHeaderImg}
            />
            <Text style={styles.promptTitle}>
              {getLanguage(GLOBAL.language).Prompt.USE_ONLINE_ROUTE_ANALYST}
            </Text>
          </View>
        </Dialog>
      </View>
    )
  }

  onItemPress = async item => {
    GLOBAL.STARTNAME = item.start
    GLOBAL.ENDNAME = item.end

    GLOBAL.STARTX = item.sx
    GLOBAL.STARTY = item.sy
    GLOBAL.ENDX = item.ex
    GLOBAL.ENDY = item.ey
    GLOBAL.STARTPOINTFLOOR = item.sFloor
    GLOBAL.ENDPOINTFLOOR = item.eFloor

    await SMap.getStartPoint(item.sx, item.sy, false, item.sFloor)

    await SMap.getEndPoint(item.ex, item.ey, false, item.eFloor)

    GLOBAL.ROUTEANALYST = undefined
    this.historyclick = false
    this.setState({
      startName: item.start,
      endName: item.end,
    })
  }
  renderItem = ({ item }) => {
    return (
      <View>
        <TouchableOpacity
          style={styles.itemView}
          onPress={() => {
            this.onItemPress(item)
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
