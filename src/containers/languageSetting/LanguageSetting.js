import React from 'react'
import { View, Text, Image, TouchableOpacity, StyleSheet } from 'react-native'
import Container from '../../components/Container'
import { scaleSize } from '../../utils'
import NavigationService from '../NavigationService'
import { getLanguage } from '../../language'

const radio_on = require('../../assets/public/radio_select.png')
const radio_off = require('../../assets/public/radio_select_no.png')
const option = {
  auto: 'AUTO',
  CN: 'CN',
  EN: 'EN',
  TR: 'TR',
  JA: 'JA',
}

class LanguageSetting extends React.Component {
  props: {
    navigation: Object,
    language: String,
    autoLanguage: Boolean,
    setLanguage: () => {},
  }

  constructor(props) {
    super(props)
    this.prevOption = this.props.autoLanguage
      ? option.auto
      : this.props.language
    this.state = {
      currentOption: this.prevOption,
    }
  }

  changeLanguage = async () => {
    let currentOption = this.state.currentOption
    if (currentOption !== this.prevOption) {
      this.props.setLanguage(currentOption)
    }
    NavigationService.goBack()
  }

  renderItem = key => {
    let title = key
    switch (key) {
      case option.auto:
        title = getLanguage(this.props.language).Profile.SETTING_LANGUAGE_AUTO
        break
      case option.CN:
        title = '中文'
        break
      case option.EN:
        title = 'English'
        break
      case option.TR:
        title = 'Türkçe'
        break
      case option.JA:
        title = '日本語'
        break
    }
    return (
      <View>
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

  renderList = () => {
    return (
      <View style={{ flexDirection: 'column' }}>
        {this.renderItem(option.auto)}
        {this.renderItem(option.CN)}
        {this.renderItem(option.EN)}
        {this.renderItem(option.TR)}
        {this.renderItem(option.JA)}
      </View>
    )
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
          onPress={this.changeLanguage}
        >
          <Text style={[styles.headerRightText, { color: textColor }]}>
            {getLanguage(this.props.language).Profile.SAVE}
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
          title: getLanguage(this.props.language).Profile.SETTING_LANGUAGE,
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
export default LanguageSetting
