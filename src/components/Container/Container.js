/*
 Copyright © SuperMap. All rights reserved.
 Author: Yang Shanglong
 E-mail: yangshanglong@supermap.com
 */
import React, { PureComponent } from 'react'
import { View, StyleSheet, ScrollView } from 'react-native'
import Header from '../Header'
import Loading from './Loading'

import styles from './styles'

export default class Container extends PureComponent {
  props: {
    style?: StyleSheet,
    titleStyle?: StyleSheet,
    children: any,
    title: string,
    header: any,
    title: string,
    withoutHeader: boolean,
    headerProps: Object,
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

  componentDidMount() {
    this.props.initWithLoading && this.setLoading(true)
  }

  setLoading = (loading, info, extra = {}) => {
    this.loading.setLoading(loading, info, extra)
  }

  render() {
    const {
      style,
      children,
      header,
      withoutHeader,
      headerProps,
      navigation,
      initWithLoading,
      dialogInfo,
      scrollable,
    } = this.props

    let ContainerView = scrollable ? ScrollView : View
    return (
      <ContainerView style={[styles.container, style]}>
        {withoutHeader ? (
          <View style={styles.iOSPadding} />
        ) : header ? (
          header
        ) : (
          <Header navigation={navigation} {...headerProps} />
        )}
        {children}
        <Loading
          ref={ref => (this.loading = ref)}
          info={dialogInfo}
          initLoading={initWithLoading}
        />
      </ContainerView>
    )
  }
}
