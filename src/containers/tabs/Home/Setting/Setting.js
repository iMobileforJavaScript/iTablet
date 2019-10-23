import React, { Component } from 'react'
import { View, TouchableOpacity, Image, Text } from 'react-native'
import { scaleSize } from '../../../../utils'
import Container from '../../../../components/Container'
import { color } from '../../../../styles'
import RenderSettingItem from './RenderSettingItem'
import { getLanguage } from '../../../../language/index'
import NavigationService from '../../../NavigationService'
export default class Setting extends Component {
  props: {
    navigation: Object,
  }

  constructor(props) {
    super(props)
    const { params } = this.props.navigation.state
    this.user = params && params.user
  }

  _renderItem = label => {
    return <RenderSettingItem label={label} />
  }

  //关于
  onAbout = () => {
    NavigationService.navigate('AboutITablet')
  }

  //许可
  onLicense = () => {
    NavigationService.navigate('LicensePage', {
      user: this.user,
    })
  }

  renderItems() {
    return (
      <View style={{ flex: 1, backgroundColor: color.content_white }}>
        {this._renderItem(getLanguage(global.language).Profile.STATUSBAR_HIDE)}
        {this.renderItemView(
          this.onLicense,
          getLanguage(global.language).Profile.SETTING_LICENSE,
        )}
        {this.renderItemView(
          this.onAbout,
          getLanguage(global.language).Profile.SETTING_ABOUT_ITABLET,
        )}
      </View>
    )
  }

  renderItemView(action, label) {
    return (
      <View style={{ width: '100%' }}>
        <TouchableOpacity style={{ width: '100%' }} onPress={action}>
          <View
            style={{
              width: '100%',
              height: scaleSize(80),
              flexDirection: 'row',
              justifyContent: 'space-between',
              alignItems: 'center',
            }}
          >
            <Text style={{ fontSize: scaleSize(24), marginLeft: 15 }}>
              {label}
            </Text>

            <View
              style={{ marginRight: 15, alignItems: 'center' }}
              // onPress={action}
            >
              <Image
                source={require('../../../../assets/Mine/mine_my_arrow.png')}
                style={{ height: scaleSize(28), width: scaleSize(28) }}
              />
            </View>
          </View>
        </TouchableOpacity>
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
  render() {
    return (
      <Container
        headerProps={{
          title: getLanguage(global.language).Profile.SETTINGS,
          //'设置',
          navigation: this.props.navigation,
        }}
      >
        {this.renderItems()}
      </Container>
    )
  }
}
