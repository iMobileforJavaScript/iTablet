import * as React from 'react'
import { TouchableOpacity, Text, Image, View, Platform } from 'react-native'
import { getPublicAssets } from '../../assets'
import styles from './styles'

export default class MediaItem extends React.Component {
  props: {
    data: Object,
    index: number,
    onPress?: () => {},
    onDeletePress?: () => {},
    onLongPress?: () => {},
  }

  constructor(props) {
    super(props)
    this.state = {
      image: { uri: props.data.uri },
      showDelete: false,
    }
  }

  _onPress = () => {
    if (this.props.onPress && typeof this.props.onPress === 'function') {
      this.props.onPress({
        data: this.props.data,
        index: this.props.index,
      })
    }
  }

  _deletePress = () => {
    if (
      this.props.onDeletePress &&
      typeof this.props.onDeletePress === 'function'
    ) {
      this.props.onDeletePress({
        data: this.props.data,
        index: this.props.index,
      })
    }
  }

  _onLongPress = () => {
    if (
      this.props.onLongPress &&
      typeof this.props.onLongPress === 'function'
    ) {
      this.props.onLongPress({
        ref: this,
        data: this.props.data,
        index: this.props.index,
      })
    }
  }

  setDelete = showDelete => {
    if (showDelete !== this.state.showDelete) {
      this.setState({
        showDelete,
      })
    }
  }

  renderDuration = sec => {
    let m = 0
    if (sec > 60) {
      m = Math.floor(sec / 60)
      sec -= 60 * m
    }
    let s = sec.toFixed() - 1 + 1

    let duration = (m >= 10 ? '' : '0') + m + ':' + (s >= 10 ? '' : '0') + s
    return <Text style={styles.duration}>{duration}</Text>
  }

  renderDelete = () => {
    if (!this.state.showDelete || this.props.data === '+') return null
    return (
      <View style={styles.deleteOverlay}>
        <TouchableOpacity style={styles.deleteView} onPress={this._deletePress}>
          <Image
            resizeMode={'contain'}
            style={styles.deleteImg}
            source={getPublicAssets().common.icon_delete}
          />
        </TouchableOpacity>
      </View>
    )
  }

  render = () => {
    let image
    if (this.props.data === '+') {
      image = getPublicAssets().common.icon_plus_gray
    } else {
      let imgPath = this.props.data.path || this.props.data.uri
      if (
        Platform.OS === 'android' &&
        imgPath.toLowerCase().indexOf('content://') !== 0
      ) {
        imgPath = 'file://' + imgPath
      }
      image = { uri: imgPath }
    }

    return (
      <View
        style={
          this.props.data === '+' ? styles.plusImageView : styles.imageView
        }
      >
        <TouchableOpacity
          key={this.props.index}
          style={styles.imageView}
          onPress={this._onPress}
          onLongPress={this._onLongPress}
          delayPressIn={1000}
        >
          <Image style={styles.image} resizeMode={'cover'} source={image} />
          {this.props.data.duration >= 0 &&
            this.props.data.type === 'video' &&
            this.renderDuration(this.props.data.duration)}
        </TouchableOpacity>
        {this.renderDelete()}
      </View>
    )
  }
}
