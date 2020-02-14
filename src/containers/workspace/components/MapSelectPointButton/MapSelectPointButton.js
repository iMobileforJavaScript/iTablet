import * as React from 'react'
import { View, TouchableOpacity, Text } from 'react-native'
import { FetchUtils, scaleSize, setSpText, Toast } from '../../../../utils'
import color from '../../../../styles/color'
import { SMap } from 'imobile_for_reactnative'
import NavigationService from '../../../../containers/NavigationService'
import { getLanguage } from '../../../../language'
import { TouchType } from '../../../../constants'

export default class MapSelectPointButton extends React.Component {
  props: {
    changeNavPathInfo: () => {},
    headerProps?: Object,
    setNavigationHistory: () => {},
    navigationhistory: Array,
    getNavigationDatas: () => {},
    setLoading: () => {},
  }

  constructor(props) {
    super(props)
    this.state = {
      show: false,
      button: '',
      firstpage: true,
    }
  }

  setVisible = (iShow, params = {}, firstpage = true) => {
    this.setState({ show: iShow, button: params.button, firstpage: firstpage })
  }

  setButton = async () => {
    if (
      this.state.button ===
      getLanguage(GLOBAL.language).Map_Main_Menu.SET_AS_START_POINT
    ) {
      if (GLOBAL.STARTX) {
        GLOBAL.STARTNAME =
          (await FetchUtils.getPointName(GLOBAL.STARTX, GLOBAL.STARTY)) ||
          `${
            getLanguage(GLOBAL.language).Map_Main_Menu.START_POINT
          }(${GLOBAL.STARTX.toFixed(6)},${GLOBAL.STARTY.toFixed(6)})`
        if (this.state.firstpage) {
          GLOBAL.STARTPOINTFLOOR = await SMap.getCurrentFloorID()
          NavigationService.navigate('NavigationView', {
            changeNavPathInfo: this.props.changeNavPathInfo,
            getNavigationDatas: this.props.getNavigationDatas,
          })
        } else {
          await SMap.getEndPoint(
            GLOBAL.ENDX,
            GLOBAL.ENDY,
            false,
            GLOBAL.ENDPOINTFLOOR,
          )
          this.routeAnalyst()
        }
      }
    } else {
      if (GLOBAL.ENDX) {
        GLOBAL.ENDNAME =
          (await FetchUtils.getPointName(GLOBAL.ENDX, GLOBAL.ENDY)) ||
          `${
            getLanguage(GLOBAL.language).Map_Main_Menu.END_POINT
          }(${GLOBAL.ENDX.toFixed(6)},${GLOBAL.ENDY.toFixed(6)})`
        if (this.state.firstpage) {
          GLOBAL.ENDPOINTFLOOR = await SMap.getCurrentFloorID()
          NavigationService.navigate('NavigationView', {
            changeNavPathInfo: this.props.changeNavPathInfo,
            getNavigationDatas: this.props.getNavigationDatas,
          })
        } else {
          await SMap.getStartPoint(
            GLOBAL.STARTX,
            GLOBAL.STARTY,
            false,
            GLOBAL.STARTPOINTFLOOR,
          )
          this.routeAnalyst()
        }
      } else {
        Toast.show(getLanguage(GLOBAL.language).Prompt.LONG_PRESS_ADD_END)
      }
    }
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
      this.props.setLoading(
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
        this.props.setLoading(false)
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
            this.props.setLoading(false)
            Toast.show(getLanguage(GLOBAL.language).Prompt.PATH_ANALYSIS_FAILED)
            return
          }
        } catch (e) {
          this.props.setLoading(false)
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
                this.props.setLoading(false)
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
              this.props.setLoading(false)
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
            this.props.setLoading(false)
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
              await SMap.beginNavigation(
                GLOBAL.STARTX,
                GLOBAL.STARTY,
                doorPoint.x,
                doorPoint.y,
              )
              await SMap.addLineOnTrackingLayer(doorPoint, {
                x: GLOBAL.ENDX,
                y: GLOBAL.ENDY,
              })
            } catch (e) {
              this.props.setLoading(false)
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
            this.props.setLoading(false)
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
              //分析失败(500m范围内找不到路网点的情况) 进行在线路径分析
              this.props.setLoading(false)
              this.dialog.setDialogVisible(true)
            }
          } catch (e) {
            this.props.setLoading(false)
            Toast.show(getLanguage(GLOBAL.language).Prompt.PATH_ANALYSIS_FAILED)
            return
          }
        }
      } else {
        //在线路径分析
        this.props.setLoading(false)
        this.dialog.setDialogVisible(true)
      }
      if (path && pathLength) {
        GLOBAL.TouchType = TouchType.NORMAL
        this.props.setLoading(false)
        GLOBAL.NAVIGATIONSTARTBUTTON.setVisible(true, false)
        GLOBAL.NAVIGATIONSTARTHEAD.setVisible(true)
        this.setVisible(false)
        GLOBAL.MAPSELECTPOINT.setVisible(false)
        this.props.changeNavPathInfo &&
          this.props.changeNavPathInfo({ path, pathLength })

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
          isOutDoor: GLOBAL.ISOUTDOORMAP,
        })
        this.props.setNavigationHistory(history)
      }
    }
  }

  render() {
    if (this.state.show) {
      return (
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
              this.setButton()
            }}
          >
            <Text
              style={{
                fontSize: setSpText(20),
                color: color.white,
              }}
            >
              {this.state.button}
            </Text>
          </TouchableOpacity>
        </View>
      )
    } else {
      return <View />
    }
  }
}
