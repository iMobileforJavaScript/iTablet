/*
 Copyright © SuperMap. All rights reserved.
 Author: Yang Shanglong
 E-mail: yangshanglong@supermap.com
 */
import React, { Component } from 'react'
import { Text, View, Image, TouchableOpacity, StyleSheet } from 'react-native'
import styles from './styles'

class NavigationHeader extends Component {
  props: {
    nav?: any,
    header?: any, // 自定义Header
    headerStyle?: StyleSheet, // 自定义Header Style
    withoutBack?: boolean, // 是否有返回按钮
    backBtnType?: string, // 返回按钮类型（white, gray）
    backAction?: any, // 返回事件
    title?: string, // 标题
    headerViewStyle?: StyleSheet, // Header Style
    headerLeftStyle?: StyleSheet, //
    headerRightStyle?: StyleSheet, //
    headerTitleViewStyle?: StyleSheet, //
    headerTitleStyle?: StyleSheet, //
    headerLeft?: any, // Header左端组件，可为Array
    headerRight?: any, // Header右端组件，可为Array
    opacity?: number, // 透明度
    activeOpacity?: number, // 返回键点击透明度
    type?: string, // default | float:浮动Header | floatNoTitle:浮动无title,透明背景 | fix:固定顶部，绝对定位
    navigation?: any, // navigation
    count?: any,
    darkBackBtn?: boolean, // 黑色透明背景，返回按钮
    headerCenter?: any,
  }

  static defaultProps = {
    title: '',
    withoutBack: false,
    backBtnType: 'gray',
    opacity: 1,
    activeOpacity: 0.2,
    type: 'default',
    headerViewStyle: styles.navigationHeader,
    headerLeftStyle: styles.headerLeftView,
    headerTitleViewStyle: styles.headerTitleView,
    headerTitleStyle: styles.headerTitle,
    count: 0,
    darkBackBtn: false,
    headerCenter: null,
  }

  handleBack = navigation => {
    if (this.props.backAction && typeof this.props.backAction === 'function') {
      this.props.backAction()
    } else if (!this.props.backAction && navigation) {
      navigation.goBack(null)
    }
  }

  renderDefaultHeader = () => {
    const {
      title,
      headerLeft,
      darkBackBtn,
      headerRight,
      withoutBack,
      activeOpacity,
      type,
      headerViewStyle,
      headerLeftStyle,
      headerTitleViewStyle,
      headerTitleStyle,
      headerRightStyle,
      navigation,
      count,
      headerCenter,
    } = this.props

    let backBtnSource = require('../../assets/public/icon-back-white.png')
    // backBtnType === 'white'
    //   ? require('../../assets/public/icon-back-white.png')
    //   : require('../../assets/public/icon-back-gray.png')
    let backBtn = (
      <TouchableOpacity
        accessible={true}
        accessibilityLabel={'返回'}
        style={styles.backBtn}
        activeOpacity={activeOpacity}
        onPress={() => {
          this.handleBack(navigation)
        }}
      >
        {count ? <Text style={styles.count}>({count})</Text> : null}
        <View
          style={[styles.iconBtnBg, darkBackBtn && styles.iconBtnBgDarkColor]}
        >
          <Image source={backBtnSource} style={styles.backIcon} />
        </View>
      </TouchableOpacity>
    )
    let titleView = null
    if (type === 'floatNoTitle') {
      titleView = (
        <View style={headerTitleViewStyle}>
          {headerCenter ? (
            headerCenter
          ) : (
            <Text style={headerTitleStyle}>{title}</Text>
          )}
        </View>
      )
    }

    return (
      <View style={[styles.navigationHeader, headerViewStyle]}>
        {headerLeft ? (
          <View style={[styles.headerLeftView, headerLeftStyle]}>
            {headerLeft}
          </View>
        ) : (
          !withoutBack && backBtn
        )}
        {titleView}
        {headerRight && (
          <View style={[styles.headerRightView, headerRightStyle]}>
            {headerRight}
          </View>
        )}
      </View>
    )
  }

  render() {
    const {
      header,
      // backAction,
      opacity,
      type,
      headerStyle,
    } = this.props

    let currentHeaderStyle
    switch (type) {
      case 'floatNoTitle':
        currentHeaderStyle = styles.floatNoTitleHeaderView
        break
      case 'float':
        currentHeaderStyle = styles.floatHeaderView
        break
      case 'fix':
        currentHeaderStyle = styles.fixHeaderView
        break
      default:
        currentHeaderStyle = styles.defaultHeaderView
        break
    }

    return (
      <View style={[currentHeaderStyle, headerStyle, { opacity: opacity }]}>
        {header ? header : this.renderDefaultHeader()}
      </View>
    )
  }
}

export default NavigationHeader
