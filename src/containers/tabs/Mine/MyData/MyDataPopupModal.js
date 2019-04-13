import React, { PureComponent } from 'react'
import {
  Modal,
  Platform,
  TouchableOpacity,
  StyleSheet,
  View,
} from 'react-native'
import { color, size } from '../../../../styles'
import { scaleSize } from '../../../../utils'
import { Button } from '../../../../components'

import { language,getLanguage } from '../../../../language/index'

const styles = StyleSheet.create({
  topContainer: {
    flexDirection: 'column',
    backgroundColor: color.contentColorWhite,
  },
  item: {
    flex: 1,
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
    onCloseModal: () => {},
    data: Object,
  }

  static defaultProps = {
    hasCancel: true,
    modalVisible: false,
    data: [],
  }

  constructor(props) {
    super(props)
  }

  _onRequestClose = () => {
    if (Platform.OS === 'android') {
      this._onCloseModal()
    }
  }

  _onCloseModal = () => {
    this.props.onCloseModal && this.props.onCloseModal()
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
          this._onCloseModal()
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
        }}
        activeOpacity={0.5}
      />
    )
  }

  render() {
    // let animationType = Platform.OS === 'ios' ? 'slide' : 'fade'
    let animationType = 'fade'
    return (
      <Modal
        animationType={animationType}
        transparent={true}
        onRequestClose={this._onRequestClose}
        supportedOrientations={[
          'portrait',
          'portrait-upside-down',
          'landscape',
          'landscape-left',
          'landscape-right',
        ]}
        style={{ flex: 1 }}
        visible={this.props.modalVisible}
      >
        <TouchableOpacity
          activeOpacity={1}
          onPress={() => {
            this._onCloseModal()
          }}
          style={{ flex: 1, backgroundColor: color.modalBgColor }}
        >
          <View
            style={{
              flex: 1,
              position: 'absolute',
              bottom: 0,
              left: 0,
              right: 0,
            }}
          >
            {this._renderList()}
            {this._renderSeparatorLine()}
            {this.props.hasCancel && this._renderCancelBtn()}
          </View>
        </TouchableOpacity>
      </Modal>
    )
  }
}
