import * as React from 'react'
import { TouchableOpacity, View, Text } from 'react-native'
import BufferSetting from './BufferSetting'
import OverlaySetting from './OverlaySetting'
import RouteSetting from './RouteSetting'
import TrackingSetting from './TrackingSetting'
import ChooseLayer from './ChooseLayer'
import { facilityAnalyst } from '../../util'
import { DatasetType } from 'imobile_for_javascript'

import styles from './styles'

const BUFFER = 'buffer'
const OVERLAY = 'overlay'
const NETWORK = 'network'
const NETWORK_ROUTE = 'network_route'
const NETWORK_FACILITY = 'network_facility'
const NETWORK_TSP = 'network_tsp'
const NETWORK_TRACKING = 'network_tracking'

const ROUTE = 'route'
const TRACKING = 'tracking'

export default class Setting extends React.Component {

  props: {
    type: String,
    mapControl: Object,
    workspace: Object,
    selection: Object,
    map: Object,
    bufferSetting: Object,
    overlaySetting: Object,
    setBufferSetting: () => {},
    setOverlaySetting: () => {},
    setLoading: () => {},
    setAnalystLayer: () => {},
  }

  static defaultProps = {
    type: BUFFER,
  }

  constructor(props) {
    super(props)
    this.state = {
      visible: false,
      type: props.type,
    }
  }

  isVisible = () => {
    return this.state.visible
  }
  
  chooseLayerIsVisible = () => {
    this.overlaySetting && this.overlaySetting.chooseLayerIsVisible()
  }

  showSetting = (type, visible = true) => {
    let v = visible
    if (visible === undefined) {
      v = !this.state.visible
    }
    this.setState({
      visible: v,
      type,
    })
  }

  close = () => {
    if (this.overlaySetting && this.overlaySetting.chooseLayer && this.overlaySetting.chooseLayer.isVisible()) {
      this.overlaySetting.chooseLayer.close()
    } else {
      this.setState({
        visible: false,
      })
    }
  }
  
  trackingLoad = async (data) => {
    this.close()
    try {
      this.props.setLoading(true)
      let datasetVector = await data.dataset.toDatasetVector()
      await facilityAnalyst.loadModel(this.props.workspace, this.props.mapControl, datasetVector)
      this.props.setLoading(false)
    } catch (e) {
      this.props.setLoading(false)
    }
  }

  getSetting = () => {
    let settingView
    switch (this.state.type) {
      case BUFFER: {
        settingView = (
          <BufferSetting
            ref={ref => this.bufferSetting = ref}
            close={this.close}
            chooseLayer={this.chooseLayer}
            data={this.props.bufferSetting}
            setBufferSetting={this.props.setBufferSetting}
            map={this.props.map}
            mapcontrol={this.props.mapControl}
            workspace={this.props.workspace} />
        )
        break
      }
      case OVERLAY: {
        settingView = (
          <OverlaySetting
            ref={ref => this.overlaySetting = ref}
            close={this.close}
            chooseLayer={this.chooseLayer}
            data={this.props.overlaySetting}
            setOverlaySetting={this.props.setOverlaySetting}
            map={this.props.map}
            mapcontrol={this.props.mapControl}
            workspace={this.props.workspace}
            setLoading={this.props.setLoading}/>
        )
        break
      }
      case ROUTE: {
        settingView = (
          <RouteSetting
            ref={ref => this.overlaySetting = ref}
            close={this.close}
            chooseLayer={this.chooseLayer}
            data={this.props.overlaySetting}
            setOverlaySetting={this.props.setOverlaySetting}
            map={this.props.map}
            mapcontrol={this.props.mapControl}
            workspace={this.props.workspace}
            setLoading={this.props.setLoading}/>
        )
        break
      }
      case NETWORK_TRACKING: {
        // settingView = (
        //   <TrackingSetting
        //     ref={ref => this.overlaySetting = ref}
        //     close={this.close}
        //     chooseLayer={this.chooseLayer}
        //     data={this.props.overlaySetting}
        //     setOverlaySetting={this.props.setOverlaySetting}
        //     map={this.props.map}
        //     mapcontrol={this.props.mapControl}
        //     workspace={this.props.workspace}
        //     setLoading={this.props.setLoading}/>
        // )
        settingView = (
          <ChooseLayer
            ref={ref => this.chooseLayer = ref}
            alwaysVisible={true}
            map={this.props.map}
            mapcontrol={this.props.mapControl}
            workspace={this.props.workspace}
            getDataset={this.trackingLoad}
            setLoading={this.props.setLoading}
            type={DatasetType.LINE}
          />
        )
        break
      }
    }
    return settingView
  }

  // renderBtns = () => {
  //   return (
  //     <View style={styles.btns}>
  //       {/*</TouchableOpacity>*/}
  //       <Button key={'确定'} title={'确定'} onPress={this.confirm}/>
  //       <Button key={'取消'} type={Button.Type.GRAY} title={'取消'} onPress={this.close}/>
  //     </View>
  //   )
  // }

  render() {
    if (this.state.visible) {
      return (
        <TouchableOpacity
          activeOpacity={1}
          style={styles.bg}
          // onPress={this.close}
        >
          <View style={[styles.container, {justifyContent: 'space-between'}]}>
            {this.getSetting()}
            {/*{this.renderBtns()}*/}
          </View>
        </TouchableOpacity>
      )
    } else {
      return null
    }
  }
}

Setting.Type = {
  BUFFER: BUFFER,
  OVERLAY: OVERLAY,
  NETWORK: NETWORK,
  NETWORK_ROUTE: NETWORK_ROUTE,
  NETWORK_FACILITY: NETWORK_FACILITY,
  NETWORK_TSP: NETWORK_TSP,
  NETWORK_TRACKING: NETWORK_TRACKING,
}