import React, { Component } from 'react'
import { StyleSheet, Text, View, TouchableOpacity, Image } from 'react-native'
import { scaleSize } from '../../../utils/screen'

export default class TouchableItemView extends Component {
  props: {
    item: Object,
    text: String,
    image: Object,
    disableTouch: Boolean,
    onPress: () => {},
    renderImage: () => {},
    renderText: () => {},
    renderUpperText: () => {},
    renderBottomText: () => {},
    renderLeft: () => {},
    renderRight: () => {},
    contentStyle: {},
    imageStyle: {},
    textStyle: {},
    seperatorStyle: {},
  }

  constructor(props) {
    super(props)
  }

  renderImage = () => {
    if (this.props.renderImage) {
      return this.props.renderImage(this.props)
    }
    return (
      <Image
        resizeMode={'contain'}
        source={this.props.image}
        style={[styles.image, this.props.imageStyle]}
      />
    )
  }

  renderText = () => {
    if (this.props.renderText) {
      return this.props.renderText(this.props)
    }
    return (
      <View style={styles.textView}>
        {this.renderUpperText()}
        {this.renderBottomText()}
      </View>
    )
  }

  renderUpperText = () => {
    if (this.props.renderUpperText) {
      return this.props.renderUpperText(this.props)
    }
    return (
      <Text
        style={[styles.upperText, this.props.textStyle]}
        numberOfLines={1}
        ellipsizeMode={'tail'}
      >
        {this.props.text}
      </Text>
    )
  }

  renderBottomText = () => {
    if (this.props.renderBottomText) {
      return this.props.renderBottomText(this.props)
    }
    return null
  }

  renderItem = () => {
    return (
      <TouchableOpacity
        disabled={
          this.props.disableTouch === undefined
            ? false
            : this.props.disableTouch
        }
        style={styles.touchView}
        onPress={this.props.onPress}
      >
        {this.renderImage()}
        {this.renderText()}
      </TouchableOpacity>
    )
  }

  renderLeft = () => {
    if (this.props.renderLeft) {
      return this.props.renderLeft(this.props)
    }
    return null
  }

  renderRight = () => {
    if (this.props.renderRight) {
      return this.props.renderRight(this.props)
    }
    return null
  }

  renderContent = () => {
    return (
      <View
        style={[
          styles.contentView,
          this.props.renderLeft ? { paddingLeft: 0 } : null,
          this.props.contentStyle,
        ]}
      >
        {this.renderLeft()}
        {this.renderItem()}
        {this.renderRight()}
      </View>
    )
  }

  renderSeperator = () => {
    return <View style={[styles.seperator, this.props.seperatorStyle]} />
  }

  render() {
    return (
      <View style={styles.itemView}>
        {this.renderContent()}
        {this.renderSeperator()}
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
    flex: 1,
  },
  upperText: {
    fontSize: scaleSize(26),
    color: '#505050',
  },
  seperator: {
    height: scaleSize(1),
    marginLeft: scaleSize(118),
    backgroundColor: '#A0A0A0',
  },
})
