import React from 'react'
import { View, Text, Image, TouchableOpacity, StyleSheet } from 'react-native'
import { SLocation } from 'imobile_for_reactnative'
import Container from '../../components/Container'
import { scaleSize } from '../../utils'
import NavigationService from '../NavigationService'
import { getLanguage } from '../../language'

const radio_on = require('../../assets/public/radio_select.png')
const radio_off = require('../../assets/public/radio_select_no.png')

class LocationSetting extends React.Component {
  props: {
    navigation: Object,
    peripheralDevice: String,
    setDevice: () => {},
  }

  constructor(props) {
    super(props)
    this.prevOption = this.props.peripheralDevice
    this.state = {
      devices: ['local'],
      currentOption: this.prevOption,
    }
  }

  componentDidMount() {
    this.addListener()
    SLocation.searchDevice(true)
  }

  componentWillUnmount() {
    SLocation.searchDevice(false)
    SLocation.removeDeviceListener()
  }

  addListener() {
    SLocation.addDeviceListener(device => {
      let devices = this.state.devices.clone()
      if (devices.indexOf(device) === -1) {
        devices.push(device)
        this.setState({ devices })
      }
    })
  }

  changeDevice = async () => {
    let currentOption = this.state.currentOption
    this.props.setDevice(currentOption)
    SLocation.changeDevice(currentOption)
    NavigationService.goBack()
  }

  renderItem = key => {
    let title
    switch (key) {
      case 'local':
        title = getLanguage(global.language).Profile.SETTING_LOCATION_LOCAL
        break
      default:
        title = key
        //外部设备添加前缀
        key = 'external_' + key
        break
    }
    return (
      <View key={key}>
        <TouchableOpacity
          style={styles.itemView}
          activeOpacity={0.9}
          onPress={() => {
            this.setState({ currentOption: key })
          }}
        >
          <Text style={styles.text}>{title}</Text>
          <Image
            style={styles.image}
            source={this.state.currentOption === key ? radio_on : radio_off}
          />
        </TouchableOpacity>
        {this.renderSeperator()}
      </View>
    )
  }

  renderItems = () => {
    return this.state.devices.map(device => {
      return this.renderItem(device)
    })
  }

  renderList = () => {
    return <View style={{ flexDirection: 'column' }}>{this.renderItems()}</View>
  }

  renderSeperator = () => {
    return <View style={styles.seperator} />
  }

  renderRight = () => {
    let textColor
    if (this.state.currentOption === this.prevOption) {
      textColor = '#A0A0A0'
    } else {
      textColor = '#FFFFFF'
    }
    return (
      <View>
        <TouchableOpacity
          disabled={this.state.currentOption === this.prevOption}
          onPress={this.changeDevice}
        >
          <Text style={[styles.headerRightText, { color: textColor }]}>
            {getLanguage(global.language).Profile.SAVE}
          </Text>
        </TouchableOpacity>
      </View>
    )
  }

  render() {
    return (
      <Container
        ref={ref => (this.container = ref)}
        headerProps={{
          title: getLanguage(global.language).Profile.SETTING_LOCATION_DEVICE,
          withoutBack: false,
          navigation: this.props.navigation,
          headerRight: this.renderRight(),
        }}
      >
        {this.renderList()}
      </Container>
    )
  }
}

const styles = StyleSheet.create({
  itemView: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: scaleSize(20),
    marginVertical: scaleSize(10),
  },
  text: {
    fontSize: scaleSize(26),
  },
  image: {
    height: scaleSize(60),
    width: scaleSize(60),
  },
  seperator: {
    height: 1,
    backgroundColor: '#E0E0E0',
  },
  headerRightText: {
    fontSize: scaleSize(26),
  },
})
export default LocationSetting
