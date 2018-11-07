/*
 Copyright © SuperMap. All rights reserved.
 Author: Yang Shanglong
 E-mail: yangshanglong@supermap.com
 */
import React, { PureComponent } from 'react'
import { View, StyleSheet, ScrollView, Animated } from 'react-native'
import Header from '../Header'
import Loading from './Loading'
import { scaleSize } from '../../utils'

import styles from './styles'

const AnimatedView = Animated.View

export default class Container extends PureComponent {
  props: {
    style?: StyleSheet,
    titleStyle?: StyleSheet,
    children: any,
    title: string,
    header: any,
    bottomBar: any,
    title: string,
    withoutHeader: boolean,
    headerProps: Object,
    bottomProps: Object,
    navigation: Object,
    initWithLoading: boolean,
    dialogInfo: boolean,
    scrollable: boolean,
  }

  static defaultProps = {
    withoutHeader: false,
    sideMenu: false,
    initWithLoading: false,
    scrollable: false,
  }

  constructor(props) {
    super(props)
    this.state = {
      top: new Animated.Value(0),
      bottom: new Animated.Value(0),
    }
    this.headerVisible = true
    this.bottomVisible = true
  }

  setHeaderVisible = visible => {
    if (this.props.header) {
      if (this.headerVisible === visible) return
      Animated.timing(this.state.top, {
        toValue: visible ? 0 : scaleSize(-200),
        duration: 300,
      }).start()
      this.headerVisible = visible
    } else {
      this.containerHeader && this.containerHeader.setVisible(visible)
    }
  }

  setBottomVisible = visible => {
    if (this.bottomVisible === visible) return
    Animated.timing(this.state.bottom, {
      toValue: visible ? 0 : scaleSize(-200),
      duration: 300,
    }).start()
    this.bottomVisible = visible
  }

  componentDidMount() {
    this.props.initWithLoading && this.setLoading(true)
  }

  setLoading = (loading, info, extra = {}) => {
    this.loading.setLoading(loading, info, extra)
  }

  renderHeader = fixHeader => {
    return this.props.withoutHeader ? (
      <View style={styles.iOSPadding} />
    ) : this.props.header ? (
      <AnimatedView
        style={[fixHeader && styles.fixHeader, { top: this.state.top }]}
      >
        this.props.header
      </AnimatedView>
    ) : (
      <Header
        ref={ref => (this.containerHeader = ref)}
        navigation={this.props.navigation}
        {...this.props.headerProps}
      />
    )
  }

  renderBottom = () => {
    if (!this.props.bottomBar) return null
    let style = []
    if (this.props.bottomProps) {
      if (this.props.bottomProps.type === 'fix') {
        style.push(styles.fixBottomBar)
      } else {
        style.push(styles.flexBottomBar)
      }
      if (this.props.bottomProps.style) {
        style.push(this.props.bottomProps.style)
      }
    } else {
      style.push(styles.flexBottomBar)
    }
    return (
      <AnimatedView style={[style, { bottom: this.state.bottom }]}>
        {this.props.bottomBar}
      </AnimatedView>
    )
  }

  render() {
    let ContainerView = this.props.scrollable ? ScrollView : View

    // 是否为flex布局的header
    let fixHeader =
      this.props.headerProps && this.props.headerProps.type === 'fix'

    return (
      <ContainerView style={[styles.container, this.props.style]}>
        {!fixHeader && this.renderHeader(fixHeader)}
        {this.props.children}
        {fixHeader && this.renderHeader(fixHeader)}
        {this.renderBottom()}
        <Loading
          ref={ref => (this.loading = ref)}
          info={this.props.dialogInfo}
          initLoading={this.props.initWithLoading}
        />
      </ContainerView>
    )
  }
}
