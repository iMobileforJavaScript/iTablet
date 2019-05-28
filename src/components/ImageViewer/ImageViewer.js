/*
  Copyright © SuperMap. All rights reserved.
  Author: Yang Shanglong
  E-mail: yangshanglong@supermap.com
*/

import * as React from 'react'
import { Modal } from 'react-native'
import ImageViewer from 'react-native-image-zoom-viewer'

export default class MyImageViewer extends React.Component {
  props: {
    imageUrls: Array,
    enableImageZoom?: boolean,
    index?: number,
    onChange?: () => {},
    onClick?: () => {},
  }

  static defaultProps = {
    imageUrls: [],
    enableImageZoom: true,
  }

  state = {
    visible: false,
    index: -1,
  }

  shouldComponentUpdate(nextProps, nextState) {
    return (
      JSON.stringify(this.props) !== JSON.stringify(nextProps) ||
      JSON.stringify(this.state) !== JSON.stringify(nextState)
    )
  }

  setVisible = (visible = !this.state.visible, index = 0) => {
    if (visible !== this.state.visible) {
      this.setState({
        visible,
        index,
      })
    }
  }

  _onChange = index => {
    if (this.props.onChange && typeof this.props.onChange === 'function') {
      this.props.onChange(index)
    }
    index !== this.state.index &&
      this.setState({
        index,
      })
  }

  _onClick = index => {
    if (this.props.onClick && typeof this.props.onClick === 'function') {
      this.props.onClick(index)
    }
    this.setVisible(false)
  }

  // setImageIndex = index => {
  //   index !== this.state.index && this.setState({
  //     index,
  //   })
  // }

  render() {
    return (
      <Modal visible={this.state.visible} transparent={true}>
        <ImageViewer
          index={this.state.index}
          {...this.props}
          onChange={this._onChange}
          onClick={this._onClick}
        />
      </Modal>
    )
  }
}
