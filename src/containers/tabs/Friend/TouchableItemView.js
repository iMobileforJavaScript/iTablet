import React, { Component } from 'react'
import { StyleSheet, Text, View, TouchableOpacity, Image } from 'react-native'
import { scaleSize } from '../../../utils/screen'

export default class TouchableItemView extends Component {
  props: {
    item: Object,
    disableTouch: Boolean,
    onPress: () => {},
    renderRight: () => {},
    contentStyle: {},
    imageStyle: {},
    textStyle: {},
    seperatorStyle: {},
  }

  constructor(props) {
    super(props)
  }

  render() {
    return (
      <View style={styles.itemView}>
        <View style={[styles.contentView, this.props.contentStyle]}>
          <TouchableOpacity
            disabled={
              this.props.disableTouch === undefined
                ? false
                : this.props.disableTouch
            }
            style={styles.touchView}
            onPress={this.props.onPress}
          >
            <Image
              resizeMode={'contain'}
              source={this.props.item.image}
              style={[styles.image, this.props.imageStyle]}
            />
            <Text style={[styles.textView, this.props.textStyle]}>
              {this.props.item.text}
            </Text>
          </TouchableOpacity>
          {this.props.renderRight ? this.props.renderRight(this.props) : null}
        </View>
        <View style={[styles.seperator, this.props.seperatorStyle]} />
      </View>
    )
  }
}

const styles = StyleSheet.create({
  itemView: {
    flexDirection: 'column',
  },
  contentView: {
    height: scaleSize(80),
    flexDirection: 'row',
    alignItems: 'center',
    paddingLeft: scaleSize(40),
  },
  touchView: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
  },
  image: {
    width: scaleSize(48),
    height: scaleSize(48),
    marginRight: scaleSize(30),
  },
  textView: {
    fontSize: scaleSize(26),
    color: '#505050',
  },
  seperator: {
    height: scaleSize(1),
    marginLeft: scaleSize(118),
    backgroundColor: '#A0A0A0',
  },
})
