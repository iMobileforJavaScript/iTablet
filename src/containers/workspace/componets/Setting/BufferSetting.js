import * as React from 'react'
import { Text, View } from 'react-native'
import { Row, Button } from '../../../../components'
import { scaleSize, Toast } from '../../../../utils'
import { BufferEndType, Action, DatasetType } from 'imobile_for_reactnative'
import ChooseLayer from './ChooseLayer'
import styles from './styles'

export default class BufferSetting extends React.Component {
  props: {
    data: Object,
    type: String,
    mapControl: Object,
    workspace: Object,
    selection: Object,
    map: Object,
    getData: () => {},
    close: () => {},
    setBufferSetting: () => {},
    setLoading: () => {},
  }

  constructor(props) {
    super(props)
    let layer = props.data && props.data.selectedLayer
    this.state = {
      distance: (props.data && props.data.distance) || 3,
      endType: (props.data && props.data.endType) || BufferEndType.ROUND,

      label: (layer && layer.caption) || '请选择',
      selectedLayer: (props.data && props.data.selectedLayer) || {},
      bufferTypes:
        (layer && layer.type === DatasetType.LINE) || !layer
          ? [
            { title: '圆头缓冲', value: BufferEndType.ROUND },
            { title: '平头缓冲', value: BufferEndType.FLAT },
          ]
          : [{ title: '圆头缓冲', value: BufferEndType.ROUND }],
    }
  }

  getData = () => {
    return {
      distance: this.state.distance,
      endType: this.state.endType,
      selectedLayer: this.state.selectedLayer,
    }
  }

  getEndType = ({ value }) => {
    this.setState({
      endType: value,
    })
  }

  getDistance = value => {
    this.setState({
      distance: value,
    })
  }

  getLayer = () => {
    // {title, selectedgetSecondObj, index, value}
    this.chooseLayer && this.chooseLayer.show()
  }

  getDataset = item => {
    this.setState({
      label: item.name,
      selectedLayer: item,
      bufferTypes:
        item.type === DatasetType.LINE
          ? [
            { title: '圆头缓冲', value: BufferEndType.ROUND },
            { title: '平头缓冲', value: BufferEndType.FLAT },
          ]
          : [{ title: '圆头缓冲', value: BufferEndType.ROUND }],
      endType:
        item.type !== DatasetType.LINE
          ? BufferEndType.ROUND
          : this.state.endType,
    })
  }

  confirm = () => {
    (async function() {
      if (!this.state.selectedLayer.name) {
        Toast.show('请选择分析图层')
        return
      }
      let layer = await this.props.map.getLayer(this.state.selectedLayer.name)
      await layer.setSelectable(true)
      this.props.setBufferSetting && this.props.setBufferSetting(this.getData())
      this.props.mapControl.setAction(Action.SELECT)
      this.close()
      Toast.show('设置成功')
    }.bind(this)())
  }

  close = () => {
    this.props.close && this.props.close()
  }

  renderSelect = () => {
    return (
      <View style={styles.container}>
        <View style={styles.titleView}>
          <Text style={styles.title}>参数设置</Text>
        </View>
        <View style={styles.content}>
          <Row
            style={{ marginTop: scaleSize(30) }}
            key={'缓冲数据'}
            defaultValue={'请选择缓冲数据'}
            value={this.state.label}
            type={Row.Type.TEXT_BTN}
            title={'缓冲数据'}
            getValue={this.getLayer}
          />
          <Row
            style={styles.row}
            key={'缓冲类型'}
            title={'缓冲类型'}
            type={Row.Type.RADIO_GROUP}
            defaultValue={this.state.endType}
            radioArr={this.state.bufferTypes}
            radioColumn={1}
            getValue={this.getEndType}
          />
          <Row
            style={styles.row}
            key={'缓冲半径'}
            title={'缓冲半径'}
            minValue={1}
            maxValue={50}
            unit={'m'}
            type={Row.Type.CHOOSE_NUMBER}
            defaultValue={this.state.distance}
            getValue={this.getDistance}
          />
        </View>
      </View>
    )
  }

  renderBtns = () => {
    return (
      <View style={styles.btns}>
        {/*</TouchableOpacity>*/}
        <Button key={'确定'} title={'确定'} onPress={this.confirm} />
        <Button
          key={'取消'}
          type={Button.Type.GRAY}
          title={'取消'}
          onPress={this.close}
        />
      </View>
    )
  }

  renderChooseLayer = () => {
    return (
      <ChooseLayer
        ref={ref => (this.chooseLayer = ref)}
        map={this.props.map}
        mapcontrol={this.props.mapControl}
        workspace={this.props.workspace}
        getDataset={this.getDataset}
        setLoading={this.props.setLoading}
        listType={'layer'}
      />
    )
  }

  render() {
    return (
      <View style={styles.container}>
        {this.renderSelect()}
        {this.renderBtns()}
        {this.renderChooseLayer()}
      </View>
    )
  }
}
