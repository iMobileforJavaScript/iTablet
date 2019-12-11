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
    let pathLength, path
    let showLocationView = !(await SMap.isIndoorMap())
    if (
      this.state.button ===
      getLanguage(GLOBAL.language).Map_Main_Menu.SET_AS_START_POINT
    ) {
      if (GLOBAL.STARTX !== undefined) {
        GLOBAL.STARTNAME = await FetchUtils.getPointName(
          GLOBAL.STARTX,
          GLOBAL.STARTY,
        )
        if (this.state.firstpage) {
          GLOBAL.STARTPOINTFLOOR = await SMap.getCurrentFloorID()
          NavigationService.navigate('NavigationView', {
            changeNavPathInfo: this.props.changeNavPathInfo,
            showLocationView,
          })
        } else {
          this.props.setLoading(
            true,
            getLanguage(GLOBAL.language).Prompt.ROUTE_ANALYSING,
          )
          if (GLOBAL.ENDX !== undefined) {
            await SMap.getEndPoint(
              GLOBAL.ENDX,
              GLOBAL.ENDY,
              GLOBAL.INDOORSTART,
              GLOBAL.ENDPOINTFLOOR,
            )
            let result
            try {
              if (GLOBAL.INDOOREND) {
                result = await SMap.beginIndoorNavigation(
                  GLOBAL.STARTX,
                  GLOBAL.STARTY,
                  GLOBAL.ENDX,
                  GLOBAL.ENDY,
                )
              } else {
                let navInfos = await SMap.isPointsInMapBounds(
                  { x: GLOBAL.STARTX, y: GLOBAL.STARTY },
                  { x: GLOBAL.ENDX, y: GLOBAL.ENDY },
                )
                if (navInfos && navInfos.name) {
                  await SMap.startNavigation(navInfos)
                  result = await SMap.beginNavigation(
                    GLOBAL.STARTX,
                    GLOBAL.STARTY,
                    GLOBAL.ENDX,
                    GLOBAL.ENDY,
                  )
                } else {
                  GLOBAL.NavDialog.setDialogVisible(true)
                  this.props.setLoading(false)
                  return
                }
              }
            } catch (e) {
              this.props.setLoading(false)
              Toast.show(
                getLanguage(GLOBAL.language).Prompt.PATH_ANALYSIS_FAILED,
              )
              return
            }
            path = await SMap.getPathInfos(GLOBAL.INDOOREND)
            pathLength = await SMap.getNavPathLength(GLOBAL.INDOOREND)
            this.props.setLoading(false)
            GLOBAL.NAVIGATIONSTARTBUTTON.setVisible(true, false)
            GLOBAL.NAVIGATIONSTARTHEAD.setVisible(true)
            GLOBAL.LocationView && GLOBAL.LocationView.setVisible(false)
            this.setVisible(false)
            GLOBAL.MAPSELECTPOINT.setVisible(false)
            GLOBAL.STARTPOINTFLOOR = await SMap.getCurrentFloorID()
            if (!result) {
              this.props.setLoading(false)
              Toast.show(
                getLanguage(GLOBAL.language).Prompt.PATH_ANALYSIS_FAILED,
              )
            }
          }
        }
      } else {
        Toast.show(getLanguage(GLOBAL.language).Prompt.LONG_PRESS_ADD_START)
      }
    } else {
      if (GLOBAL.ENDX !== undefined) {
        GLOBAL.ENDNAME = await FetchUtils.getPointName(GLOBAL.ENDX, GLOBAL.ENDY)
        if (this.state.firstpage) {
          GLOBAL.ENDPOINTFLOOR = await SMap.getCurrentFloorID()
          NavigationService.navigate('NavigationView', {
            changeNavPathInfo: this.props.changeNavPathInfo,
            showLocationView,
          })
        } else {
          this.props.setLoading(
            true,
            getLanguage(GLOBAL.language).Prompt.ROUTE_ANALYSING,
          )
          if (GLOBAL.STARTX !== undefined) {
            let result
            await SMap.getStartPoint(
              GLOBAL.STARTX,
              GLOBAL.STARTY,
              GLOBAL.INDOORSTART,
              GLOBAL.STARTPOINTFLOOR,
            )
            try {
              if (GLOBAL.INDOOREND) {
                result = await SMap.beginIndoorNavigation(
                  GLOBAL.STARTX,
                  GLOBAL.STARTY,
                  GLOBAL.ENDX,
                  GLOBAL.ENDY,
                )
              } else {
                let navInfos = await SMap.isPointsInMapBounds(
                  { x: GLOBAL.STARTX, y: GLOBAL.STARTY },
                  { x: GLOBAL.ENDX, y: GLOBAL.ENDY },
                )
                if (navInfos && navInfos.name) {
                  await SMap.startNavigation(navInfos)
                  result = await SMap.beginNavigation(
                    GLOBAL.STARTX,
                    GLOBAL.STARTY,
                    GLOBAL.ENDX,
                    GLOBAL.ENDY,
                  )
                } else {
                  GLOBAL.NavDialog.setDialogVisible(true)
                  this.props.setLoading(false)
                  return
                }
              }
            } catch (e) {
              this.props.setLoading(false)
              Toast.show(
                getLanguage(GLOBAL.language).Prompt.PATH_ANALYSIS_FAILED,
              )
              return
            }
            path = await SMap.getPathInfos(GLOBAL.INDOOREND)
            pathLength = await SMap.getNavPathLength(GLOBAL.INDOOREND)
            this.props.setLoading(false)
            GLOBAL.NAVIGATIONSTARTBUTTON.setVisible(true, false)
            GLOBAL.NAVIGATIONSTARTHEAD.setVisible(true)
            this.setVisible(false)
            GLOBAL.MAPSELECTPOINT.setVisible(false)
            GLOBAL.ENDPOINTFLOOR = await SMap.getCurrentFloorID()
            if (!result) {
              this.props.setLoading(false)
              Toast.show(
                getLanguage(GLOBAL.language).Prompt.PATH_ANALYSIS_FAILED,
              )
            }
          }
        }
      } else {
        Toast.show(getLanguage(GLOBAL.language).Prompt.LONG_PRESS_ADD_END)
      }
    }
    if (path && pathLength) {
      GLOBAL.TouchType = TouchType.NORMAL
      GLOBAL.LocationView && GLOBAL.LocationView.setVisible(false)
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
      })
      this.props.setNavigationHistory(history)
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
