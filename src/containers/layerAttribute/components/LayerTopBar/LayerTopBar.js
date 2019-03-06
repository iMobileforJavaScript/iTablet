/*
 Copyright © SuperMap. All rights reserved.
 Author: Yangshanglong
 E-mail: yangshanglong@supermap.com
 */

import * as React from 'react'
import { View, ScrollView } from 'react-native'
import { ImageButton } from '../../../../components'
import { getThemeAssets, getPublicAssets } from '../../../../assets'
import styles from './styles'

export default class LayerTopBar extends React.Component {
  props: {
    locateAction: () => {},
    undoAction: () => {},
    relateAction: () => {},
    tabsAction?: () => {}, // 显示侧滑栏
    canLocated?: boolean, // 是否可点击定位
    canUndo?: boolean, // 是否可点击撤销
    canRelated?: boolean, // 是否可点击关联
    hasTabBtn?: boolean, // 是否可点击关联
  }

  static defaultProps = {
    canLocated: true,
    canUndo: false,
    canRelated: false,
    hasTabBtn: false,
  }

  constructor(props) {
    super(props)
    this.state = {
      attribute: {},
      showTable: false,
    }
  }

  tabsAction = () => {
    if (this.props.tabsAction && typeof this.props.tabsAction === 'function') {
      this.props.tabsAction()
    }
  }

  locateAction = () => {
    if (
      this.props.locateAction &&
      typeof this.props.locateAction === 'function'
    ) {
      this.props.locateAction()
    }
  }

  undoAction = () => {
    if (this.props.undoAction && typeof this.props.undoAction === 'function') {
      this.props.undoAction()
    }
  }

  relateAction = () => {
    if (
      this.props.relateAction &&
      typeof this.props.relateAction === 'function'
    ) {
      this.props.relateAction()
    }
  }

  renderBtn = ({ key, icon, title, action, enabled }) => {
    return (
      <ImageButton
        key={key}
        containerStyle={styles.btn}
        iconBtnStyle={styles.imgBtn}
        titleStyle={enabled ? styles.enableBtnTitle : styles.btnTitle}
        icon={icon}
        title={title}
        direction={'row'}
        onPress={action}
        enabled={enabled}
      />
    )
  }

  renderTabBtn = ({ key, icon, title, action, enabled, style }) => {
    return (
      <ImageButton
        key={key}
        containerStyle={[styles.btn, style]}
        iconBtnStyle={styles.imgBtn}
        titleStyle={styles.btnTitle}
        icon={icon}
        title={title}
        direction={'row'}
        onPress={action}
        enabled={enabled}
      />
    )
  }

  render() {
    return (
      <View style={styles.container}>
        {this.props.hasTabBtn &&
          this.renderTabBtn({
            icon: this.props.canLocated
              ? getThemeAssets().attribute.rightbar_tool_select_layerlist
              : getThemeAssets().attribute.rightbar_tool_select_layerlist,
            key: '标签',
            action: this.tabsAction,
            enabled: this.props.canLocated,
            style: styles.tabBtn,
          })}
        <ScrollView horizontal style={styles.rightList}>
          {this.renderBtn({
            icon: this.props.canLocated
              ? getThemeAssets().attribute.attribute_location
              : getThemeAssets().attribute.attribute_location,
            key: '定位',
            title: '定位',
            action: this.locateAction,
            enabled: this.props.canLocated,
          })}
          {/*{this.renderBtn({*/}
          {/*icon: this.props.canUndo*/}
          {/*? require('../../../../assets/public/icon_upload_selected.png')*/}
          {/*: require('../../../../assets/public/icon_upload_unselected.png'),*/}
          {/*key: '撤销',*/}
          {/*title: '撤销',*/}
          {/*action: this.undoAction,*/}
          {/*enabled: this.props.canUndo,*/}
          {/*})}*/}
          {this.renderBtn({
            icon: this.props.canRelated
              ? getThemeAssets().attribute.icon_attribute_browse
              : getPublicAssets().attribute.icon_attribute_browse,
            key: '关联',
            title: '关联',
            action: this.relateAction,
            enabled: this.props.canRelated,
          })}
        </ScrollView>
      </View>
    )
  }
}
