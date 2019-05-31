/*
  Copyright © SuperMap. All rights reserved.
  Author: lu cheng dong
  E-mail: 756355668@qq.com
*/
import React, { Component } from 'react'
import { View, Text, TouchableOpacity, Image, ScrollView } from 'react-native'
import { Container } from '../../../components'
import NavigationService from '../../NavigationService'
import { color, size } from '../../../styles'
import Toast from '../../../utils/Toast'
import { scaleSize } from '../../../utils'
import { getLanguage } from '../../../language/index'

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
    }
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
            onClick: () => {
              NavigationService.navigate('SuperMapKnown', {
                type: 'SuperMapGroup',
              })
            },
          })}
          {this._renderItem({
            title: getLanguage(this.props.language).Prompt.SUPERMAP_KNOW,
            // Const.SUPERMAPKNOWN,
            leftImagePath: require('../../../assets/Mine/icon_discover_notice_light.png'),
            onClick: () => {
              // NavigationService.navigate('SuperMapKnown')
              NavigationService.navigate('SuperMapKnown', {
                type: 'SuperMapKnow',
              })
            },
          })}
          {this._renderItem({
            title: getLanguage(this.props.language).Prompt.SUPERMAP_FORUM,
            //Const.FORUMOFSUPERMAP,
            leftImagePath: require('../../../assets/Find/find_forum.png'),
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
