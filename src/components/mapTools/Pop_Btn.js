/*
  Copyright © SuperMap. All rights reserved.
  Author: Wang zihao
  E-mail: zihaowang5325@qq.com
*/

import * as React from 'react'
import { View, StyleSheet, TouchableOpacity, Text } from 'react-native'
import { color } from '../../styles'
import PropTypes from 'prop-types'
import * as Util from '../../utils/constUtil'

const ICON_HEIGHT = 0.75 * 0.1 * Util.WIDTH
const CONTAINER_HEIGHT = 1.4 * ICON_HEIGHT
const CONTAINER_WIDTH = CONTAINER_HEIGHT
const BTN_UNDERCOLOR = Util.UNDERLAYCOLOR

const styles = StyleSheet.create({
  container: {
    height: CONTAINER_HEIGHT - 10,
    width: CONTAINER_WIDTH + 10,
    backgroundColor: 'white',
    marginTop: 5,
    marginBottom: 5,
    borderStyle: 'solid',
    borderWidth: 1,
    borderRadius: 10,
  },
  unselectedContainer: {
    borderColor: color.USUAL_SEPARATORCOLOR,
  },
  selectedContainer: {
    borderColor: color.USUAL_BLUE,
  },
  disableContainer: {
    borderColor: color.grayLight2,
  },
  inner: {
    flex: 1,
    flexDirection: 'column',
    backgroundColor: 'transparent',
    alignItems: 'center',
    justifyContent: 'center',
  },
  text: {
    backgroundColor: 'transparent',
    width: CONTAINER_WIDTH + 10,
    textAlign: 'center',
  },
  selectedText: {
    color: color.USUAL_BLUE,
  },
  disableText: {
    color: color.grayLight2,
  },
})

export default class Pop_Btn extends React.Component {
  static propTypes = {
    style: PropTypes.any, // 按钮样式
    titleStyle: PropTypes.any, // 文字样式
    selectedStyle: PropTypes.any, // 选中文字样式
    selectedTitleStyle: PropTypes.any, // 选中文字样式
    title: PropTypes.string,
    btnClick: PropTypes.func,
    selected: PropTypes.bool,
    selectable: PropTypes.bool,
  }

  static defaultProps = {
    selected: false,
    selectable: true,
  }

  action = () => {
    this.props.selectable && this.props.btnClick && this.props.btnClick()
  }

  render() {
    let containerStyle = [
        styles.container,
        styles.unselectedContainer,
        this.props.selectedStyle,
      ],
      titleStyle = [styles.text, this.props.selectedTitleStyle]
    if (!this.props.selectable) {
      containerStyle = [
        styles.container,
        styles.disableContainer,
        this.props.selectedStyle,
      ]
      titleStyle = [
        styles.text,
        styles.disableText,
        this.props.selectedTitleStyle,
      ]
    } else if (this.props.selected) {
      containerStyle = [
        styles.container,
        styles.selectedContainer,
        this.props.selectedStyle,
      ]
      titleStyle = [
        styles.text,
        styles.selectedText,
        this.props.selectedTitleStyle,
      ]
    }
    return (
      <TouchableOpacity
        disable={!this.props.selectable}
        activeOpacity={this.props.selectable ? 0.8 : 1}
        accessible={true}
        accessibilityLabel={this.props.title}
        style={containerStyle}
        onPress={this.action}
        underlayColor={BTN_UNDERCOLOR}
      >
        <View style={styles.inner}>
          {this.props.title && (
            <Text style={titleStyle}>{this.props.title}</Text>
          )}
        </View>
      </TouchableOpacity>
    )
  }
}
