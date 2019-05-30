import * as React from 'react'
import { TouchableOpacity, Text, Image } from 'react-native'
import styles from './styles'

export default class MediaItem extends React.Component {
  props: {
    data: Object,
    index: number,
    onPress?: () => {},
  }

  constructor(props) {
    super(props)
    this.state = {
      image: { uri: props.data.uri },
    }
  }

  _onPress = () => {
    if (this.props.onPress && typeof this.props.onPress === 'function') {
      this.props.onPress({
        data: this.props.data,
        index: this.props.data,
      })
    }
  }

  renderDuration = sec => {
    let duration = '',
      m = 0,
      s = 0
    if (sec > 60) {
      m = Math.floor(sec / 60)
      sec -= 60 * m
    }
    s = sec.toFixed() - 1 + 1

    duration = (m >= 10 ? '' : '0') + m + ':' + (s >= 10 ? '' : '0') + s
    return <Text style={{ color: 'white', fontSize: 14 }}>{duration}</Text>
  }

  render = () => {
    return (
      <TouchableOpacity
        key={this.props.index}
        style={
          this.props.data.uri === '+' ? styles.plusImageView : styles.imageView
        }
        onPress={this._onPress}
      >
        <Image
          style={styles.image}
          resizeMode={'stretch'}
          source={
            this.props.data === '+'
              ? require('../../assets/public/icon-plus.png')
              : { uri: this.props.data.path || this.props.data.uri }
            // : { uri: item }
          }
        />
        {/*{*/}
        {/*this.props.data.duration &&*/}
        {/*this.renderDuration()*/}
        {/*}*/}
      </TouchableOpacity>
    )
  }
}
