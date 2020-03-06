/*
  Copyright © SuperMap. All rights reserved.
  Author: lu cheng dong
  E-mail: 756355668@qq.com
*/
import React, { Component } from 'react'
import {
  Dimensions,
  View,
  Text,
  TouchableOpacity,
  Image,
  ScrollView,
  // TextInput,
} from 'react-native'
import { Container } from '../../../components'
import { FileTools } from '../../../native'
import NavigationService from '../../NavigationService'
import ConstPath from '../../../constants/ConstPath'
import { SOnlineService } from 'imobile_for_reactnative'
import { UserType } from '../../../constants'
import { scaleSize } from '../../../utils'
import { getLanguage } from '../../../language/index'
import { getPublicAssets, getThemeAssets } from '../../../assets'
import styles from './styles'
const Customer = 'Customer'
import logos from '../../../assets/custom/logo'

export default class Mine extends Component {
  props: {
    language: string,
    navigation: Object,
    user: Object,
    workspace: Object,
    device: Object,
    mineModules: Array,
    setUser: () => {},
    closeWorkspace: () => {},
    openWorkspace: () => {},
  }

  constructor(props) {
    super(props)
    this.state = {
      display: 'flex',
    }
    this.searchText = ''
  }

  componentDidMount() {
    if (
      this.props.user &&
      this.props.user.currentUser &&
      !this.props.user.currentUser.password
    ) {
      this.props.setUser({
        userName: 'Customer',
        userType: UserType.PROBATION_USER,
        // userId: 0,
      })
    }
  }

  componentDidUpdate(previousProps) {
    if (
      this.props.user.currentUser.userType !== UserType.PROBATION_USER &&
      this.props.user.currentUser.userName !== undefined &&
      this.props.user.currentUser.userName !== '' &&
      this.props.user.currentUser.userName !==
        previousProps.user.currentUser.userName
    ) {
      this.openUserWorkspace()
      SOnlineService.syncAndroidCookie()
    }
  }

  openUserWorkspace = async () => {
    let userPath = await FileTools.appendingHomeDirectory(
      ConstPath.UserPath +
        this.props.user.currentUser.userName +
        '/' +
        ConstPath.RelativeFilePath.Workspace[
          global.language === 'CN' ? 'CN' : 'EN'
        ],
    )
    // 防止多次打开同一个工作空间
    if (!this.props.workspace || this.props.workspace.server === userPath)
      return
    this.props.closeWorkspace(() => {
      this.props.openWorkspace({ server: userPath })
    })
  }

  goToLogin = () => {
    NavigationService.navigate('SelectLogin')
  }

  goToPersonal = () => {
    NavigationService.navigate('Personal')
  }

  goToMyLocalData = () => {
    let userName =
      this.props.user.currentUser.userType === UserType.PROBATION_USER
        ? 'Customer'
        : this.props.user.currentUser.userName
    NavigationService.navigate('MyLocalData', {
      userName: userName,
    })
  }

  goToMyMap = title => {
    NavigationService.navigate('MyMap', {
      title,
    })
  }

  goToMyDatasource = title => {
    NavigationService.navigate('MyDatasource', {
      title,
    })
  }

  goToMyScene = title => {
    NavigationService.navigate('MyScene', {
      title,
    })
  }

  goToMyTemplate = title => {
    NavigationService.navigate('MyTemplate', {
      title,
    })
  }

  goToMySymbol = title => {
    NavigationService.navigate('MySymbol', {
      title,
    })
  }

  goToMyBaseMap = () => {
    NavigationService.navigate('MyBaseMap', {})
  }

  goToMyLabel = title => {
    NavigationService.navigate('MyLabel', {
      title,
    })
  }

  goToMyService = () => {
    NavigationService.navigate('MyService')
  }

  _onPressAvatar = () => {
    this.goToPersonal()
  }

  _onPressMore = () => {
    this.goToLogin()
  }

  _onPressSwitch = () => {
    NavigationService.navigate('ToggleAccount')
  }

  _getItems = () => {
    let data = []
    for (let i = 0; i < this.props.mineModules.length; i++) {
      switch (this.props.mineModules[i].key) {
        case 'IMPORT':
          data.push({
            title: getLanguage(this.props.language).Profile.IMPORT,
            leftImagePath: getThemeAssets().mine.my_import,
            onClick: this.goToMyLocalData,
          })
          break
        case 'MY_SERVICE':
          data.push({
            title: getLanguage(this.props.language).Profile.MY_SERVICE,
            leftImagePath: getThemeAssets().mine.my_service,
            onClick: this.goToMyService,
          })
          break
        case 'DATA':
          data.push({
            title: getLanguage(this.props.language).Profile.DATA,
            leftImagePath: getThemeAssets().mine.my_data,
            onClick: () =>
              this.goToMyDatasource(
                getLanguage(this.props.language).Profile.DATA,
              ),
          })
          break
        case 'MARK':
          data.push({
            title: getLanguage(this.props.language).Profile.MARK,
            leftImagePath: getThemeAssets().mine.my_plot,
            onClick: () => {
              this.goToMyLabel(getLanguage(this.props.language).Profile.MARK)
            },
          })
          break
        case 'MAP':
          data.push({
            title: getLanguage(this.props.language).Profile.MAP,
            leftImagePath: getThemeAssets().mine.my_map,
            onClick: () =>
              this.goToMyMap(getLanguage(this.props.language).Profile.MAP),
          })
          break
        case 'SCENE':
          data.push({
            title: getLanguage(this.props.language).Profile.SCENE,
            leftImagePath: getThemeAssets().mine.my_scene,
            onClick: () =>
              this.goToMyScene(getLanguage(this.props.language).Profile.SCENE),
          })
          break
        case 'BASE_MAP':
          data.push({
            title: getLanguage(this.props.language).Profile.BASEMAP,
            leftImagePath: getThemeAssets().mine.my_basemap,
            onClick: this.goToMyBaseMap,
          })
          break
        case 'SYMBOL':
          data.push({
            title: getLanguage(this.props.language).Profile.SYMBOL,
            leftImagePath: getThemeAssets().mine.my_symbol,
            onClick: () =>
              this.goToMySymbol(
                getLanguage(this.props.language).Profile.SYMBOL,
              ),
          })
          break
        case 'TEMPLATE':
          data.push({
            title: getLanguage(this.props.language).Profile.TEMPLATE,
            leftImagePath: require('../../../assets/function/icon_function_style.png'),
            onClick: () =>
              this.goToMyTemplate(
                getLanguage(this.props.language).Profile.TEMPLATE,
              ),
          })
          break
        case 'MyColor':
          data.push({
            title: getLanguage(this.props.language).Profile.COLOR_SCHEME,
            leftImagePath: getThemeAssets().mine.my_color,
            onClick: () =>
              NavigationService.navigate('MyColor', {
                title: getLanguage(this.props.language).Profile.COLOR_SCHEME,
              }),
          })
          break
      }
    }
    return data
  }

  _renderProfile = () => {
    return (
      <View style={styles.profileContainer}>
        {this._renderLogo()}
        {this._renderMyProfile()}
        {this._renderSearch()}
        {this._renderSideItem()}
      </View>
    )
  }

  /**
   * 定制logo
   * 如果assets/custom/logo中存在logo1，logo2，logo3，则会一次显示在'我的'顶部图片
   * logo2会代替原本的用户头像
   */
  _renderLogo = () => {
    let isPro = !UserType.isProbationUser(this.props.user.currentUser)
    let logo
    if (logos.logo2) {
      logo = logos.logo2
    } else {
      logo = isPro
        ? {
          uri:
              'https://cdn3.supermapol.com/web/cloud/84d9fac0/static/images/myaccount/icon_plane.png',
        }
        : require('../../../assets/home/system_default_header_image.png')
    }
    return (
      <View style={styles.logoView}>
        {logos.logo1 && (
          <Image
            style={[
              styles.logoImagStyle,
              { width: scaleSize(190), height: scaleSize(70) },
            ]}
            source={logos.logo1}
          />
        )}
        <Image
          resizeMode={'contain'}
          style={styles.logoImagStyle}
          source={logo}
        />
        {logos.logo3 && (
          <Image
            style={[styles.logoImagStyle, { width: scaleSize(190) }]}
            source={logos.logo3}
          />
        )}
      </View>
    )
  }

  _renderMyProfile = () => {
    let isPro = !UserType.isProbationUser(this.props.user.currentUser)
    let headerTitle = isPro
      ? this.props.user.currentUser.userName
        ? this.props.user.currentUser.userName
        : Customer
      : getLanguage(this.props.language).Profile.LOGIN_NOW
    let statusText
    if (UserType.isOnlineUser(this.props.user.currentUser)) {
      statusText = 'Online'
    } else if (UserType.isIPortalUser(this.props.user.currentUser)) {
      statusText = 'iPortal'
    } else {
      statusText = null
    }
    return (
      <View style={styles.MyProfileStyle}>
        <View style={styles.profileHeadStyle}>
          {/*<TouchableOpacity*/}
          {/*disabled={!isPro}*/}
          {/*activeOpacity={0.7}*/}
          {/*onPress={this._onPressAvatar}*/}
          {/*style={styles.profileAvatarStyle}*/}
          {/*>*/}
          {/*<Image style={styles.headImgStyle} source={headerImage} />*/}
          {/*</TouchableOpacity>*/}
          <TouchableOpacity
            activeOpacity={0.7}
            onPress={this._onPressMore}
            style={styles.moreViewStyle}
          >
            <View style={styles.moreX}>
              <View style={styles.moreY} />
            </View>
          </TouchableOpacity>
        </View>
        <View
          style={[
            styles.profileTextStyle,
            this.props.device.orientation === 'LANDSCAPE'
              ? styles.profileTextLandscapeStyle
              : null,
          ]}
        >
          <Text numberOfLines={1} style={styles.userNameStyle}>
            {headerTitle}
          </Text>
          <Text style={styles.statusTextStyle}>{statusText}</Text>
        </View>
      </View>
    )
  }

  _renderSearch = () => {
    if (this.props.device.orientation === 'LANDSCAPE') {
      return null
    }
    return (
      <TouchableOpacity
        onPress={() => {
          NavigationService.navigate('SearchMine')
        }}
        activeOpacity={1}
        style={styles.searchViewStyle}
      >
        <Image
          style={styles.searchImgStyle}
          source={getPublicAssets().common.icon_search_a0}
        />
        {/* <TextInput
          ref={ref => (this.searchBar = ref)}
          style={styles.searchInputStyle}
          placeholder={getLanguage(this.props.language).Profile.SEARCH}
          placeholderTextColor={'#A7A7A7'}
          returnKeyType={'search'}
          onSubmitEditing={this._onSearch}
          onChangeText={value => {
            this.searchText = value
          }}
        /> */}
        <Text style={styles.searchInputStyle}>
          {getLanguage(this.props.language).Profile.SEARCH}
        </Text>
      </TouchableOpacity>
    )
  }

  _renderSideItem = () => {
    if (UserType.isProbationUser(this.props.user.currentUser)) {
      return null
    }
    return (
      <TouchableOpacity
        activeOpacity={0.7}
        onPress={this._onPressSwitch}
        style={[styles.sideItemStyle, logos.logo1 && { top: scaleSize(150) }]} // 判断是否包含定制logo
      >
        <Text style={styles.SideTextStyle}>
          {getLanguage(this.props.language).Profile.SWITCH_ACCOUNT}
        </Text>
      </TouchableOpacity>
    )
  }

  _renderDatas = () => {
    return (
      <View style={styles.datasContainer}>
        <ScrollView showsVerticalScrollIndicator={false}>
          <View style={styles.scrollContentStyle}>{this._renderItems()}</View>
        </ScrollView>
      </View>
    )
  }

  _renderItems = () => {
    let colNum = this.props.device.orientation === 'LANDSCAPE' ? 5 : 4
    let items = this._getItems()
    let renderItems = []
    let key = 0
    for (let i = 0; i < items.length; i++) {
      let show = this._itemFilter(items[i])
      if (show) {
        renderItems.push(this.renderItem(items[i], colNum, key++))
      }
    }
    return renderItems
  }

  renderItem = (item, colNum, key) => {
    return (
      <TouchableOpacity
        key={key}
        onPress={item.onClick}
        style={[
          styles.itemView,
          { width: (this.screenWidth - scaleSize(50)) / colNum },
          this.props.device.orientation === 'LANDSCAPE'
            ? styles.itemLandscapeView
            : null,
        ]}
      >
        <Image style={styles.itemImg} source={item.leftImagePath} />
        <Text style={styles.itemText}>{item.title}</Text>
      </TouchableOpacity>
    )
  }

  _itemFilter = item => {
    if (UserType.isProbationUser(this.props.user.currentUser)) {
      if (item.title === getLanguage(this.props.language).Profile.MY_SERVICE) {
        return false
      }
    } else if (UserType.isOnlineUser(this.props.user.currentUser)) {
      //
    } else if (UserType.isIPortalUser(this.props.user.currentUser)) {
      //
    } else {
      return false
    }

    return true
  }

  render() {
    this.screenWidth = Dimensions.get('window').width
    this.screenHeight = Dimensions.get('window').height
    return (
      <Container ref={ref => (this.container = ref)} withoutHeader>
        {this._renderProfile()}
        {this._renderDatas()}
      </Container>
    )
  }
}
