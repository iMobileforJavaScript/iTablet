import React, { Component } from 'react'
import { StyleSheet, TouchableOpacity, Image } from 'react-native'
import { scaleSize } from '../../../utils'

export default class Btnone extends Component {
  props: {
    cb: any,
  }
  constructor(props) {
    super(props)
    this.cb = this.props.cb
    this.state = {
      select: false,
    }
  }
  select = async () => {
    this.setState({ select: !this.state.select })
    this.cb && this.cb()
  }
  render() {
    return (
      <TouchableOpacity onPress={this.select} style={styles.btn}>
        {this.state.select ? (
          <Image
            source={require('../../../assets/public/icon_upload_selected.png')}
            style={styles.img}
          />
        ) : (
          <Image
            source={require('../../../assets/public/icon_upload_unselected.png')}
            style={styles.img}
          />
        )}
      </TouchableOpacity>
    )
  }
}
const styles = StyleSheet.create({
  img: {
    width: scaleSize(45),
    height: scaleSize(45),
  },
  btn: {
    width: scaleSize(100),
    alignItems: 'center',
  },
})
