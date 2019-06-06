/*
  Copyright © SuperMap. All rights reserved.
  Author: lu cheng dong
  E-mail: 756355668@qq.com
*/
import React, { Component } from 'react'
import {
  View,
  Text,
  TouchableOpacity,
  Image,
  ScrollView,
  AsyncStorage,
} from 'react-native'
import { Container } from '../../../components'
import NavigationService from '../../NavigationService'
import { color, size } from '../../../styles'
import Toast from '../../../utils/Toast'
import { scaleSize } from '../../../utils'
import { getLanguage } from '../../../language/index'

var SUPERMAPKNOWN_UPDATE_TIME = 'SUPERMAPKNOWN_UPDATE_TIME'
var SUPERMAPGROUP_UPDATE_TIME = 'SUPERMAPGROUP_UPDATE_TIME'

var superMapKnownTime
var superMapGroupTime

export default class Find extends Component {
  props: {
    language: string,
    navigation: Object,
    user: Object,
  }

  constructor(props) {
    super(props)
    this.state = {
      display: 'flex',
      superMapKnown: false,
      superMapGroup: false,
    }
  }

  componentDidMount() {
    fetch('http://111.202.121.144:8088/officialAccount/zhidao/update.json')
      .then(response => response.json())
      .then(responseJson => {
        let result = responseJson
        AsyncStorage.getItem(SUPERMAPKNOWN_UPDATE_TIME)
          .then(value => {
            if (value == null || value < result.lastTime) {
              superMapKnownTime = result.lastTime
              this.setState({ superMapKnown: true })
            }
          })
          .catch(() => {})
      })
      .catch(() => {})

    fetch(
      'http://111.202.121.144:8088/officialAccount/SuperMapGroup/update.json',
    )
      .then(response => response.json())
      .then(responseJson => {
        let result = responseJson
        AsyncStorage.getItem(SUPERMAPGROUP_UPDATE_TIME)
          .then(value => {
            if (value == null || value < result.lastTime) {
              superMapGroupTime = result.lastTime
              this.setState({ superMapGroup: true })
            }
          })
          .catch(() => {})
      })
      .catch(() => {})
  }

  goToSuperMapForum = () => {
    NavigationService.navigate('Protocol', { type: 'superMapForum' })
  }

  goToSuperMap = () => {
    NavigationService.navigate('Protocol', { type: 'supermap' })
  }

  _renderItem = (
    itemRequire = {
      title: '',
      leftImagePath: '',
      isInformSpot: false,
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
    const { title, leftImagePath, isInformSpot, onClick } = itemRequire
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
          <View
            style={{
              marginLeft: 15,
              flexDirection: 'row',
              flex: 1,
              // justifyContent:"center",
              alignItems: 'center',
              // backgroundColor: color.separateColorGray,
              borderBottomWidth: 1,
              borderBottomColor: color.separateColorGray,
            }}
          >
            <Text
              style={{
                lineHeight: itemHeight,
                flex: 1,
                textAlign: 'left',
                fontSize: fontSize,
                color: txtColor,
              }}
            >
              {title}
            </Text>
            <Image
              style={{
                width: imageWidth - 5,
                height: imageHeight - 6,
                tintColor: imageColor,
                marginRight: 15,
              }}
              resizeMode={'contain'}
              source={rightImagePath}
            />
          </View>

          {isInformSpot ? (
            <View
              style={{
                position: 'absolute',
                backgroundColor: 'red',
                height: scaleSize(15),
                width: scaleSize(15),
                borderRadius: scaleSize(15),
                left: scaleSize(50),
                top: scaleSize(20),
              }}
            />
          ) : null}
        </TouchableOpacity>
      </View>
    )
  }

  _selectionRender = () => {
    return (
      <View
        opacity={1}
        style={{ flex: 1, backgroundColor: color.contentColorWhite }}
      >
        <ScrollView
          style={{ flex: 1 }}
          showsHorizontalScrollIndicator={false}
          showsVerticalScrollIndicator={false}
          overScrollMode={'always'}
          bounces={true}
        >
          {/* {this._renderLine()} */}
          {this._renderItem({
            title: getLanguage(this.props.language).Prompt.PUBLIC_MAP,
            //  Const.PUBLICMAP,
            leftImagePath: require('../../../assets/Find/find_publicmap.png'),
            isInformSpot: false,
            onClick: () => {
              NavigationService.navigate('PublicMap')
            },
          })}
          {/* {this._renderItem({
            title: Const.FRIENDMAP,
            leftImagePath: require('../../../assets/Find/find_publicmap.png'),
            onClick: () => {
              NavigationService.navigate('FriendMap')
            },
          })} */}
          {this._renderItem({
            title: getLanguage(this.props.language).Prompt.SUPERMAP_GROUP,
            leftImagePath: require('../../../assets/Find/icon_contact_map_light.png'),
            isInformSpot: this.state.superMapGroup,
            onClick: () => {
              NavigationService.navigate('SuperMapKnown', {
                type: 'SuperMapGroup',
                callback: this.state.superMapGroup
                  ? () => {
                    this.setState({ superMapGroup: false })
                    AsyncStorage.setItem(
                      SUPERMAPGROUP_UPDATE_TIME,
                      superMapGroupTime,
                    )
                  }
                  : null,
              })
            },
          })}
          {this._renderItem({
            title: getLanguage(this.props.language).Prompt.SUPERMAP_KNOW,
            // Const.SUPERMAPKNOWN,
            leftImagePath: require('../../../assets/Mine/icon_discover_notice_light.png'),
            isInformSpot: this.state.superMapKnown,
            onClick: () => {
              // NavigationService.navigate('SuperMapKnown')
              NavigationService.navigate('SuperMapKnown', {
                type: 'SuperMapKnow',
                callback: this.state.superMapKnown
                  ? () => {
                    this.setState({ superMapKnown: false })
                    AsyncStorage.setItem(
                      SUPERMAPKNOWN_UPDATE_TIME,
                      superMapKnownTime,
                    )
                  }
                  : null,
              })
            },
          })}
          {this._renderItem({
            title: getLanguage(this.props.language).Prompt.SUPERMAP_FORUM,
            //Const.FORUMOFSUPERMAP,
            leftImagePath: require('../../../assets/Find/find_forum.png'),
            isInformSpot: false,
            onClick: this.goToSuperMapForum,
          })}
        </ScrollView>
      </View>
    )
  }

  _render = () => {
    return (
      <View
        opacity={1}
        style={{ flex: 1, backgroundColor: color.contentColorWhite }}
      >
        <ScrollView
          style={{ flex: 1 }}
          showsHorizontalScrollIndicator={false}
          showsVerticalScrollIndicator={false}
          overScrollMode={'always'}
          bounces={true}
        >
          {/* {this._renderLine()} */}
        </ScrollView>
      </View>
    )
  }

  render() {
    return (
      <Container
        ref={ref => (this.container = ref)}
        headerProps={{
          title: getLanguage(this.props.language).Navigator_Label.EXPLORE,
          withoutBack: true,
          navigation: this.props.navigation,
        }}
      >
        {this._selectionRender()}
      </Container>
    )
  }
}
