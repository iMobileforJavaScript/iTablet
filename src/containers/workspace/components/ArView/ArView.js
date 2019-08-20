import * as React from 'react'
import { StyleSheet } from 'react-native'
import { SMArView } from 'imobile_for_reactnative'

export default class ArView extends React.Component {
  props: {
    device: Object,
  }

  constructor(props) {
    super(props)
    this.state = {
      column: props.device.orientation === 'LANDSCAPE' ? 8 : 4,
      name: '公交站',
      x: 104.06827,
      y: 30.537225,
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
      <SMArView
        style={styles.table}
        ARView={{
          name: this.state.name,
          x: this.state.x,
          y: this.state.y,
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
