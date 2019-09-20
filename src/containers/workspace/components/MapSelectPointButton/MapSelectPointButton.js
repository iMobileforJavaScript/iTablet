import * as React from 'react'
import { View, TouchableOpacity, Text } from 'react-native'
import { scaleSize, setSpText, Toast } from '../../../../utils'
import color from '../../../../styles/color'
import { SMap } from 'imobile_for_reactnative'
import NavigationService from '../../../../containers/NavigationService'

export default class MapSelectPointButton extends React.Component {
  props: {
    headerProps: Object,
  }

  constructor(props) {
    super(props)
    this.state = {
      show: false,
      button: '',
      firstpage: true,
    }
  }

  setVisible = (iShow, params = {}, firstpage = true) => {
    this.setState({ show: iShow, button: params.button, firstpage: firstpage })
  }

  setButton = async () => {
    if (this.state.button === '设为起点') {
      if (GLOBAL.STARTX !== undefined) {
        await SMap.getPointName(GLOBAL.STARTX, GLOBAL.STARTY, true)
        if (this.state.firstpage) {
          NavigationService.navigate('NavigationView')
        } else {
          GLOBAL.NAVIGATIONSTARTBUTTON.setVisible(true)
          GLOBAL.NAVIGATIONSTARTHEAD.setVisible(true)
          this.setVisible(false)
          GLOBAL.MAPSELECTPOINT.setVisible(false)
          if (GLOBAL.ENDX !== undefined) {
            await SMap.getEndPoint(GLOBAL.ENDX, GLOBAL.ENDY, GLOBAL.INDOOREND)
            let result = await SMap.beginIndoorNavigation(
              GLOBAL.STARTX,
              GLOBAL.STARTY,
              GLOBAL.ENDX,
              GLOBAL.ENDY,
            )
            if (!result) {
              Toast.show('路径分析失败请重新选择起终点')
            }
          }
        }
      } else {
        Toast.show('请长按添加起点')
      }
    } else {
      if (GLOBAL.ENDX !== undefined) {
        await SMap.getPointName(GLOBAL.ENDX, GLOBAL.ENDY, false)
        if (this.state.firstpage) {
          NavigationService.navigate('NavigationView')
        } else {
          GLOBAL.NAVIGATIONSTARTBUTTON.setVisible(true)
          GLOBAL.NAVIGATIONSTARTHEAD.setVisible(true)
          this.setVisible(false)
          GLOBAL.MAPSELECTPOINT.setVisible(false)
          if (GLOBAL.STARTX !== undefined) {
            await SMap.getStartPoint(
              GLOBAL.STARTX,
              GLOBAL.STARTY,
              GLOBAL.INDOORSTART,
            )
            let result = await SMap.beginIndoorNavigation(
              GLOBAL.STARTX,
              GLOBAL.STARTY,
              GLOBAL.ENDX,
              GLOBAL.ENDY,
            )
            if (!result) {
              Toast.show('路径分析失败请重新选择起终点')
            }
          }
        }
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
