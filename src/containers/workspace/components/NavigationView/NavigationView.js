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
    this.changeNavPathInfo = params.changeNavPathInfo
    this.showLocationView = params.showLocationView || false
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
    GLOBAL.LocationView && GLOBAL.LocationView.setVisible(false)
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
    this.showLocationView &&
      GLOBAL.LocationView &&
      GLOBAL.LocationView.setVisible(true, true)
    GLOBAL.MAPSELECTPOINTBUTTON.setVisible(true, {
      button: getLanguage(GLOBAL.language).Map_Main_Menu.SET_AS_START_POINT,
    })
    GLOBAL.toolBox.showFullMap(true)
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
    this.showLocationView &&
      GLOBAL.LocationView &&
      GLOBAL.LocationView.setVisible(true, false)
    GLOBAL.MAPSELECTPOINTBUTTON.setVisible(true, {
      button: getLanguage(GLOBAL.language).Map_Main_Menu.SET_AS_DESTINATION,
    })
    GLOBAL.toolBox.showFullMap(true)
    this.props.setMapNavigation({
      isShow: true,
      name: '',
    })
    NavigationService.navigate('MapView')
  }
  routeAnalyst = async () => {
    if (GLOBAL.STARTX !== undefined && GLOBAL.ENDX !== undefined) {
      GLOBAL.TouchType = TouchType.NORMAL
      this.loading.setLoading(
        true,
        getLanguage(GLOBAL.language).Prompt.ROUTE_ANALYSING,
      )
      if (!GLOBAL.INDOORSTART && !GLOBAL.INDOOREND) {
        //如果不让用户选数据集，自动获取 则使用SMap.isPointsInMapBounds来判断
        let datasetName =
          GLOBAL.ToolBar && GLOBAL.ToolBar.props.getNavigationDatas().name
        let isStartInBounds = await SMap.isInBounds(
          { x: GLOBAL.STARTX, y: GLOBAL.STARTY },
          datasetName,
        )
        let isEndInBounds = await SMap.isInBounds(
          { x: GLOBAL.ENDX, y: GLOBAL.ENDY },
          datasetName,
        )
        let path, pathLength
        //室外导航
        if (isStartInBounds && isEndInBounds) {
          try {
            let result = await SMap.beginNavigation(
              GLOBAL.STARTX,
              GLOBAL.STARTY,
              GLOBAL.ENDX,
              GLOBAL.ENDY,
            )
            if (result) {
              pathLength = await SMap.getNavPathLength(false)
              path = await SMap.getPathInfos(false)
            } else {
              Toast.show(
                getLanguage(GLOBAL.language).Prompt.PATH_ANALYSIS_FAILED,
              )
            }
          } catch (e) {
            this.loading.setLoading(false)
            Toast.show('无路径分析结果')
          }
        } else {
          //在线路径分析弹窗
          this.loading.setLoading(false)
          this.dialog.setDialogVisible(true)
        }
        if (pathLength && path) {
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
          })
          if (this.historyclick) {
            this.props.setNavigationHistory(history)
          }
          if (this.clickable) {
            this.clickable = false
            GLOBAL.LocationView && GLOBAL.LocationView.setVisible(false)
            this.loading.setLoading(false)
            GLOBAL.TouchType = TouchType.NULL
            //考虑搜索界面跳转，不能直接goBack
            NavigationService.navigate('MapView')
          }
        }
      }
      //室内导航
      if (GLOBAL.INDOORSTART && GLOBAL.INDOOREND) {
        try {
          let result = await SMap.beginIndoorNavigation(
            GLOBAL.STARTX,
            GLOBAL.STARTY,
            GLOBAL.ENDX,
            GLOBAL.ENDY,
          )
          if (result) {
            let pathLength = await SMap.getNavPathLength(true)
            let path = await SMap.getPathInfos(true)
            if (path && pathLength) {
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
                NavigationService.goBack()
                GLOBAL.FloorListView && GLOBAL.FloorListView.changeBottom(true)
              }
            }
          } else {
            Toast.show(getLanguage(GLOBAL.language).Prompt.PATH_ANALYSIS_FAILED)
          }
        } catch (e) {
          this.loading.setLoading(false)
          Toast.show('无路径分析结果')
        }
      }
    } else {
      Toast.show(getLanguage(GLOBAL.language).Prompt.SET_START_AND_END_POINTS)
    }
  }

  _confirm = async () => {
    this.dialog.setDialogVisible(false)
    this.loading.setLoading(
      true,
      getLanguage(GLOBAL.language).Prompt.ROUTE_ANALYSING,
    )
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
        GLOBAL.LocationView && GLOBAL.LocationView.setVisible(false)
        this.loading.setLoading(false)
        GLOBAL.TouchType = TouchType.NULL
        //考虑搜索界面跳转，不能直接goBack
        NavigationService.navigate('MapView')
      }
    }
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
            data={this.props.navigationhistory}
            extraData={GLOBAL.STARTX}
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
          confirmBtnTitle={'是'}
          cancelBtnTitle={'否'}
        >
          <View style={styles.dialogHeaderView}>
            <Image
              source={require('../../../../assets/home/Frenchgrey/icon_prompt.png')}
              style={styles.dialogHeaderImg}
            />
            <Text style={styles.promptTitle}>
              起始点不再本地路径分析范围内，是否使用在线路径分析？
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
