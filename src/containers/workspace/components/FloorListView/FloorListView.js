import * as React from 'react'
import { StyleSheet, View, Platform } from 'react-native'
import { SMFloorListView } from 'imobile_for_reactnative'

import { scaleSize } from '../../../../utils'

const FLOORLIST_WIDTH = Platform.OS === 'ios' ? scaleSize(60) : 65
const FLOORLIST_HEIGHT = Platform.OS === 'ios' ? scaleSize(320) : 200
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
    height: FLOORLIST_HEIGHT,
    width: FLOORLIST_WIDTH,
    left: scaleSize(10),
    top: scaleSize(300),
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'transparent',
    borderRadius: scaleSize(4),
  },
})
