/*
  Copyright © SuperMap. All rights reserved.
  Author: Wang zihao
  E-mail: zihaowang5325@qq.com
*/

import * as React from 'react'
import { View, StyleSheet, Image, TouchableOpacity, Text } from 'react-native'
import PropTypes from 'prop-types'
import * as Util from '../../utils/constUtil'

const ICON_HEIGHT =0.75* 0.1 * Util.WIDTH
const ICON_WIDTH = ICON_HEIGHT
const CONTAINER_HEIGHT = 1.4 * ICON_HEIGHT
const CONTAINER_WIDTH = CONTAINER_HEIGHT
const BTN_UNDERCOLOR = Util.UNDERLAYCOLOR

const styles = StyleSheet.create({
  container: {
    height: CONTAINER_HEIGHT-10,
    width: CONTAINER_WIDTH+10,
    backgroundColor: 'white',
    marginTop:5,
    marginBottom:5,
    borderStyle: 'solid',
    borderColor: Util.USUAL_SEPARATORCOLOR,
    borderWidth: 1,
    borderRadius: 10,
  },
  selectedContainer: {
    height: CONTAINER_HEIGHT-10,
    width: CONTAINER_WIDTH+10,
    backgroundColor: 'white',
    marginTop:5,
    marginBottom:5,
    borderStyle: 'solid',
    borderColor: Util.USUAL_BLUE,
    borderWidth: 1,
    borderRadius: 10,
  },
  inner: {
    flex: 1,
    flexDirection: 'column',
    backgroundColor: 'transparent',
    alignItems: 'center',
    justifyContent:'center',
  },
  text: {
    backgroundColor: 'transparent',
    width: CONTAINER_WIDTH+10,
    textAlign: 'center',
  },
  selectedText: {
    backgroundColor: 'transparent',
    width: CONTAINER_WIDTH+10,
    textAlign: 'center',
    color: Util.USUAL_BLUE,
  },
})

export default class Pop_Btn extends React.Component {

  static propTypes = {
    style: PropTypes.any, // 按钮样式
    titleStyle: PropTypes.any, // 文字样式
    selectedStyle: PropTypes.any, // 选中文字样式
    selectedTitleStyle: PropTypes.any, // 选中文字样式
    BtnText: PropTypes.string,
    btnClick: PropTypes.func,
    selected: PropTypes.bool,
  }

  static defaultProps = {
    selected: false,
  }

  render() {
    let containerStyle = [styles.container, this.props.selectedStyle],
      titleStyle =[styles.text, this.props.selectedTitleStyle]
    if (this.props.selected) {
      containerStyle = [styles.selectedContainer, this.props.selectedStyle]
      titleStyle = [styles.selectedText, this.props.selectedTitleStyle]
    }
    return (
      <TouchableOpacity accessible={true} accessibilityLabel={this.props.BtnText} style={containerStyle} onPress={this.props.btnClick} underlayColor={BTN_UNDERCOLOR}>
        <View style={styles.inner}>
          {this.props.BtnText && <Text style={titleStyle}>{this.props.BtnText}</Text>}
        </View>
      </TouchableOpacity>
    )
  }
}