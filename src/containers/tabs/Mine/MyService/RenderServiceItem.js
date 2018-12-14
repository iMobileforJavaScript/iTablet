import React, { PureComponent } from 'react'
import { Image, Text, View, TouchableOpacity } from 'react-native'
import styles, { textHeight } from './Styles'
import { Toast } from '../../../../utils'

export default class RenderServiceItem extends PureComponent {
  props: {
    onItemPress: () => {},
    imageUrl: string,
    restTitle: string,
    itemId: string,
    isPublish: boolean,
    index: number,
  }
  defaultProps: {
    imageUrl: '',
    restTitle: '地图',
  }
  constructor(props) {
    super(props)
  }

  render() {
    return (
      <View>
        <View style={styles.itemViewStyle}>
          <TouchableOpacity
            onPress={() => {
              Toast.show('服务没有地图')
            }}
          >
            <Image
              resizeMode={'stretch'}
              style={styles.imageStyle}
              source={{ uri: this.props.imageUrl }}
            />
          </TouchableOpacity>

          <View>
            <Text style={[styles.restTitleTextStyle]} numberOfLines={1}>
              {this.props.restTitle}
            </Text>
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
