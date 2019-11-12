import * as React from 'react'
import { View, Text } from 'react-native'
import { scaleSize, setSpText } from '../../../../utils'
import { color } from '../../../../styles'
// import { FileTools } from '../../../../native'
// import { ConstPath } from '../../../../constants'

export default class AIMapSuspensionDialog extends React.Component {
  props: {}

  constructor(props) {
    super(props)
    this.state = {
      show: false,
    }
  }

  setVisible = iShow => {
    this.setState({ show: iShow })
  }

  render() {
    if (this.state.show) {
      return (
        <View
          style={{
            position: 'absolute',
            top: scaleSize(450),
            alignSelf: 'center',
            alignItems: 'center',
            justifyContent: 'center',
            width: scaleSize(300),
            height: scaleSize(100),
            backgroundColor: color.headerBackground,
            opacity: 0.5,
            borderRadius: 15,
          }}
        >
          <Text
            style={{
              fontSize: setSpText(25),
              color: color.white,
              justifyContent: 'center',
              alignItems: 'center',
              alignSelf: 'center',
              textAlign: 'center',
            }}
          >
            点击屏幕放置地图
          </Text>
        </View>
      )
    } else {
      return true
    }
  }
}
