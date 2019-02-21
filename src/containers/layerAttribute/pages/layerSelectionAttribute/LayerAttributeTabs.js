/*
 Copyright © SuperMap. All rights reserved.
 Author: Yangshanglong
 E-mail: yangshanglong@supermap.com
 */

import * as React from 'react'
import { View, StyleSheet } from 'react-native'
import { Container } from '../../../../components'
import { setSpText } from '../../../../utils'
import { color } from '../../../../styles'
import DefaultTabBar from './DefaultTabBar'
import LayerSelectionAttribute from './LayerSelectionAttribute'
import ScrollableTabView from 'react-native-scrollable-tab-view'

const styles = StyleSheet.create({
  container: {
    backgroundColor: 'transparent',
    flex: 1,
  },
})

export default class LayerAttributeTabs extends React.Component {
  props: {
    navigation: Object,
    currentAttribute: Object,
    currentLayer: Object,
    map: Object,
    selection: Array,
    setCurrentAttribute: () => {},
    setLayerAttributes: () => {},
  }

  constructor(props) {
    super(props)
    this.state = {}

    this.currentFieldInfo = []
    this.currentFieldIndex = -1
  }

  renderTabs = () => {
    let children = []
    for (let i = 0; i < this.props.selection.length; i++) {
      children.push(
        this.renderTable({
          data: this.props.selection[i],
          index: i,
        }),
      )
    }
    return (
      <ScrollableTabView
        ref={ref => (this.scrollTab = ref)}
        style={styles.container}
        initialPage={0}
        tabBarPosition={'bottom'}
        // onChangeTab={data => {
        //
        // }}
        renderTabBar={() => (
          <DefaultTabBar
            activeBackgroundColor={color.bgW}
            activeTextColor={color.themeText2}
            inactiveTextColor={'white'}
            textStyle={{
              // fontSize: size.fontSize.fontSizeSm,
              fontSize: setSpText(22),
              backgroundColor: 'transparent',
            }}
            tabStyle={{
              backgroundColor: color.subTheme,
            }}
          />
        )}
        tabBarUnderlineStyle={{
          height: 0,
        }}
      >
        {children}
      </ScrollableTabView>
    )
  }

  renderTable = ({ data, index = 0 }) => {
    return (
      <LayerSelectionAttribute
        key={index}
        tabLabel={data.layerInfo.name || ('图层' + index >= 0 ? index + 1 : '')}
        currentAttribute={this.props.currentAttribute}
        currentLayer={this.props.currentLayer}
        map={this.props.map}
        layerSelection={data}
        setCurrentAttribute={this.props.setCurrentAttribute}
        setLayerAttributes={this.props.setLayerAttributes}
      />
    )
  }

  render() {
    return (
      <Container
        ref={ref => (this.container = ref)}
        headerProps={{
          title: '属性',
          navigation: this.props.navigation,
        }}
        style={styles.container}
      >
        {this.props.selection && this.props.selection.length > 0 ? (
          this.props.selection.length > 1 ? (
            this.renderTabs()
          ) : (
            this.renderTable({
              data: this.props.selection[0],
              index: 0,
            })
          )
        ) : (
          <View style={{ flex: 1 }} />
        )}
      </Container>
    )
  }
}
