import * as React from 'react'
import { TouchableOpacity, View } from 'react-native'
import BufferSetting from './BufferSetting'
import OverlaySetting from './OverlaySetting'
import RouteSetting from './RouteSetting'
import TrackingSetting from './TrackingSetting'
import ChooseLayer from './ChooseLayer'
import { Toast, facilityAnalyst, tranportationAnalyst } from '../../util'
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
    mapView: Object,
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

  /**
   * 判断数据集是否被添加
   * @param dsName
   * @returns {Promise}
   */
  checkContainsDataset = async dsName => {
    return new Promise(async (resolve, reject) => {
      try {
        let layerNameArr = await this.props.map.getLayersByType()
        let layer = null
        for (let i = 0; i < layerNameArr.length; i++) {
          let ds = await layerNameArr[i].layer.getDataset()
          let name = await ds.getName()
          if (name === dsName && layerNameArr[i].name.indexOf(name + '_Node') < 0) {
            layer = layerNameArr[i].layer
            break
          }
          // 若是网络数据集，则还要匹配其子数据集
          else if (await ds.getType() === DatasetType.Network) {
            let dv = await ds.toDatasetVector()
            // let subDataset = await dv.getChildDataset()
            // if (subDataset && await subDataset.getName() === dsName) {
            //   layer = layerNameArr[i].layer
            //   break
            // }
            let subDataset = await dv.getChildDataset()
            if (subDataset && layerNameArr[i].name.indexOf(dsName) >= 0 && dsName.indexOf('_Node') >= 0) {
              layer = layerNameArr[i].layer
              break
            }
          }
        }
        resolve(layer)
      } catch (e) {
        reject(e)
      }
    })
  }

  loadModel = async data => {
    this.close()
    try {
      this.props.setLoading(true)
      let datasetVector = await data.dataset.toDatasetVector()
      let subDataset = await datasetVector.getChildDataset()
      if (subDataset) {
        // let subDatasetVector = await subDataset.toDatasetVector()
        let analystLayerName = await data.dataset.getName()
        let analystLayer = await this.checkContainsDataset(analystLayerName)
        if (!analystLayer) {
          analystLayer = await this.props.map.addLayer(data.dataset, true)
          await this.props.map.refresh()
        }

        let subName = await subDataset.getName()
        let nodeLayer = await this.checkContainsDataset(subName)
        if (!nodeLayer) {
          nodeLayer = await this.props.map.addLayer(subDataset, true)
          await this.props.map.refresh()
        }
        let result = await facilityAnalyst.loadModel(this.props.mapControl, analystLayer, nodeLayer, datasetVector)
        this.props.setLoading && this.props.setLoading(false)
        if (result) {
          Toast.show('加载数据成功')
        } else {
          Toast.show('加载数据失败')
        }
      } else {
        Toast.show('加载数据失败')
      }
      this.props.setLoading(false)
    } catch (e) {
      this.props.setLoading(false)
    }
  }

  getSetting = () => {
    let settingView
    switch (this.state.type) {
      case BUFFER:
        settingView = (
          <BufferSetting
            ref={ref => this.bufferSetting = ref}
            close={this.close}
            chooseLayer={this.chooseLayer}
            data={this.props.bufferSetting}
            setBufferSetting={this.props.setBufferSetting}
            map={this.props.map}
            mapControl={this.props.mapControl}
            workspace={this.props.workspace}
            setLoading={this.props.setLoading}/>
        )
        break
      case OVERLAY:
        settingView = (
          <OverlaySetting
            ref={ref => this.overlaySetting = ref}
            close={this.close}
            chooseLayer={this.chooseLayer}
            data={this.props.overlaySetting}
            setOverlaySetting={this.props.setOverlaySetting}
            map={this.props.map}
            mapControl={this.props.mapControl}
            workspace={this.props.workspace}
            setLoading={this.props.setLoading}/>
        )
        break
      case ROUTE:
        settingView = (
          <RouteSetting
            ref={ref => this.overlaySetting = ref}
            close={this.close}
            chooseLayer={this.chooseLayer}
            data={this.props.overlaySetting}
            setOverlaySetting={this.props.setOverlaySetting}
            map={this.props.map}
            mapControl={this.props.mapControl}
            workspace={this.props.workspace}
            setLoading={this.props.setLoading}/>
        )
        break
      case NETWORK_TRACKING:
      case NETWORK_TSP:
      case NETWORK_FACILITY:
        // settingView = (
        //   <TrackingSetting
        //     ref={ref => this.overlaySetting = ref}
        //     close={this.close}
        //     chooseLayer={this.chooseLayer}
        //     data={this.props.overlaySetting}
        //     setOverlaySetting={this.props.setOverlaySetting}
        //     map={this.props.map}
        //     mapControl={this.props.mapControl}
        //     workspace={this.props.workspace}
        //     setLoading={this.props.setLoading}/>
        // )
        settingView = (
          <ChooseLayer
            ref={ref => this.chooseLayer = ref}
            headerTitile={'图层选择'}
            alwaysVisible={true}
            map={this.props.map}
            mapControl={this.props.mapControl}
            workspace={this.props.workspace}
            getDataset={this.loadModel}
            setLoading={this.props.setLoading}
            type={DatasetType.Network}
            // typeFilter={[DatasetType.Network]}
          />
        )
        break
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
          <View style={[styles.container, { justifyContent: 'space-between' }]}>
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