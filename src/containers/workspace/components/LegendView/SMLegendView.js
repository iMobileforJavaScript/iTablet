import * as React from 'react'
import { View, Text, Platform } from 'react-native'
import LegendView from './'
import { scaleSize, setSpText } from '../../../../utils'
export const HEADER_HEIGHT = scaleSize(88) + (Platform.OS === 'ios' ? 20 : 0)

export default class SMLegendView extends React.Component {
  props: {
    device: Object,
  }

  constructor(props) {
    super(props)
    this.state = {
      column: props.device.orientation === 'LANDSCAPE' ? 8 : 4,
      backgroundColor: '#FFFFFF',
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
      <View
        style={{
          position: 'absolute',
          width: scaleSize(300),
          height: scaleSize(325),
          borderColor: 'black',
          borderWidth: scaleSize(3),
          left: 0,
          top: HEADER_HEIGHT,
          backgroundColor: this.state.backgroundColor,
          zIndex: 1,
        }}
      >
        <View
          style={{
            width: scaleSize(300),
            height: scaleSize(50),
            backgroundColor: 'transparent',
          }}
        >
          <Text
            style={{
              fontSize: setSpText(24),
              textAlign: 'center',
              backgroundColor: 'transparent',
              fontWeight: 'bold',
            }}
          >
            图例
          </Text>
        </View>
        <View
          style={{
            flex: 1,
            backgroundColor: 'transparent',
          }}
        >
          <LegendView
            device={this.props.device}
            ref={ref => (GLOBAL.legend = ref)}
          />
        </View>
      </View>
    )
  }
}
