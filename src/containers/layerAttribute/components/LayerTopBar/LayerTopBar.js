/*
 Copyright © SuperMap. All rights reserved.
 Author: Yangshanglong
 E-mail: yangshanglong@supermap.com
 */

import * as React from 'react'
import { View } from 'react-native'
import { ImageButton } from '../../../../components'
import { getThemeAssets, getPublicAssets } from '../../../../assets'
import styles from './styles'
import { getLanguage } from '../../../../language/index'
import NavigationService from '../../../NavigationService'

export default class LayerTopBar extends React.Component {
  props: {
    locateAction: () => {},
    undoAction: () => {},
    relateAction: () => {},
    addFieldAction: () => {},
    tabsAction?: () => {}, // 显示侧滑栏
    attributesData: Array,
    canTabs?: boolean, // 是否可点击切换标签
    canLocated?: boolean, // 是否可点击定位
    canUndo?: boolean, // 是否可点击撤销
    canRelated?: boolean, // 是否可点击关联
    hasTabBtn?: boolean, // 是否可点击关联
    canAddField?: boolean, // 是否可点击添加属性
  }

  static defaultProps = {
    canTabs: true,
    canLocated: true,
    canUndo: false,
    canRelated: false,
    canAddField: false,
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

  addAttributeFieldAction = feildInfo => {
    if (
      this.props.addFieldAction &&
      typeof this.props.addFieldAction === 'function'
    ) {
      this.props.addFieldAction(feildInfo)
    }
  }

  renderBtn = ({ key, icon, title, action, enabled }) => {
    return (
      <ImageButton
        key={key}
        containerStyle={[styles.btn, { flex: 1 }]}
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
            icon: this.props.canTabs
              ? getThemeAssets().attribute.rightbar_tool_select_layerlist
              : getThemeAssets().attribute.rightbar_tool_select_layerlist,
            key: '标签',
            action: this.tabsAction,
            enabled: this.props.canTabs,
            style: styles.tabBtn,
          })}
        {/*<ScrollView horizontal style={styles.rightList}>*/}
        <View style={styles.rightList}>
          {this.renderBtn({
            icon: this.props.canAddField
              ? getPublicAssets().common.icon_plus
              : getPublicAssets().common.icon_plus_gray,
            key: '添加',
            title: getLanguage(global.language).Map_Attribute
              .ATTRIBUTE_FIELD_ADD,
            //'添加',
            action: () => {
              NavigationService.navigate('LayerAttributeAdd', {
                defaultParams:
                  this.props.attributesData.length > 1 &&
                  this.props.attributesData[
                    this.props.attributesData.length - 1
                  ],
                callBack: this.addAttributeFieldAction,
              })
            },
            enabled: this.props.canAddField,
          })}
          {this.renderBtn({
            icon: this.props.canLocated
              ? getThemeAssets().attribute.attribute_location
              : getThemeAssets().attribute.attribute_location,
            key: '定位',
            title: getLanguage(global.language).Map_Attribute
              .ATTRIBUTE_LOCATION,
            //'定位',
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
            title: getLanguage(global.language).Map_Attribute
              .ATTRIBUTE_ASSOCIATION,
            //'关联',
            action: this.relateAction,
            enabled: this.props.canRelated,
          })}
        </View>
      </View>
    )
  }
}
