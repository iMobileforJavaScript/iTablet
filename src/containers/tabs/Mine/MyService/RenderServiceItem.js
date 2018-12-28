import React, { PureComponent } from 'react'
import { Image, Text, View, TouchableOpacity } from 'react-native'
import styles, { textHeight } from './Styles'
import NavigationService from '../../../NavigationService'
import Toast from '../../../../utils/Toast'
export default class RenderServiceItem extends PureComponent {
  props: {
    onItemPress: () => {},
    imageUrl: string,
    restTitle: string,
    itemId: string,
    isPublish: boolean,
    index: number,
    scenes: Object,
    mapInfos: Object,
  }
  defaultProps: {
    imageUrl: '',
    restTitle: '地图',
  }
  constructor(props) {
    super(props)
  }

  _navigator = () => {
    if (this.props.mapInfos.length > 0 || this.props.scenes.length > 0) {
      NavigationService.navigate('MyOnlineMap', {
        scenes: this.props.scenes,
        mapInfos: this.props.mapInfos,
      })
    } else {
      Toast.show('服务没有地图可展示')
    }
  }

  render() {
    return (
      <View>
        <View style={styles.itemViewStyle}>
          <TouchableOpacity
            onPress={() => {
              this._navigator()
            }}
          >
            <Image
              resizeMode={'stretch'}
              style={styles.imageStyle}
              source={{ uri: this.props.imageUrl }}
            />
          </TouchableOpacity>

          <View style={{ flex: 1 }}>
            <Text style={[styles.restTitleTextStyle]} numberOfLines={2}>
              {this.props.restTitle}
            </Text>
            <View style={{ flex: 1 }} />
            <Text
              onPress={() => {
                if (this.props.onItemPress) {
                  this.props.onItemPress(
                    this.props.isPublish,
                    this.props.itemId,
                    this.props.restTitle,
                    this.props.index,
                  )
                }
              }}
              numberOfLines={1}
              style={[
                styles.restTitleTextStyle,
                {
                  lineHeight: textHeight,
                  textAlign: 'right',
                  paddingRight: 25,
                },
              ]}
            >
              ...
            </Text>
          </View>
        </View>
        <View style={styles.separateViewStyle} />
      </View>
    )
  }
}
