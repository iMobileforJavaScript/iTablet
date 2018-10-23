import * as React from 'react'
import { Text, View } from 'react-native'
import { Row } from '../../../../components'
import { scaleSize } from '../../../../utils'
import { BufferEndType } from 'imobile_for_reactnative'
import styles from './styles'

export default class TrackingSetting extends React.Component {
  props: {
    data: Object,
    type: String,
    mapControl: Object,
    workspace: Object,
    selection: Object,
    map: Object,
    getData: () => {},
  }

  static defaultProps = {
    data: {
      endType: BufferEndType.ROUND,
      distance: 2,
    },
  }

  constructor(props) {
    super(props)
    this.state = {
      distance: props.data.distance,
      endType: props.data.endType,
    }
  }

  getData = () => {
    return {
      distance: this.state.distance,
      endType: this.state.endType,
    }
  }

  getEndType = value => {
    this.setState({
      endType: value,
    })
  }

  getDistance = value => {
    this.setState({
      distance: value,
    })
  }

  render() {
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
            type={Row.Type.TEXT_BTN}
            title={'缓冲数据'}
            getValue={this.getInputValue}
          />
          <Row
            style={styles.row}
            key={'缓冲类型'}
            title={'缓冲类型'}
            type={Row.Type.RADIO_GROUP}
            defaultValue={this.props.data.endType}
            radioArr={[
              { title: '圆头缓冲', value: BufferEndType.ROUND },
              { title: '平头缓冲', value: BufferEndType.FLAT },
            ]}
            radioColumn={1}
            getValue={this.getEndType}
          />
          <Row
            style={styles.row}
            key={'缓冲半径'}
            title={'缓冲半径'}
            type={Row.Type.CHOOSE_NUMBER}
            minValue={1}
            maxValue={50}
            unit={'m'}
            defaultValue={this.props.data.distance}
            getValue={this.getDistance}
          />
        </View>
      </View>
    )
  }
}
