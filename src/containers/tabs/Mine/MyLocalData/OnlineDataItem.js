import React, { Component } from 'react'
import { Image, Text, TouchableOpacity, View } from 'react-native'
import { scaleSize } from '../../../../utils'
import { color, size } from '../../../../styles'
import { Progress } from '../../../../components'
import { getLanguage } from '../../../../language'
// import { SMap } from 'imobile_for_reactnative'
import UserType from '../../../../constants/UserType'
// import ConstPath from '../../../../constants/ConstPath'
// import {downloadFile} from 'react-native-fs'
// import { FileTools } from '../../../../native';
export default class OnlineDataItem extends Component {
  props: {
    user: Object,
    item: Object,
    itemOnPress: () => {},
    down: Array,
    updateDownList: () => {},
    removeItemOfDownList: () => {},
    index: number,
  }

  constructor(props) {
    super(props)
    this.downloading = false
  }

  shouldComponentUpdate(nextProps) {
    if (JSON.stringify(nextProps.item) !== JSON.stringify(this.props.item)) {
      return true
    }
    if (JSON.stringify(nextProps.down) !== JSON.stringify(this.props.down)) {
      for (let index = 0; index < nextProps.down.length; index++) {
        if (nextProps.down[index].id === this.props.item.id) {
          return true
        }
      }
    }
    return false
  }

  componentDidUpdate() {
    for (let index = 0; index < this.props.down.length; index++) {
      const element = this.props.down[index]
      if (element.id && element.id === this.props.item.id) {
        this.itemProgress.progress = element.progress / 100
        if (element.downed && element.progress === 0) {
          this.props.removeItemOfDownList(element).then(() => {
            this.itemProgress.progress = 0
          })
        }
        break
      }
    }
  }

  render() {
    let serverUrl
    if (UserType.isOnlineUser(this.props.user.currentUser)) {
      serverUrl = 'https://www.supermapol.com/web'
    } else if (UserType.isIPortalUser(this.props.user.currentUser)) {
      serverUrl = this.props.user.currentUser.serverUrl
    }
    return (
      <TouchableOpacity
        style={{
          flex: 1,
          flexDirection: 'column',
        }}
        onPress={() => {
          this.props.itemOnPress &&
            this.props.itemOnPress({
              ...this.props.item,
              index: this.props.index,
            })
        }}
      >
        <View
          style={{
            flexDirection: 'row',
            alignItems: 'center',
            height: scaleSize(80) + 1,
          }}
        >
          <Progress
            ref={ref => (this.itemProgress = ref)}
            style={{
              position: 'absolute',
              left: 0,
              top: 0,
              height: scaleSize(80),
              width: '100%',
            }}
            progressAniDuration={0}
            progressColor={'#rgba(70, 128, 223, 0.2)'}
          />
          <Image
            source={require('../../../../assets/Mine/mine_my_import_online_light.png')}
            resizeMode={'contain'}
            style={{
              width: scaleSize(50),
              height: scaleSize(50),
              marginLeft: 15,
            }}
          />
          <View
            style={{
              flexDirection: 'column',
              flex: 1,
              justifyContent: 'center',
            }}
          >
            <Text
              style={{
                marginTop: scaleSize(5),
                color: color.fontColorBlack,
                paddingLeft: 15,
                fontSize: size.fontSize.fontSizeXl,
              }}
            >
              {this.props.item.fileName}
            </Text>
            <Text
              ellipsizeMode={'middle'}
              numberOfLines={1}
              style={{
                marginTop: scaleSize(5),
                color: color.fontColorGray,
                paddingLeft: 15,
                fontSize: 10,
                height: 15,
                marginRight: 20,
              }}
            >
              {getLanguage(global.language).Profile.PATH +
                `:${serverUrl}/mycontent/datas/${this.props.item.id}`}
            </Text>
          </View>
          <Image
            source={require('../../../../assets/Mine/icon_more_gray.png')}
            resizeMode={'contain'}
            style={{
              width: scaleSize(40),
              height: scaleSize(40),
              marginRight: 10,
            }}
          />
        </View>
        <View
          style={{
            width: '100%',
            height: 1,
            backgroundColor: color.separateColorGray,
          }}
        />
      </TouchableOpacity>
    )
  }
}
