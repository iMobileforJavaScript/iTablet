import * as React from 'react'
import { Text, View } from 'react-native'
import { Row, RadioGroup, Button } from '../../../../components'
import { scaleSize, Toast } from '../../../../utils'
import { DatasetType } from 'imobile_for_reactnative'
import ChooseLayer from './ChooseLayer'

import styles from './styles'

const POINT_REGION = DatasetType.POINT
const LINE_REGION = DatasetType.LINE
const REGION_REGION = DatasetType.REGION

const METHOD_CLIP = 'clip'
const METHOD_ERASE = 'erase'
const METHOD_UNION = 'union'
const METHOD_IDENTITY = 'identity'
const METHOD_XOR = 'xOR'
const METHOD_UPDATE = 'update'
const METHOD_INTERSECT = 'intersect'

const METHODS = [
  [
    { title: '裁剪', value: METHOD_CLIP },
    { title: '擦除', value: METHOD_ERASE },
    { title: '求交', value: METHOD_INTERSECT },
    { title: '同一', value: METHOD_IDENTITY },
  ],
  [
    { title: '裁剪', value: METHOD_CLIP },
    { title: '擦除', value: METHOD_ERASE },
    { title: '求交', value: METHOD_INTERSECT },
    { title: '同一', value: METHOD_IDENTITY },
    { title: '合并', value: METHOD_UNION },
    { title: '更新', value: METHOD_UPDATE },
    { title: '对称差', value: METHOD_XOR },
  ],
]

export default class OverlaySetting extends React.Component {
  props: {
    data: Object,
    type: String,
    mapControl: Object,
    workspace: Object,
    selection: Object,
    map: Object,
    chooseLayer: Object,
    getData: () => {},
    close: () => {},
    setOverlaySetting: () => {},
    setLoading: () => {},
  }

  static defaultProps = {
    data: {
      overlayType: POINT_REGION,
      overlayMethod: METHOD_CLIP,
    },
  }

  constructor(props) {
    super(props)
    let { label, firstValue } = this.getFirst(props.data.overlayType)
    this.state = {
      overlayType: props.data.overlayType,
      first: props.data.datasetVector,
      second: props.data.targetDatasetVector,
      overlayMethod: props.data.overlayMethod,

      firstLabel: label,
      firstValue: props.data.datasetVector.name || firstValue,
      secondValue: props.data.targetDatasetVector.name || '面图层选择',
    }

    this.tempOverLayMothod = props.data.overlayMethod
  }

  // getData = () => {
  //   return {
  //     overlayType: this.state.overlayType,
  //     first: this.state.first,
  //     second: this.state.second,
  //     overlayMethod: this.state.overlayMethod,
  //   }
  // }

  getOverlayType = ({ value }) => {
    // {title, value, index}
    let { label, firstValue } = this.getFirst(value)
    let overlayMethod = ''
    if (value === REGION_REGION) {
      overlayMethod =
        this.state.overlayMethod || this.tempOverLayMothod || METHOD_CLIP
    } else {
      let hasMethod = false
      for (let i = 0; i < METHODS[0].length; i++) {
        if (METHODS[0][i].value === this.state.overlayMethod) {
          overlayMethod = this.state.overlayMethod
          hasMethod = true
          break
        }
      }
      if (!hasMethod) {
        overlayMethod = METHOD_CLIP
        this.tempOverLayMothod = METHOD_CLIP
      }
    }
    this.setState({
      overlayType: value,
      firstLabel: label,
      // secondValue: label,
      firstValue: firstValue,

      overlayMethod: overlayMethod,
    })
  }

  getFirst = value => {
    let label = ''
    let firstValue = ''
    switch (value) {
      case POINT_REGION:
        label = '点图层'
        firstValue = '点图层选择'
        break
      case LINE_REGION:
        label = '线图层'
        firstValue = '线图层选择'
        break
      case REGION_REGION:
        label = '面图层'
        firstValue = '面图层选择'
        break
    }
    return { label, firstValue }
  }

  getOverlayMethod = ({ value }) => {
    // {title, selected, index, value}
    this.setState({
      overlayMethod: value,
    })
    this.tempOverLayMothod = value
  }

  getFirstObj = () => {
    this.labelIndex = 1
    this.chooseLayer && this.chooseLayer.show(this.state.overlayType)
  }

  getSecondObj = () => {
    // {title, selected, index, value}
    this.labelIndex = 2
    this.chooseLayer && this.chooseLayer.show(REGION_REGION)
  }

  chooseLayerIsVisible = () => {
    this.chooseLayer && this.chooseLayer.isVisible()
  }

  getDataset = item => {
    if (this.labelIndex === 1) {
      this.setState({
        firstValue: item.name,
        first: item,
      })
    } else {
      this.setState({
        secondValue: item.name,
        second: item,
      })
    }
  }

  confirm = () => {
    (async function() {
      let firstVector = await this.state.first.dataset.toDatasetVector()
      let secondVector = await this.state.second.dataset.toDatasetVector()
      Object.assign(firstVector, this.state.first)
      Object.assign(secondVector, this.state.second)
      this.props.setOverlaySetting &&
        this.props.setOverlaySetting({
          datasetVector: firstVector,
          targetDatasetVector: secondVector,
          method: this.state.overlayMethod,
          overlayType: this.state.overlayType,
        })
      this.close()
      Toast.show('设置成功')
    }.bind(this)())
  }

  close = () => {
    this.props.close && this.props.close()
  }

  renderChooseLayer = () => {
    return (
      <ChooseLayer
        ref={ref => (this.chooseLayer = ref)}
        map={this.props.map}
        mapControl={this.props.mapControl}
        workspace={this.props.workspace}
        getDataset={this.getDataset}
        setLoading={this.props.setLoading}
      />
    )
  }

  renderLayerSelect = () => {
    return (
      <View style={styles.container}>
        <View style={styles.titleView}>
          <Text style={styles.title}>图层选择</Text>
        </View>
        <View style={styles.content}>
          <Row
            style={styles.row}
            key={'缓冲类型'}
            title={'缓冲类型'}
            type={Row.Type.RADIO_GROUP}
            defaultValue={this.state.overlayType}
            radioArr={[
              { title: '点/面叠加', value: POINT_REGION },
              { title: '线/面叠加', value: LINE_REGION },
              { title: '面/面叠加', value: REGION_REGION },
            ]}
            separatorHeight={scaleSize(20)}
            radioColumn={1}
            getValue={this.getOverlayType}
          />
          <Row
            style={{ marginTop: scaleSize(30) }}
            key={'first-' + this.state.firstLabel}
            value={this.state.firstValue}
            type={Row.Type.TEXT_BTN}
            title={this.state.firstLabel}
            getValue={this.getFirstObj}
          />
          <Row
            style={{ marginTop: scaleSize(30) }}
            key={'second-面图层'}
            value={this.state.secondValue || '面图层选择'}
            type={Row.Type.TEXT_BTN}
            title={'面图层'}
            getValue={this.getSecondObj}
          />
        </View>
      </View>
    )
  }

  renderOverlayMethod = () => {
    // if (this.state.overlayType !== REGION_REGION) return null
    let methods =
      this.state.overlayType === REGION_REGION ? METHODS[1] : METHODS[0]
    return (
      <View style={styles.container}>
        <View style={styles.titleView}>
          <Text style={styles.title}>叠加方式</Text>
        </View>
        <View style={styles.content2}>
          <RadioGroup
            data={methods}
            column={3}
            getSelected={this.getOverlayMethod}
            defaultValue={this.state.overlayMethod}
            separatorHeight={scaleSize(20)}
          />
        </View>
      </View>
    )
  }

  renderBtns = () => {
    return (
      <View style={styles.btns}>
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

  render() {
    return (
      <View style={styles.container}>
        {this.renderLayerSelect()}
        {this.renderOverlayMethod()}
        {this.renderBtns()}
        {this.renderChooseLayer()}
      </View>
    )
  }
}
