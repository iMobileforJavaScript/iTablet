/*
 Copyright © SuperMap. All rights reserved.
 Author: Yang Shanglong
 E-mail: yangshanglong@supermap.com
 */
import React, { PureComponent } from 'react'
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native'

import styles from './styles'

export default class Radio extends PureComponent {

  props: {
    style?: StyleSheet,
    titleStyle?: StyleSheet,
    title: string,
    value: any,
    selected: boolean,
    selectable: boolean,
    index?: number,
    onPress?: () => {},
  }

  static defaultProps = {
    type: 'input',
    selected: false,
    selectable: true,
  }

  constructor(props) {
    super(props)
    this.state = {
      selected: props.selected,
    }
  }

  select = selected => {
    let sel = selected
    if (selected === undefined) {
      sel = !this.state.selected
    }
    this.setState({
      selected: sel,
    })
  }

  selectAtion = selected => {
    if(this.state.selected) return
    this.select(selected)
    let sel = selected
    if (selected === undefined) {
      sel = !this.state.selected
    }
    this.props.onPress && this.props.onPress({
      title: this.props.title,
      value: this.props.value,
      selected: sel,
      index: this.props.index,
    })
  }

  render() {
    let viewStyle = styles.radioView,
      dotStyle = styles.radioSelected
    if (!this.props.selectable) {
      viewStyle = styles.radioViewGray
      dotStyle = styles.radioSelectedGray
    }

    if (this.props.selectable) {
      return (
        <TouchableOpacity
          style={styles.radioContainer}
          accessible={true}
          accessibilityLabel={this.props.title}
          onPress={() => this.selectAtion()}
        >
          <View style={viewStyle}>
            {
              this.state.selected && <View style={dotStyle} />
            }
          </View>
          {this.props.title && <Text style={[styles.radioTitle, this.props.titleStyle]}>{this.props.title}</Text>}
        </TouchableOpacity>
      )
    } else {
      return (
        <View style={styles.radioContainer}>
          <View style={viewStyle}>
            {
              this.state.selected && <View style={dotStyle} />
            }
          </View>
          {this.props.title && <Text style={[styles.radioTitle, this.props.titleStyle]}>{this.props.title}</Text>}
        </View>
      )
    }

  }
}