/*
  Copyright © SuperMap. All rights reserved.
  Author: lu cheng dong
  E-mail: 756355668@qq.com
*/
import React, { Component } from 'react'
import { View, Text, TouchableOpacity, Image, ScrollView } from 'react-native'
import { Container } from '../../../components'
// import { FileTools } from '../../../native'
import NavigationService from '../../NavigationService'
// import Login from './Login'
import { color, size } from '../../../styles'
// import ConstPath from '../../../constants/ConstPath'
// import { SOnlineService } from 'imobile_for_reactnative'
import Toast from '../../../utils/Toast'
import { Const } from '../../../constants'
import { scaleSize } from '../../../utils'
export default class Find extends Component {
  props: {
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
            title: Const.PUBLICMAP,
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
            title: Const.SUPERMAPKNOWN,
            leftImagePath: require('../../../assets/Mine/mine_my_local_import.png'),
            onClick: () => {
              NavigationService.navigate('SuperMapKnown')
            },
          })}
          {this._renderItem({
            title: Const.FORUMOFSUPERMAP,
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
          {this._renderItem({
            title: Const.PUBLICMAP,
            leftImagePath: require('../../../assets/Mine/mine_my_local_import.png'),
            onClick: () => {},
          })}
          {this._renderItem({
            title: Const.SHUTTLCOMMUTER,
            leftImagePath: require('../../../assets/Mine/mine_my_local_import.png'),
            onClick: () => {},
          })}
          {this._renderItem({
            title: Const.SUPERMAP,
            leftImagePath: require('../../../assets/Mine/mine_my_local_map.png'),
            onClick: () => {},
          })}
          {this._renderItem({
            title: Const.FORUMOFSUPERMAP,
            leftImagePath: require('../../../assets/Mine/mine_my_local_scene.png'),
            onClick: () => {},
          })}
          {/* {this._renderItem({
            title: Const.SUPERMAPKNOWN,
            leftImagePath: require('../../../assets/Mine/mine_my_local_import.png'),
            onClick: () => {},
          })} */}
          {this._renderItem({
            title: Const.MAPOFAPP,
            leftImagePath: require('../../../assets/Mine/mine_my_local_import.png'),
            onClick: () => {},
          })}
        </ScrollView>
      </View>
    )
  }

  render() {
    return (
      <Container
        ref={ref => (this.container = ref)}
        headerProps={{
          title: '发现',
          withoutBack: true,
          navigation: this.props.navigation,
        }}
      >
        {this._selectionRender()}
      </Container>
    )
  }
}
