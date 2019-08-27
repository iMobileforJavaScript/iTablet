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
  Platform,
  // TextInput,
} from 'react-native'
import { Container } from '../../../components'
import { FileTools } from '../../../native'
import NavigationService from '../../NavigationService'
// import Login from './Login'
import { color, size } from '../../../styles'
import ConstPath from '../../../constants/ConstPath'
import { SOnlineService } from 'imobile_for_reactnative'
import Toast from '../../../utils/Toast'
import { UserType } from '../../../constants'
import { scaleSize } from '../../../utils'
import { getLanguage } from '../../../language/index'
import { getPublicAssets } from '../../../assets'
import styles from './styles'
const Customer = 'Customer'
export default class Mine extends Component {
  props: {
    language: string,
    navigation: Object,
    user: Object,
    workspace: Object,
    device: Object,
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
    this.goToMyService = this.goToMyService.bind(this)
    this.goToMyOnlineData = this.goToMyOnlineData.bind(this)
    this.goToMyLocalData = this.goToMyLocalData.bind(this)
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
        ConstPath.RelativeFilePath.Workspace,
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

  goToMyData = title => {
    NavigationService.navigate('MyData', {
      title,
    })
  }

  goToMyModule = title => {
    NavigationService.navigate('MyModule', { title })
  }

  goToMyBaseMap = () => {
    NavigationService.navigate('MyBaseMap', {})
  }

  goToMyLabel = title => {
    NavigationService.navigate('MyLabel', {
      title,
    })
  }

  goToMyOnlineData = async () => {
    NavigationService.navigate('MyOnlineData')
  }

  goToMyService = () => {
    NavigationService.navigate('MyService')
  }

  _selectionRender = () => {
    if (this.props.user.currentUser.userType === UserType.PROBATION_USER) {
      let fontSize = size.fontSize.fontSizeXl
      return (
        <View
          opacity={1}
          style={{ flex: 1, backgroundColor: color.contentColorWhite }}
        >
          {this._renderHeader(fontSize)}
          <ScrollView
            style={{ flex: 1 }}
            showsHorizontalScrollIndicator={false}
            showsVerticalScrollIndicator={false}
            overScrollMode={'always'}
            bounces={true}
          >
            {this._renderLine()}
            {this._renderItem({
              title: getLanguage(this.props.language).Profile.IMPORT,
              leftImagePath: require('../../../assets/Mine/mine_my_local_import_light.png'),
              onClick: this.goToMyLocalData,
            })}

            {this._renderItem({
              title: getLanguage(this.props.language).Profile.DATA,
              leftImagePath: require('../../../assets/Mine/mine_my_local_data.png'),
              onClick: () =>
                this.goToMyData(getLanguage(this.props.language).Profile.DATA),
            })}
            {this._renderItem({
              title: getLanguage(this.props.language).Profile.MARK,
              //Const.MYLABEL,
              leftImagePath: require('../../../assets/Mine/mine_my_plot.png'),
              onClick: () => {
                this.goToMyLabel(getLanguage(this.props.language).Profile.MARK)
              },
            })}
            {this._renderItem({
              title: getLanguage(this.props.language).Profile.MAP,
              leftImagePath: require('../../../assets/Mine/mine_my_local_map.png'),
              onClick: () =>
                this.goToMyData(getLanguage(this.props.language).Profile.MAP),
            })}
            {this._renderItem({
              title: getLanguage(this.props.language).Profile.SCENE,
              leftImagePath: require('../../../assets/Mine/mine_my_local_scene.png'),
              onClick: () =>
                this.goToMyData(getLanguage(this.props.language).Profile.SCENE),
            })}
            {this._renderItem({
              title: getLanguage(this.props.language).Profile.BASEMAP,
              //Const.BASEMAP,
              leftImagePath: require('../../../assets/Mine/my_basemap.png'),
              onClick: () => {
                this.goToMyBaseMap()
              },
            })}
            {this._renderItem({
              title: getLanguage(this.props.language).Profile.SYMBOL,
              leftImagePath: require('../../../assets/Mine/mine_my_local_symbol.png'),
              onClick: () =>
                this.goToMyData(
                  getLanguage(this.props.language).Profile.SYMBOL,
                ),
            })}
            {/* {this._renderItem({
              title: getLanguage(this.props.language).Profile.COLOR_SCHEME,
              leftImagePath: require('../../../assets/Mine/mine_my_color_light.png'),
              onClick: () =>  this.goToMyData(getLanguage(this.props.language).Profile.COLOR_SCHEME),
            })} */}
            {this._renderItem({
              title: getLanguage(this.props.language).Profile.TEMPLATE,
              leftImagePath: require('../../../assets/function/icon_function_style.png'),
              onClick: () =>
                this.goToMyModule(
                  getLanguage(this.props.language).Profile.TEMPLATE,
                ),
            })}
          </ScrollView>
        </View>
      )
    } else {
      return this._render()
    }
  }

  _render = () => {
    let fontSize = Platform.OS === 'ios' ? 18 : 16
    return (
      <View
        opacity={1}
        style={{ flex: 1, backgroundColor: color.content_white }}
      >
        {this._renderHeader(fontSize)}
        <ScrollView
          style={{ flex: 1 }}
          // contentContainerStyle={{ alignItems:'center' }}
          showsHorizontalScrollIndicator={false}
          showsVerticalScrollIndicator={false}
          overScrollMode={'always'}
          bounces={true}
        >
          {this._renderLine()}
          {this._renderItem({
            title: getLanguage(this.props.language).Profile.IMPORT,
            leftImagePath: require('../../../assets/Mine/mine_my_local_import_light.png'),
            onClick: this.goToMyLocalData,
          })}
          {this._renderItem({
            title: getLanguage(this.props.language).Profile.MY_SERVICE,
            leftImagePath: require('../../../assets/Mine/mine_my_service.png'),
            onClick: this.goToMyService,
          })}
          {this._renderItem({
            title: getLanguage(this.props.language).Profile.DATA,
            leftImagePath: require('../../../assets/Mine/mine_my_local_data.png'),
            onClick: () =>
              this.goToMyData(getLanguage(this.props.language).Profile.DATA),
            //Const.DATA),
          })}
          {this._renderItem({
            title: getLanguage(this.props.language).Profile.MARK,
            leftImagePath: require('../../../assets/Mine/mine_my_plot.png'),
            onClick: () => {
              this.goToMyLabel(getLanguage(this.props.language).Profile.MARK)
              //Const.MYLABEL)
            },
          })}
          {this._renderItem({
            title: getLanguage(this.props.language).Profile.MAP,
            leftImagePath: require('../../../assets/Mine/mine_my_local_map.png'),
            onClick: () =>
              this.goToMyData(getLanguage(this.props.language).Profile.MAP),
            //Const.MAP),
          })}
          {this._renderItem({
            title: getLanguage(this.props.language).Profile.SCENE,
            leftImagePath: require('../../../assets/Mine/mine_my_local_scene.png'),
            onClick: () =>
              this.goToMyData(getLanguage(this.props.language).Profile.SCENE),
            //Const.SCENE),
          })}
          {this._renderItem({
            title: getLanguage(this.props.language).Profile.BASEMAP,
            leftImagePath: require('../../../assets/Mine/my_basemap.png'),
            onClick: () => {
              this.goToMyBaseMap()
            },
          })}
          {this._renderItem({
            title: getLanguage(this.props.language).Profile.SYMBOL,
            leftImagePath: require('../../../assets/Mine/mine_my_local_symbol.png'),
            onClick: () =>
              this.goToMyData(getLanguage(this.props.language).Profile.SYMBOL),
            //Const.SYMBOL),
          })}
          {/* {this._renderItem({
            title: getLanguage(this.props.language).Profile.COLOR_SCHEME,
            leftImagePath: require('../../../assets/Mine/mine_my_color_light.png'),
            onClick: () =>
              this.goToMyData(
                getLanguage(this.props.language).Profile.COLOR_SCHEME,
              ),
            //Const.MINE_COLOR),
          })} */}
          {this._renderItem({
            title: getLanguage(this.props.language).Profile.TEMPLATE,
            leftImagePath: require('../../../assets/function/icon_function_style.png'),
            onClick: () =>
              this.goToMyModule(
                getLanguage(this.props.language).Profile.TEMPLATE,
              ),
          })}
          {/*{this._renderItem({*/}
          {/*title: '我的数据',*/}
          {/*leftImagePath: require('../../../assets/Mine/mine_my_online_data.png'),*/}
          {/*onClick: this.goToMyOnlineData,*/}
          {/*})}*/}
          {/*{this._renderItem({*/}
          {/*title: '我的服务',*/}
          {/*leftImagePath: require('../../../assets/Mine/mine_my_service.png'),*/}
          {/*onClick: this.goToMyService,*/}
          {/*})}*/}
        </ScrollView>
      </View>
    )
  }
  _renderHeader = () => {
    let allColor = color.font_color_white
    let headerHeight = scaleSize(120)
    let imageWidth = scaleSize(70)
    let isPro =
      this.props.user.currentUser.userType &&
      this.props.user.currentUser.userType !== UserType.PROBATION_USER
    let headerImage = isPro
      ? {
        uri:
            'https://cdn3.supermapol.com/web/cloud/84d9fac0/static/images/myaccount/icon_plane.png',
      }
      : require('../../../assets/home/system_default_header_image.png')
    let headerTitle = isPro
      ? this.props.user.currentUser.userName
        ? this.props.user.currentUser.userName
        : Customer
      : getLanguage(this.props.language).Profile.LOGIN_NOW
    return (
      <View
        style={{
          flexDirection: 'row',
          height: headerHeight,
          width: '100%',
          alignItems: 'center',
        }}
      >
        <TouchableOpacity
          onPress={() => {
            if (
              headerTitle !== getLanguage(this.props.language).Profile.LOGIN_NOW
            ) {
              this.goToPersonal()
            }
          }}
          activeOpacity={1}
          style={{
            width: headerHeight,
            height: headerHeight,
            justifyContent: 'center',
            alignItems: 'center',
          }}
        >
          <Image
            resizeMode={'contain'}
            style={{
              width: imageWidth,
              height: imageWidth,
              borderRadius: 8,
            }}
            source={headerImage}
          />
        </TouchableOpacity>
        <TouchableOpacity
          style={{ flex: 1 }}
          onPress={() => {
            if (
              headerTitle === getLanguage(this.props.language).Profile.LOGIN_NOW
            ) {
              this.goToLogin()
            }
          }}
        >
          <Text
            style={{
              fontSize: size.fontSize.fontSizeXXl,
              color: allColor,
              fontWeight: 'bold',
            }}
          >
            {headerTitle}
          </Text>
        </TouchableOpacity>
      </View>
    )
  }

  _renderLine = () => {
    return (
      <View
        style={{
          width: '100%',
          height: 2,
          backgroundColor: color.separateColorGray,
        }}
      />
    )
  }

  _renderItem = (
    itemRequire = {
      title: '',
      leftImagePath: '',
      onClick: () => {
        Toast.show('test')
      },
    },
    itemOptions = {
      itemWidth: '100%',
      itemHeight: scaleSize(90),
      fontSize: size.fontSize.fontSizeXl,
      imageWidth: scaleSize(45),
      imageHeight: scaleSize(45),
      rightImagePath: require('../../../assets/Mine/mine_my_arrow.png'),
    },
  ) => {
    const { title, leftImagePath, onClick } = itemRequire
    const {
      itemWidth,
      itemHeight,
      fontSize,
      imageWidth,
      imageHeight,
      rightImagePath,
    } = itemOptions
    let imageColor = color.imageColorBlack
    let txtColor = color.fontColorBlack
    return (
      <View style={{ flex: 1 }} display={this.state.display}>
        <TouchableOpacity
          style={{
            flexDirection: 'row',
            width: itemWidth,
            height: itemHeight,
            alignItems: 'center',
            paddingLeft: 15,
            paddingRight: 15,
          }}
          onPress={onClick}
        >
          <Image
            style={{
              width: imageWidth,
              height: imageHeight,
              tintColor: imageColor,
            }}
            resizeMode={'contain'}
            source={leftImagePath}
          />
          <Text
            style={{
              lineHeight: itemHeight,
              flex: 1,
              textAlign: 'left',
              fontSize: fontSize,
              color: txtColor,
              paddingLeft: 15,
            }}
          >
            {title}
          </Text>
          <Image
            style={{
              width: imageWidth - 5,
              height: imageHeight - 5,
              tintColor: imageColor,
            }}
            resizeMode={'contain'}
            source={rightImagePath}
          />
        </TouchableOpacity>
        <View
          style={{
            flex: 1,
            height: 1,
            backgroundColor: color.separateColorGray,
          }}
        />
      </View>
    )
  }

  _onPressAvater = () => {
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
    data = [
      {
        title: getLanguage(this.props.language).Profile.IMPORT,
        leftImagePath: require('../../../assets/Mine/mine_my_local_import_light.png'),
        onClick: this.goToMyLocalData,
      },
      {
        title: getLanguage(this.props.language).Profile.MY_SERVICE,
        leftImagePath: require('../../../assets/Mine/mine_my_service.png'),
        onClick: this.goToMyService,
      },
      {
        title: getLanguage(this.props.language).Profile.DATA,
        leftImagePath: require('../../../assets/Mine/mine_my_local_data.png'),
        onClick: () =>
          this.goToMyData(getLanguage(this.props.language).Profile.DATA),
      },
      {
        title: getLanguage(this.props.language).Profile.MARK,
        leftImagePath: require('../../../assets/Mine/mine_my_plot.png'),
        onClick: () => {
          this.goToMyLabel(getLanguage(this.props.language).Profile.MARK)
        },
      },
      {
        title: getLanguage(this.props.language).Profile.MAP,
        leftImagePath: require('../../../assets/Mine/mine_my_local_map.png'),
        onClick: () =>
          this.goToMyData(getLanguage(this.props.language).Profile.MAP),
      },
      {
        title: getLanguage(this.props.language).Profile.SCENE,
        leftImagePath: require('../../../assets/Mine/mine_my_local_scene.png'),
        onClick: () =>
          this.goToMyData(getLanguage(this.props.language).Profile.SCENE),
      },
      {
        title: getLanguage(this.props.language).Profile.BASEMAP,
        leftImagePath: require('../../../assets/Mine/my_basemap.png'),
        onClick: () => {
          this.goToMyBaseMap()
        },
      },
      {
        title: getLanguage(this.props.language).Profile.SYMBOL,
        leftImagePath: require('../../../assets/Mine/mine_my_local_symbol.png'),
        onClick: () =>
          this.goToMyData(getLanguage(this.props.language).Profile.SYMBOL),
      },
      // {
      //   title: getLanguage(this.props.language).Profile.COLOR_SCHEME,
      //   leftImagePath: require('../../../assets/Mine/mine_my_color_light.png'),
      //   onClick: () =>
      //     this.goToMyData(
      //       getLanguage(this.props.language).Profile.COLOR_SCHEME,
      //     ),
      // },
      {
        title: getLanguage(this.props.language).Profile.TEMPLATE,
        leftImagePath: require('../../../assets/function/icon_function_style.png'),
        onClick: () =>
          this.goToMyModule(getLanguage(this.props.language).Profile.TEMPLATE),
      },
    ]
    return data
  }

  _renderProfile = () => {
    return (
      <View style={styles.profileContainer}>
        {this._renderMyProfile()}
        {this._renderSearch()}
        {this._renderSideItem()}
      </View>
    )
  }

  _renderMyProfile = () => {
    let isPro = !UserType.isProbationUser(this.props.user.currentUser)
    let headerImage = isPro
      ? {
        uri:
            'https://cdn3.supermapol.com/web/cloud/84d9fac0/static/images/myaccount/icon_plane.png',
      }
      : require('../../../assets/home/system_default_header_image.png')
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
          <TouchableOpacity
            disabled={!isPro}
            activeOpacity={0.7}
            onPress={this._onPressAvater}
            style={styles.porfileAvaterStyle}
          >
            <Image style={styles.headImgStyle} source={headerImage} />
          </TouchableOpacity>
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

  _onSearch = () => {
    if (this.searchText === '') {
      Toast.show('请输入搜索内容')
      return
    }
    NavigationService.navigate('SearchMine', {
      searchText: this.searchText,
    })
    this.searchText = ''
    this.searchBar.clear()
  }

  _renderSideItem = () => {
    if (UserType.isProbationUser(this.props.user.currentUser)) {
      return null
    }
    return (
      <TouchableOpacity
        activeOpacity={0.7}
        onPress={this._onPressSwitch}
        style={styles.sideItemStyle}
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
    for (let i = 0; i < items.length; i++) {
      let show = this._itemFilter(items[i])
      if (show) {
        renderItems.push(this.renderItem(items[i], colNum))
      }
    }
    return renderItems
  }

  renderItem = (item, colNum) => {
    return (
      <TouchableOpacity
        onPress={item.onClick}
        style={[
          styles.itemView,
          { width: (this.screenWidth - scaleSize(40)) / colNum },
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

  _renderMineContainer = () => {
    return (
      <View style={styles.mineContainer}>
        {this._renderProfile()}
        {this._renderDatas()}
      </View>
    )
  }

  renderHeaderRight = () => {
    if (this.props.device.orientation !== 'LANDSCAPE') {
      return null
    }
    let searchImg = getPublicAssets().common.icon_search_a0
    return (
      <TouchableOpacity
        onPress={() => {
          NavigationService.navigate('SearchMine')
        }}
      >
        <Image resizeMode={'contain'} source={searchImg} />
      </TouchableOpacity>
    )
  }

  render() {
    this.screenWidth = Dimensions.get('window').width
    this.screenHeight = Dimensions.get('window').height
    return (
      <Container
        ref={ref => (this.container = ref)}
        headerProps={{
          title: getLanguage(this.props.language).Navigator_Label.PROFILE,
          withoutBack: true,
          navigation: this.props.navigation,
          headerRight: this.renderHeaderRight(),
        }}
      >
        {/* {this._selectionRender()} */}
        {this._renderMineContainer()}
      </Container>
    )
  }
}
