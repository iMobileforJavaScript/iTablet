import * as React from 'react'
import { StyleSheet } from 'react-native'
import { SMRLegendView } from 'imobile_for_reactnative'

export default class LegendView extends React.Component {
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
    return <SMRLegendView style={styles.table} />
  }
}

const styles = StyleSheet.create({
  table: {
    flex: 1,
    backgroundColor: 'white',
  },
})
