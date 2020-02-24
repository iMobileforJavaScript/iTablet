import * as React from 'react'
import {
  View,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  TextInput,
  Image,
  Text,
} from 'react-native'
import { ConstToolType, TouchType } from '../../../../constants'
import { TableList } from '../../../../components'
import { color } from '../../../../styles'
import { scaleSize, setSpText } from '../../../../utils'
import { getLanguage } from '../../../../language/index'
// import { getPublicAssets } from '../../../../assets'
import { getThemeAssets } from '../../../../assets'
// import { TextInput } from 'react-native-gesture-handler';
import { SMap, Action } from 'imobile_for_reactnative'

var StartMode = {
  START_FOLLOW_LAST: 1,
  POINT_START: 2,
  START_TOGETHER_LAST: 3,
}
var AnimationMode = {
  WAY: 0,
  BLINK: 1,
  ATTRIBUTE: 2,
  SHOW: 3,
  ROTATE: 4,
  SCALE: 5,
  GROW: 6,
}
export default class PlotAnimationView extends React.Component {
  props: {
    setCurrentSymbol?: () => {},
    layerData: Object,
    layerName: string,
    geoId: number,
    device: Object,
    saveAndContinue: () => {},
    savePlotAnimationNode: () => {},
    showToolbar: () => {},
  }

  constructor(props) {
    super(props)
    this.state = {
      //   data: props.data,
      animationMode: -1,
      startTime: 0 + '',
      durationTime: 5 + '',
      startMode: 1,
      data: [],
      wayPoints: [],

      types: [],
    }
  }

  componentDidMount() {
    this.getCurrentGeometryType()
  }

  getCurrentGeometryType = async () => {
    let type = await SMap.getGeometryTypeById(
      this.props.layerName,
      this.props.geoId,
    )
    let data = this.getData()
    let subData = []
    switch (type) {
      case 1:
        subData.push(data[1])
        subData.push(data[2])
        subData.push(data[3])
        // subData.push(data[0])  路径动画投影坐标有问题，暂时先屏蔽
        subData.push(data[4])
        subData.push(data[5])
        break
      case 2:
        subData.push(data[1])
        subData.push(data[2])
        subData.push(data[3])
        subData.push(data[6])
        break
    }

    let types = await SMap.getGeoAnimationTypes(this.props.geoId)

    if (GLOBAL.animationWayData) {
      this.setState({
        data: subData,
        animationMode: GLOBAL.animationWayData.animationMode,
        startTime: GLOBAL.animationWayData.startTime,
        durationTime: GLOBAL.animationWayData.durationTime,
        startMode: GLOBAL.animationWayData.startMode,
        wayPoints: GLOBAL.animationWayData.wayPoints,

        types: types,
      })
    } else {
      this.setState({
        data: subData,

        types: types,
      })
    }
  }

  getCreateInfo = () => {
    return {
      animationMode: this.state.animationMode,
      startTime: parseFloat(this.state.startTime),
      durationTime: parseFloat(this.state.durationTime),
      startMode: this.state.startMode,
      wayPoints: this.state.wayPoints,
    }
  }

  //桌面端顺序7个：路径、闪烁、属性、显隐、旋转、比例、生长
  getData() {
    let data = []
    data.push({
      name: getLanguage(global.language).Map_Plotting.PLOTTING_ANIMATION_WAY,
      image: getThemeAssets().plot.plot_animation_grow,
      animationMode: AnimationMode.WAY,
    })
    data.push({
      name: getLanguage(global.language).Map_Plotting.PLOTTING_ANIMATION_BLINK,
      image: getThemeAssets().plot.plot_animation_appear,
      animationMode: AnimationMode.BLINK,
    })
    data.push({
      name: getLanguage(global.language).Map_Plotting
        .PLOTTING_ANIMATION_ATTRIBUTE,
      image: getThemeAssets().plot.plot_animation_arcs,
      animationMode: AnimationMode.ATTRIBUTE,
    })
    data.push({
      name: getLanguage(global.language).Map_Plotting.PLOTTING_ANIMATION_SHOW,
      image: getThemeAssets().plot.plot_animation_shrink,
      animationMode: AnimationMode.SHOW,
    })
    data.push({
      name: getLanguage(global.language).Map_Plotting.PLOTTING_ANIMATION_ROTATE,
      image: getThemeAssets().plot.plot_animation_fade_in,
      animationMode: AnimationMode.ROTATE,
    })
    data.push({
      name: getLanguage(global.language).Map_Plotting.PLOTTING_ANIMATION_SCALE,
      image: getThemeAssets().plot.plot_animation_fade_out,
      animationMode: AnimationMode.SCALE,
    })
    data.push({
      name: getLanguage(global.language).Map_Plotting.PLOTTING_ANIMATION_GROW,
      image: getThemeAssets().plot.plot_animation_flash,
      animationMode: AnimationMode.GROW,
    })
    return data
  }

  action = ({ item }) => {
    this.setState({
      animationMode: item.animationMode,
      data: this.state.data.concat(),
    })
  }

  clearNoNum = value => {
    value = value.replace(/[^\d.]/g, '') //清除“数字”和“.”以外的字符
    value = value.replace(/\.{2,}/g, '.') //只保留第一个. 清除多余的
    value = value
      .replace('.', '$#$')
      .replace(/\./g, '')
      .replace('$#$', '.')
    // value = value.replace(/^(\-)*(\d+)\.(\d\d).*$/,'$1$2.$3');//只能输入两个小数
    if (value.indexOf('.') < 0 && value != '') {
      //以上已经过滤，此处控制的是如果没有小数点，首位不能为类似于 01、02的金额
      value = parseFloat(value)
    } else if (value == '') {
      value = 0
    }
    return value + ''
  }

  _renderItem = ({ item }) => {
    return (
      <TouchableOpacity
        // style={styles.tableItem}
        style={{
          // paddingVertical: scaleSize(20),
          justifyContent: 'center',
          alignItems: 'center',
          flexDirection: 'column',
          backgroundColor:
            item.animationMode == this.state.animationMode
              ? color.gray3
              : color.bgW,
        }}
        key={item.name}
        onPress={() => this.action({ item })}
      >
        <View>
          <View
            style={{
              position: 'absolute',
              backgroundColor: 'red',
              // height: item.animationMode == 0 ? scaleSize(15) : 0,
              height:
                this.state.types && this.state.types[item.animationMode] > 0
                  ? scaleSize(15)
                  : 0,
              width: scaleSize(15),
              borderRadius: scaleSize(15),
              right: scaleSize(0),
              top: scaleSize(2),
            }}
          >
            <Text
              style={{
                textAlign: 'center',
                color: color.bgW,
                fontSize: setSpText(10),
              }}
            >
              {/* {this.state.wayPoints.length + ''} */}
              {this.state.types && this.state.types[item.animationMode] + ''}
            </Text>
          </View>
          <Image source={item.image} style={styles.tableItemImg} />
        </View>
        <View style={styles.listItemContent}>
          <Text style={styles.tableItemtext}>{item.name}</Text>
        </View>
      </TouchableOpacity>
    )
  }

  renderView() {
    return (
      <View style={styles.container}>
        <View style={styles.titleView}>
          <Text style={styles.textTitle}>
            {getLanguage(global.language).Map_Plotting.PLOTTING_ANIMATION_MODE}
          </Text>
        </View>

        <TableList
          style={styles.table}
          // data={animationModeData}
          data={this.state.data}
          numColumns={4}
          renderCell={this._renderItem}
          device={this.props.device}
        />
        <View style={styles.titleView}>
          <Text style={styles.textTitle}>
            {
              getLanguage(global.language).Map_Plotting
                .PLOTTING_ANIMATION_OPERATION
            }
          </Text>
        </View>
        <View style={styles.startTime}>
          <Text style={styles.startTimeText}>
            {
              getLanguage(global.language).Map_Plotting
                .PLOTTING_ANIMATION_START_TIME
            }
          </Text>
          <View style={styles.startTimeView}>
            <TouchableOpacity
              style={styles.modifyTime}
              onPress={this.subStartTime}
            >
              <Image
                source={require('../../../../assets/publicTheme/plot/plot_reduce.png')}
                style={styles.tableItemImg}
              />
            </TouchableOpacity>
            <TextInput
              style={styles.inputTime}
              onChangeText={text => {
                this.setState({
                  startTime: this.clearNoNum(text),
                })
              }}
              keyboardType="numeric"
              value={this.state.startTime + ''}
            />
            <TouchableOpacity
              style={styles.modifyTime}
              onPress={this.addStartTime}
            >
              <Image
                source={require('../../../../assets/publicTheme/plot/plot_add.png')}
                style={styles.tableItemImg}
              />
            </TouchableOpacity>
          </View>
        </View>
        <View style={styles.lineStyle} />
        <View style={styles.startTime}>
          <Text style={styles.startTimeText}>
            {
              getLanguage(global.language).Map_Plotting
                .PLOTTING_ANIMATION_DURATION
            }
          </Text>

          <View style={styles.startTimeView}>
            <TouchableOpacity
              style={styles.modifyTime}
              onPress={this.subDurationTime}
            >
              <Image
                source={require('../../../../assets/publicTheme/plot/plot_reduce.png')}
                style={styles.tableItemImg}
              />
            </TouchableOpacity>
            <TextInput
              style={styles.inputTime}
              keyboardType="numeric"
              onChangeText={text => {
                this.setState({
                  durationTime: this.clearNoNum(text),
                })
              }}
              value={this.state.durationTime + ''}
            />
            <TouchableOpacity
              style={styles.modifyTime}
              onPress={this.addDurationTime}
            >
              <Image
                source={require('../../../../assets/publicTheme/plot/plot_add.png')}
                style={styles.tableItemImg}
              />
            </TouchableOpacity>
          </View>
        </View>

        <View style={styles.titleView}>
          <Text style={styles.textTitle}>
            {
              getLanguage(global.language).Map_Plotting
                .PLOTTING_ANIMATION_START_MODE
            }
          </Text>
        </View>
        <TouchableOpacity onPress={this.setStratModeFllowLast}>
          <View style={styles.startTime}>
            <Text style={styles.startTimeText}>
              {
                getLanguage(global.language).Map_Plotting
                  .PLOTTING_ANIMATION_FLLOW_LAST
              }
            </Text>
            <View style={styles.startTimeView}>
              <Image
                source={
                  this.state.startMode == StartMode.START_FOLLOW_LAST
                    ? require('../../../../assets/mapTools/icon_submit_black.png')
                    : null
                }
                style={styles.startModeImage}
              />
            </View>
          </View>
        </TouchableOpacity>
        <View style={styles.lineStyle} />
        <TouchableOpacity onPress={this.setStratModePointStart}>
          <View style={styles.startTime}>
            <Text style={styles.startTimeText}>
              {
                getLanguage(global.language).Map_Plotting
                  .PLOTTING_ANIMATION_CLICK_START
              }
            </Text>
            <View style={styles.startTimeView}>
              <Image
                source={
                  this.state.startMode == StartMode.POINT_START
                    ? require('../../../../assets/mapTools/icon_submit_black.png')
                    : null
                }
                style={styles.startModeImage}
              />
            </View>
          </View>
        </TouchableOpacity>
        <View style={styles.lineStyle} />
        <TouchableOpacity onPress={this.setStratModeTogetherLast}>
          <View style={styles.startTime}>
            <Text style={styles.startTimeText}>
              {
                getLanguage(global.language).Map_Plotting
                  .PLOTTING_ANIMATION_TOGETHER_LAST
              }
            </Text>
            <View style={styles.startTimeView}>
              <Image
                source={
                  this.state.startMode == StartMode.START_TOGETHER_LAST
                    ? require('../../../../assets/mapTools/icon_submit_black.png')
                    : null
                }
                style={styles.startModeImage}
              />
            </View>
          </View>
        </TouchableOpacity>
        {this.state.animationMode != 0 ? null : (
          <View style={styles.endlineStyle} />
        )}
        {this.state.animationMode != 0 ? null : (
          <TouchableOpacity
            style={{
              height: this.state.animationMode == 0 ? scaleSize(80) : 0,
            }}
            onPress={this.createAnimationWay}
          >
            <View style={styles.startTime}>
              <Text style={styles.startTimeText}>
                {
                  getLanguage(global.language).Map_Plotting
                    .PLOTTING_ANIMATION_WAY_SET
                }
              </Text>
              <View style={styles.startTimeView}>
                <Image
                  source={require('../../../../assets/Mine/mine_my_arrow.png')}
                  style={styles.startModeImage}
                />
              </View>
            </View>
          </TouchableOpacity>
        )}

        <View style={styles.endlineStyle} />
        <View>
          <TouchableOpacity onPress={this.saveAndContinue}>
            <View style={styles.saveAndContinueView2}>
              <Image
                source={require('../../../../assets/publicTheme/plot/plot_add.png')}
                style={styles.saveAndContinueImage}
              />
              <Text style={styles.saveAndContinueText}>
                {
                  getLanguage(global.language).Map_Plotting
                    .PLOTTING_ANIMATION_CONTINUE
                }
              </Text>
            </View>
          </TouchableOpacity>
        </View>
      </View>
    )
  }
  saveAndContinue = async () => {
    this.props.saveAndContinue()
    GLOBAL.animationWayData && (GLOBAL.animationWayData = null)
    // this.scrollView.scrollTo(0,0)
    this.scrollView.scrollTo({ x: 0, y: 0, animated: true })
    // let types=await SMap.getGeoAnimationTypes(this.props.geoId);
    if (this.state.animationMode != -1 && this.state.types) {
      this.state.types[this.state.animationMode] =
        this.state.types[this.state.animationMode] + 1
      this.setState({
        types: this.state.types,
        data: this.state.data.concat(),
      })
    }
  }
  addDurationTime = () => {
    let time = (Number(this.state.durationTime) * 1000 + 1 * 1000) / 1000
    this.setState({
      durationTime: time + '',
    })
  }
  subDurationTime = () => {
    let time = (Number(this.state.durationTime) * 1000 - 1 * 1000) / 1000
    time = time < 0 ? 0 : time
    this.setState({
      durationTime: time + '',
    })
  }
  modifyDurationTime = ({ offset }) => {
    let time = this.state.durationTime + offset
    time = time > 0 ? time : this.state.durationTime
    this.setState({
      durationTime: time + '',
    })
  }

  addStartTime = () => {
    let time = (Number(this.state.startTime) * 1000 + 1 * 1000) / 1000
    this.setState({
      startTime: time + '',
    })
  }
  subStartTime = () => {
    let time = (Number(this.state.startTime) * 1000 - 1 * 1000) / 1000
    time = time < 0 ? 0 : time
    this.setState({
      startTime: time,
    })
  }

  modifyStartTime = ({ offset }) => {
    let time = this.state.startTime + offset
    time = time > 0 ? time : this.state.startTime
    this.setState({
      startTime: time,
    })
  }

  setStratMode = ({ mode }) => {
    this.setState({
      startMode: mode,
    })
  }

  setStratModeFllowLast = () => {
    this.setState({
      startMode: StartMode.START_FOLLOW_LAST,
    })
  }

  setStratModePointStart = () => {
    this.setState({
      startMode: StartMode.POINT_START,
    })
  }

  setStratModeTogetherLast = () => {
    this.setState({
      startMode: StartMode.START_TOGETHER_LAST,
    })
  }

  cancle = () => {
    // SMap.endAnimationWayPoint(false)
    SMap.cancelAnimationWayPoint()
    GLOBAL.TouchType = TouchType.NULL
    GLOBAL.animationWayData && (GLOBAL.animationWayData = null)
    let height = 0
    // this.props.showFullMap && this.props.showFullMap(true)
    let type = ConstToolType.PLOT_ANIMATION_START
    this.props.showToolbar(true, type, {
      isFullScreen: false,
      height,
      cb: () => SMap.setAction(Action.SELECT),
    })
  }

  createAnimationWay = () => {
    if (this.state.animationMode === 0) {
      GLOBAL.animationWayData = this.getCreateInfo()
      GLOBAL.TouchType = TouchType.ANIMATION_WAY
      this.props.showToolbar(true, ConstToolType.PLOT_ANIMATION_WAY, {
        containerType: 'table',
        height: ConstToolType.HEIGHT[0],
        isFullScreen: false,
        cb: () => SMap.setAction(Action.PAN),
      })
    }
  }

  render() {
    return (
      <View style={styles.container}>
        <View style={styles.headerItem}>
          <TouchableOpacity style={styles.startTimeText} onPress={this.cancle}>
            <Text style={styles.startTimeText}>
              {getLanguage(global.language).Map_Settings.CANCEL}
            </Text>
          </TouchableOpacity>

          <View style={styles.startTimeView}>
            <TouchableOpacity
              style={styles.startTimeText}
              onPress={this.props.savePlotAnimationNode}
            >
              <Text style={styles.startTimeText}>
                {
                  getLanguage(global.language).Map_Plotting
                    .PLOTTING_ANIMATION_SAVE
                }
              </Text>
            </TouchableOpacity>
          </View>
        </View>

        <ScrollView
          style={styles.container}
          ref={ref => (this.scrollView = ref)}
        >
          {this.renderView()}
        </ScrollView>
      </View>
    )
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    //   flexDirection: 'column',
    backgroundColor: color.bgW,
  },
  table: {
    flex: 1,
    //   paddingHorizontal: scaleSize(30),
    // paddingVertical:scaleSize(20),
    // alignItems: 'center',
    backgroundColor: color.bgW,
  },
  tableItem: {
    justifyContent: 'center',
    alignItems: 'center',
    flexDirection: 'column',
    paddingVertical: scaleSize(20),
  },
  tableItemImg: {
    height: scaleSize(64),
    width: scaleSize(64),
  },
  tableItemtext: {
    height: scaleSize(40),
    width: scaleSize(100),
    fontSize: setSpText(18),
    alignContent: 'center',
    justifyContent: 'center',
    textAlign: 'center',
  },

  titleView: {
    alignContent: 'center',
    justifyContent: 'center',
    paddingLeft: scaleSize(20),
    height: scaleSize(60),
    backgroundColor: color.gray3,
  },
  textTitle: {
    // padding: scaleSize(5),
    fontSize: setSpText(24),
    // paddingLeft: scaleSize(80),
    // height: scaleSize(80),
    textAlign: 'auto',
    // backgroundColor: color.bgG,
    color: color.themeText2,
  },

  startTimeView: {
    flexDirection: 'row',
    flex: 1,
    marginRight: scaleSize(20),
    justifyContent: 'flex-end',
    alignItems: 'center',
    // backgroundImage: "url(" + require("../../../../assets/mapEdit/icon-delete-white.png") + ")"
  },
  lineStyle: {
    flex: 1,
    backgroundColor: color.bgG,
    height: scaleSize(1.5),
    marginLeft: scaleSize(40),
    marginRight: scaleSize(40),
  },
  startTime: {
    flexDirection: 'row',
    height: scaleSize(80),
    padding: scaleSize(40),
    alignItems: 'center',
    alignSelf: 'center',
  },
  startTimeText: {
    fontSize: setSpText(20),
    height: scaleSize(30),
    color: color.themeText2,
    textAlign: 'center',
    padding: scaleSize(3),
  },
  modifyTime: {
    height: scaleSize(60),
    width: scaleSize(60),
  },
  inputTime: {
    height: scaleSize(80),
    width: scaleSize(60),
    fontSize: setSpText(20),
    textAlign: 'center',
  },
  startMode: {
    flexDirection: 'row',
    height: 100,
    flex: 1,
  },
  startModetext: {
    height: scaleSize(80),
    // width:scaleSize(100),
    // flex:2,
    paddingLeft: scaleSize(20),
  },
  startModeImage: {
    height: scaleSize(46),
    width: scaleSize(46),
    // flex:1,
    justifyContent: 'flex-end',
    alignItems: 'center',
  },
  endlineStyle: {
    flex: 1,
    backgroundColor: color.bgG,
    height: scaleSize(1.5),
  },
  saveAndContinueImage: {
    height: scaleSize(40),
    width: scaleSize(40),
    // backgroundColor:color.blue1,
  },
  saveAndContinueView2: {
    flexDirection: 'row',
    height: scaleSize(80),
    justifyContent: 'center',
    alignItems: 'center',
  },
  saveAndContinueText: {
    fontSize: setSpText(24),
    textAlign: 'center',
    color: color.blue2,
  },
  headerItem: {
    flexDirection: 'row',
    height: scaleSize(60),
    padding: scaleSize(30),
    alignItems: 'center',
    alignSelf: 'center',
  },
})
