/*
 Copyright © SuperMap. All rights reserved.
 Author: Yangshanglong
 E-mail: yangshanglong@supermap.com
 */

import * as React from 'react'
import { View } from 'react-native'
import { ImageButton } from '../../../../components'
import styles from './styles'

export default class LayerTopBar extends React.Component {
  props: {
    locateAction: () => {},
    undoAction: () => {},
    relateAction: () => {},
    canLocated?: boolean, // 是否可点击定位
    canUndo?: boolean, // 是否可点击撤销
    canRelated?: boolean, // 是否可点击关联
  }

  static defaultProps = {
    canLocated: true,
    canUndo: false,
    canRelated: false,
  }

  constructor(props) {
    super(props)
    this.state = {
      attribute: {},
      showTable: false,
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

  renderBtn = ({ icon, title, action, enabled }) => {
    return (
      <ImageButton
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
        {this.renderBtn({
          icon: this.props.canLocated
            ? require('../../../../assets/public/icon_upload_selected.png')
            : require('../../../../assets/public/icon_upload_unselected.png'),
          title: '定位',
          action: this.locateAction,
          enabled: this.props.canLocated,
        })}
        {this.renderBtn({
          icon: this.props.canUndo
            ? require('../../../../assets/public/icon_upload_selected.png')
            : require('../../../../assets/public/icon_upload_unselected.png'),
          title: '撤销',
          action: this.undoAction,
          enabled: this.props.canUndo,
        })}
        {this.renderBtn({
          icon: this.props.canRelated
            ? require('../../../../assets/public/icon_upload_selected.png')
            : require('../../../../assets/public/icon_upload_unselected.png'),
          title: '关联',
          action: this.relateAction,
          enabled: this.props.canRelated,
        })}
      </View>
    )
  }
}
