import * as React from 'react'
import { StyleSheet } from 'react-native'
import { SMFloorListView } from 'imobile_for_reactnative'
import { View } from 'react-native'
import { scaleSize } from '../../../../utils'

export default class FloorListView extends React.Component {
  props: {
    device: Object,
  }

  constructor(props) {
    super(props)
    this.state = {
      column: props.device.orientation === 'LANDSCAPE' ? 8 : 4,
    }
  }

  componentDidUpdate(prevProps) {
    if (this.props.device.orientation !== prevProps.device.orientation) {
      this.setState({
        column: this.props.device.orientation === 'LANDSCAPE' ? 8 : 4,
      })
    }
  }

  render() {
    return (
      <View style={styles.table}>
        <SMFloorListView />
      </View>
    )
  }
}

const styles = StyleSheet.create({
  table: {
    position: 'absolute',
    height: scaleSize(400),
    width: scaleSize(100),
    left: 10,
    top: scaleSize(300),
    backgroundColor: 'transparent',
  },
})
