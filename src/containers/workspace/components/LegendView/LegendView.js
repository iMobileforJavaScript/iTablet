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
      width: 50,
      height: 50,
      columns: 2,
      textsize: 8,
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
      <SMRLegendView
        style={styles.table}
        tableStyle={{
          width: this.state.width,
          height: this.state.height,
          column: this.state.columns,
          textsize: this.state.textsize,
        }}
      />
    )
  }
}

const styles = StyleSheet.create({
  table: {
    flex: 1,
    backgroundColor: 'transparent',
  },
})
