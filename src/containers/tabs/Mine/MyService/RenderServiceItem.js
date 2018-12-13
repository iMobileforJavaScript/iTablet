import React, { PureComponent } from 'react'
import { Image, Text, View } from 'react-native'
// import { Utility, SOnlineService } from 'imobile_for_reactnative'
import styles, { textHeight } from './Styles'

export default class RenderServiceItem extends PureComponent {
  props: {
    onItemPress: () => {},
    imageUrl: string,
    restTitle: string,
    itemId: string,
    isPublish: boolean,
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
          <Image
            resizeMode={'stretch'}
            style={styles.imageStyle}
            source={{ uri: this.props.imageUrl }}
          />
          <View>
            <Text style={styles.restTitleTextStyle}>
              {this.props.restTitle}
            </Text>
            <Text
              onPress={() => {
                if (this.props.onItemPress) {
                  this.props.onItemPress(
                    this.props.isPublish,
                    this.props.itemId,
                    this.props.restTitle,
                  )
                }
              }}
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
