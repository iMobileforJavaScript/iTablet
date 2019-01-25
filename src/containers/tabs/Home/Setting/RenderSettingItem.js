import React, { Component } from 'react'
import { Switch, Text, View, StatusBar, AsyncStorage } from 'react-native'
import color from '../../../../styles/color'

export default class RenderSettingItem extends Component {
  props: {
    label: String,
  }
  constructor(props) {
    super(props)
    this.state = {
      isOpenSwitch: false,
    }
  }

  componentDidMount() {
    this.initSwitchValue()
  }

  async initSwitchValue() {
    let result = await AsyncStorage.getItem('StatusBarVisible')
    let visible = result === 'true'
    this.setState({ isOpenSwitch: visible })
  }

  render() {
    let isOpenSwitch = this.state.isOpenSwitch
    let falseColor = color.white
    let trueColor = color.theme
    let thumbColor = isOpenSwitch ? color.white : color.theme
    let ios_backgroundColor = color.white
    return (
      <View style={{ width: '100%' }}>
        <View
          style={{
            width: '100%',
            height: 60,
            flexDirection: 'row',
            justifyContent: 'space-between',
            alignItems: 'center',
          }}
        >
          <Text style={{ fontSize: 18, marginLeft: 15 }}>
            {this.props.label}
          </Text>
          <Switch
            style={{ marginRight: 15 }}
            value={isOpenSwitch}
            thumbColor={thumbColor}
            ios_backgroundColor={ios_backgroundColor}
            trackColor={{ false: falseColor, true: trueColor }}
            onValueChange={async value => {
              let visibleValue = '' + value
              await AsyncStorage.setItem('StatusBarVisible', visibleValue)
              this.setState({ isOpenSwitch: value })
              StatusBar.setHidden(value, 'slide')
            }}
          />
        </View>
        <View
          style={{
            width: '100%',
            height: 1,
            backgroundColor: color.item_separate_white,
          }}
        />
      </View>
    )
  }
}
