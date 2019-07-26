import React, { PureComponent } from 'react'
import { StyleSheet, View } from 'react-native'
import { color, size } from '../../../../styles'
import { scaleSize } from '../../../../utils'
import { Button, PopView } from '../../../../components'

import { getLanguage } from '../../../../language/index'

const styles = StyleSheet.create({
  topContainer: {
    flex: 1,
    flexDirection: 'column',
    backgroundColor: color.contentColorWhite,
  },
  item: {
    backgroundColor: color.contentColorWhite,
    height: scaleSize(80),
    borderRadius: 0,
    alignItems: 'center',
    justifyContent: 'center',
  },
  separator: {
    // flex: 1,
    marginHorizontal: 0,
    height: 1,
    backgroundColor: color.separateColorGray,
  },
  title: {
    // fontSize: size.fontSize.fontSizeLg,
    fontSize: size.fontSize.fontSizeSm,
    color: color.bgG,
  },
  btnTitle: {
    // fontSize: size.fontSize.fontSizeLg,
    fontSize: size.fontSize.fontSizeXl,
    color: color.contentColorBlack,
  },
})

export default class MyDataPopupModal extends PureComponent {
  props: {
    hasCancel: boolean,
    modalVisible: boolean,
    data: Object,
  }

  static defaultProps = {
    hasCancel: true,
    modalVisible: false,
    data: [],
  }

  constructor(props) {
    super(props)
    this.height = props.data
      ? (props.data.length + 1) * scaleSize(80)
      : scaleSize(80)
  }

  setVisible = visible => {
    this.PopView && this.PopView.setVisible(visible)
  }

  _renderSeparatorLine = info => {
    let key = info
      ? 'separator_' + info.item.title + '_' + info.index
      : new Date().getTime()
    return <View key={key} style={styles.separator} />
  }

  _renderList = () => {
    let list = []
    this.props.data.forEach((item, index) => {
      list.push(this._renderBtn(item))
      if (index < this.props.data.length - 1) {
        list.push(this._renderSeparatorLine({ item, index }))
      }
    })
    return <View style={styles.topContainer}>{list}</View>
  }

  _renderCancelBtn = () => {
    return (
      <Button
        style={styles.item}
        titleStyle={styles.btnTitle}
        title={getLanguage(global.language).Prompt.CANCEL}
        // {'取消'}
        key={'取消'}
        onPress={() => {
          this.setVisible(false)
        }}
        activeOpacity={0.5}
      />
    )
  }

  _renderBtn = item => {
    return (
      <Button
        style={styles.item}
        titleStyle={styles.btnTitle}
        title={item.title}
        key={item.title}
        onPress={() => {
          item.action && item.action()
          this.setVisible(false)
        }}
        activeOpacity={0.5}
      />
    )
  }

  render() {
    return (
      <PopView ref={ref => (this.PopView = ref)}>
        <View
          style={{
            width: '100%',
            height: this.height,
            backgroundColor: color.contentColorWhite,
          }}
        >
          {this._renderList()}
          {this._renderSeparatorLine()}
          {this.props.hasCancel && this._renderCancelBtn()}
        </View>
      </PopView>
    )
  }
}
