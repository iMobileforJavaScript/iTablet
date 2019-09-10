import * as React from 'react'
import { View, TouchableOpacity, Text } from 'react-native'
import { scaleSize, setSpText } from '../../../../utils'
import color from '../../../../styles/color'
import { SMap } from 'imobile_for_reactnative'
import NavigationService from '../../../../containers/NavigationService'
import { Toast } from '../../../../utils'

export default class MapSelectPointButton extends React.Component {
  props: {
    headerProps: Object,
  }

  constructor(props) {
    super(props)
    this.state = {
      show: false,
      button: '',
    }
  }

  setVisible = (iShow, params = {}) => {
    this.setState({ show: iShow, button: params.button })
  }

  setButton = () => {
    if (this.state.button === '设为起点') {
      if (GLOBAL.STARTX !== undefined) {
        SMap.getPointName(GLOBAL.STARTX, GLOBAL.STARTY, true)
        NavigationService.navigate('NavigationView')
      } else {
        Toast.show('请长按添加起点')
      }
    } else {
      if (GLOBAL.ENDX !== undefined) {
        SMap.getPointName(GLOBAL.ENDX, GLOBAL.ENDY, false)
        NavigationService.navigate('NavigationView')
      } else {
        Toast.show('请长按添加终点')
      }
    }
  }

  render() {
    if (this.state.show) {
      return (
        <View
          style={{
            position: 'absolute',
            bottom: scaleSize(30),
            width: '100%',
            justifyContent: 'center',
            alignItems: 'center',
          }}
        >
          <TouchableOpacity
            activeOpacity={0.5}
            style={{
              width: '80%',
              height: scaleSize(60),
              borderRadius: 50,
              backgroundColor: color.blue1,
              justifyContent: 'center',
              alignItems: 'center',
            }}
            onPress={() => {
              this.setButton()
            }}
          >
            <Text
              style={{
                fontSize: setSpText(20),
                color: color.white,
              }}
            >
              {this.state.button}
            </Text>
          </TouchableOpacity>
        </View>
      )
    } else {
      return <View />
    }
  }
}
