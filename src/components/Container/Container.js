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

  setLoading = (loading, info) => {
    this.loading.setLoading(loading, info)
  }

  render() {
    const { style, children, header, withoutHeader, headerProps, navigation, initWithLoading, dialogInfo, scrollable } = this.props

    let SubContainer = scrollable ? ScrollView : View
    return (
      <View style={styles.container}>
        {withoutHeader ? <View style={styles.iOSPadding} /> : (
          header ? header : <Header navigation={navigation} {...headerProps} />
        )}
        <SubContainer style={[styles.container, style]}>
          {children}
          <Loading ref={ref => this.loading = ref} info={dialogInfo} initLoading={initWithLoading} />
        </SubContainer>
      </View>
    )
  }
}
