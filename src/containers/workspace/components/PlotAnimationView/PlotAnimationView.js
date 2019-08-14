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
import { TableList } from '../../../../components'
import { color } from '../../../../styles'
import { scaleSize, setSpText } from '../../../../utils'
import { getLanguage } from '../../../../language/index'
// import { getPublicAssets } from '../../../../assets'
import { getThemeAssets } from '../../../../assets'
// import { TextInput } from 'react-native-gesture-handler';
import { SMap } from 'imobile_for_reactnative'

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
    themeSymbolType: '',
  }

  constructor(props) {
    super(props)
    this.state = {
      //   data: props.data,
      animationMode: -1,
      startTime: 0,
      durationTime: 5,
      startMode: 1,
      data: [],
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
        // subData.push(data[0])   //路径动画，暂不支持
        subData.push(data[1])
        // subData.push(data[2])
        subData.push(data[3])
        subData.push(data[4])
        subData.push(data[5])
        break
      case 2:
        subData.push(data[1])
        // subData.push(data[2])
        subData.push(data[3])
        subData.push(data[6])
        break
    }
    this.setState({
      data: subData,
    })
  }

  getCreateInfo = () => {
    return {
      animationMode: this.state.animationMode,
      startTime: this.state.startTime,
      durationTime: this.state.durationTime,
      startMode: this.state.startMode,
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
        <Image
          //   source={{ uri: 'file://' + item.image }}
          source={item.image}
          style={styles.tableItemImg}
        />
        <View style={styles.listItemContent}>
          <Text style={styles.tableItemtext}>{item.name}</Text>
        </View>
      </TouchableOpacity>
    )
  }

  renderView() {
    // let animationModeData = this.getData()
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
                source={require('../../../../assets/mapEdit/Frenchgrey/工具条-缩小.png')}
                style={styles.tableItemImg}
              />
            </TouchableOpacity>
            <TextInput
              style={styles.inputTime}
              onChangeText={text => {
                this.setState({ startTime: text.replace(/[^0-9.]*/g, '') })
              }}
              keyboardType="numeric"
              value={this.state.startTime + ''}
            />
            <TouchableOpacity
              style={styles.modifyTime}
              onPress={this.addStartTime}
            >
              <Image
                source={require('../../../../assets/mapEdit/Frenchgrey/工具条-放大.png')}
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
                source={require('../../../../assets/mapEdit/Frenchgrey/工具条-缩小.png')}
                style={styles.tableItemImg}
              />
            </TouchableOpacity>
            <TextInput
              style={styles.inputTime}
              keyboardType="numeric"
              onChangeText={text => {
                this.setState({ durationTime: text.replace(/[^0-9.]*/g, '') })
              }}
              value={this.state.durationTime + ''}
            />
            <TouchableOpacity
              style={styles.modifyTime}
              onPress={this.addDurationTime}
            >
              <Image
                source={require('../../../../assets/mapEdit/Frenchgrey/工具条-放大.png')}
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
      </View>
    )
  }
  addDurationTime = () => {
    let time = Number(this.state.durationTime) + 1
    this.setState({
      durationTime: time,
    })
  }
  subDurationTime = () => {
    let time = Number(this.state.durationTime) - 1
    time = time < 0 ? 0 : time
    this.setState({
      durationTime: time,
    })
  }
  modifyDurationTime = ({ offset }) => {
    let time = this.state.durationTime + offset
    time = time > 0 ? time : this.state.durationTime
    this.setState({
      durationTime: time,
    })
  }

  addStartTime = () => {
    let time = Number(this.state.startTime) + 1
    this.setState({
      startTime: time,
    })
  }
  subStartTime = () => {
    let time = Number(this.state.startTime) - 1
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

  render() {
    return <ScrollView style={styles.container}>{this.renderView()}</ScrollView>
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
    width: scaleSize(64),
    fontSize: setSpText(18),
    alignContent: 'center',
    justifyContent: 'center',
    textAlign: 'center',
  },

  titleView: {
    alignContent: 'center',
    justifyContent: 'center',
    paddingLeft: scaleSize(46),
    height: scaleSize(80),
    backgroundColor: color.gray3,
  },
  textTitle: {
    // padding: scaleSize(5),
    fontSize: setSpText(20),
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
    marginLeft: scaleSize(20),
    marginRight: scaleSize(20),
  },
  startTime: {
    flexDirection: 'row',
    height: scaleSize(100),
    padding: scaleSize(20),
    alignItems: 'center',
    // alignSelf: 'center',
  },
  startTimeText: {
    fontSize: setSpText(18),
    textAlign: 'auto',
    color: color.themeText2,
  },
  modifyTime: {
    height: scaleSize(60),
    width: scaleSize(60),
  },
  inputTime: {
    height: scaleSize(100),
    width: scaleSize(60),
    fontSize: setSpText(18),
    textAlign: 'center',
  },
  startMode: {
    flexDirection: 'row',
    height: 100,
    flex: 1,
  },
  startModetext: {
    height: scaleSize(100),
    // width:scaleSize(100),
    // flex:2,
    paddingLeft: scaleSize(20),
  },
  startModeImage: {
    height: scaleSize(60),
    width: scaleSize(60),
    // flex:1,
    justifyContent: 'flex-end',
    alignItems: 'center',
  },
})
