import React, { PureComponent } from 'react'
import { View, Text, TouchableOpacity, Image, StyleSheet } from 'react-native'
import { color, size } from '../../../styles'
import { scaleSize } from '../../../utils'

const styles = StyleSheet.create({
  itemContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    height: scaleSize(80),
  },

  titleView: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-start',
    borderBottomWidth: 1,
    height: scaleSize(80),
    borderBottomColor: color.separateColorGray,
  },
  title: {
    fontSize: size.fontSize.fontSizeMd,
    color: color.fontColorBlack,
    backgroundColor: 'transparent',
  },
  imageView: {
    alignItems: 'center',
    justifyContent: 'center',
    width: scaleSize(120),
    height: scaleSize(80),
  },
  image: {
    width: scaleSize(40),
    height: scaleSize(40),
  },
})

export default class AnalystListItem extends PureComponent {
  props: {
    title: string,
    icon: any,
    onPress: () => {},
    style?: Object,
    imgStyle?: Object,
    titleStyle?: Object,
  }

  _onPress = () => {
    if (this.props.onPress && typeof this.props.onPress === 'function') {
      this.props.onPress({ title: this.props.title })
    }
  }

  render() {
    return (
      <TouchableOpacity
        activeOpacity={0.8}
        style={[styles.itemContainer, this.props.style]}
        onPress={this._onPress}
      >
        {this.props.icon && (
          <View style={styles.imageView}>
            <Image
              resizeMode={'contain'}
              style={[styles.image, this.props.imgStyle]}
              source={this.props.icon}
            />
          </View>
        )}
        <View
          style={[
            styles.titleView,
            !this.props.icon && { marginLeft: scaleSize(30) },
          ]}
        >
          <Text style={[styles.title, this.props.titleStyle]}>
            {this.props.title}
          </Text>
        </View>
      </TouchableOpacity>
    )
  }
}
