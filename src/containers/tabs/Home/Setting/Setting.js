import React, { Component } from 'react'
import {
  View,
  TouchableOpacity,
  Image,
  Text,
  ScrollView,
  RefreshControl,
  Platform,
} from 'react-native'
import { scaleSize } from '../../../../utils'
import Container from '../../../../components/Container'
import { color } from '../../../../styles'
import RenderSettingItem from './RenderSettingItem'
import { getLanguage } from '../../../../language/index'
import NavigationService from '../../../NavigationService'
import Toast from 'react-native-root-toast'
import FetchUtils from '../../../../../src/utils/FetchUtils'
import { FileTools } from '../../../../native'
import RNFS from 'react-native-fs'

export default class Setting extends Component {
  props: {
    navigation: Object,
    appConfig: Object,
  }

  constructor(props) {
    super(props)
    const { params } = this.props.navigation.state
    this.user = params && params.user
    this.state = {
      bOpenLicense: false,
      isRefresh: false,
    }
  }

  componentDidMount() {
    this._checkOpenLicense()
  }

  _checkOpenLicense = async () => {
    try {
      if (Platform.OS === 'android') {
        this.setState({
          bOpenLicense: true,
          isRefresh: false,
        })
        return
      }
      let fileCachePath = await FileTools.appendingHomeDirectory(
        '/iTablet/license/Open_License.ol',
      )
      let bRes = await RNFS.exists(fileCachePath)
      if (bRes) {
        await RNFS.unlink(fileCachePath)
      }
      let dataUrl = await FetchUtils.getFindUserDataUrl(
        'xiezhiyan123',
        'Open_License',
        '.geojson',
      )
      let downloadOptions = {
        fromUrl: dataUrl,
        toFile: fileCachePath,
        background: true,
        fileName: 'Open_License.ol',
        progressDivider: 1,
      }
      const ret = RNFS.downloadFile(downloadOptions)
      ret.promise.then(async () => {
        let bRes = await RNFS.readFile(fileCachePath)
        if (parseInt(bRes) === 1) {
          //检查许可接口入口是否开放
          this.setState({
            bOpenLicense: true,
            isRefresh: false,
          })
        }
      })
    } catch (e) {
      this.setState({
        bOpenLicense: false,
        isRefresh: false,
      })
      Toast.show(
        global.language === 'CN'
          ? '请检查网络连接'
          : 'Please check the network connection',
      )
    }
  }
  _renderItem = label => {
    return <RenderSettingItem label={label} />
  }

  //定位设置
  onLocation = () => {
    NavigationService.navigate('LocationSetting')
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
  //检查更新
  onCheckUpdate = () => {
    Toast.show(global.APP_VERSION)
  }
  //意见反馈
  suggestionFeedback = () => {
    NavigationService.navigate('SuggestionFeedback')
  }
  renderItems() {
    return (
      <View style={{ flex: 1, backgroundColor: color.content_white }}>
        {this._renderItem(getLanguage(global.language).Profile.STATUSBAR_HIDE)}
        {this.state.bOpenLicense === true
          ? this.renderItemView(
            this.onLicense,
            getLanguage(global.language).Profile.SETTING_LICENSE,
          )
          : null}
        {this.renderItemView(
          this.onLocation,
          getLanguage(global.language).Profile.SETTING_LOCATION_DEVICE,
        )}
        {this.props.appConfig.about &&
          this.props.appConfig.about.isShow &&
          this.renderItemView(
            this.onAbout,
            getLanguage(global.language).Profile.SETTING_ABOUT +
              this.props.appConfig.alias +
              getLanguage(global.language).Profile.SETTING_ABOUT_AFTER,
          )}
        {this.renderItemCheckVersion(
          this.onCheckUpdate,
          getLanguage(global.language).Profile.SETTING_CHECK_VERSION,
        )}
        {this.renderItemView(
          this.suggestionFeedback,
          getLanguage(global.language).Profile.SETTING_SUGGESTION_FEEDBACK,
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

  renderItemCheckVersion(action, label) {
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

            <View style={{ marginRight: 20, alignItems: 'center' }}>
              <Text style={{ fontSize: scaleSize(24), marginLeft: 15 }}>
                {global.APP_VERSION}
              </Text>
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
        <ScrollView
          refreshControl={
            <RefreshControl
              refreshing={this.state.isRefresh}
              onRefresh={this._checkOpenLicense}
              colors={['orange', 'red']}
              tintColor={'orange'}
              titleColor={'orange'}
              enabled={true}
            />
          }
        >
          {this.renderItems()}
        </ScrollView>
      </Container>
    )
  }
}
