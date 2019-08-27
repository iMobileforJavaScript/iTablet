import React, { PureComponent } from 'react'
import { View, Text, Image, StyleSheet } from 'react-native'
import { Dialog } from '../../../../components'
import { scaleSize } from '../../../../utils/screen'
import { color } from '../../../../styles'
import { getLanguage } from '../../../../language/index'

export default class SimpleDialog extends PureComponent {
  props: {
    confirmAction: () => {},
    cancelAction: () => {},
    text: String,
  }

  constructor(props) {
    super(props)
    this.state = {
      visible: false,
      confirmAction: this.confirm,
      cancelAction: this.cancel,
      text: this.props.text,
    }
  }

  setVisible(visible) {
    this.Dialog.setDialogVisible(visible)
  }

  setConfirm = action => {
    if (action && typeof action === 'function') {
      this.setState({ confirmAction: action })
    }
  }

  setCancel = action => {
    if (action && typeof action === 'function') {
      this.setState({ cancelAction: action })
    }
  }

  setText = text => {
    this.setState({ text: text })
  }

  confirm = () => {
    this.props.confirmAction && this.props.confirmAction()
    this.setVisible(false)
  }

  cancel = () => {
    this.props.cancelAction && this.props.cancelAction()
    this.setVisible(false)
  }

  render() {
    return (
      <Dialog
        ref={ref => (this.Dialog = ref)}
        type={'modal'}
        confirmBtnTitle={getLanguage(global.language).Friends.CONFIRM}
        cancelBtnTitle={getLanguage(global.language).Friends.CANCEL}
        confirmAction={this.state.confirmAction}
        cancelAction={this.state.cancelAction}
        opacity={1}
        opacityStyle={styles.opacityView}
        style={styles.dialogBackground}
      >
        <View style={styles.dialogHeaderView}>
          <Image
            source={require('../../../../assets/home/Frenchgrey/icon_prompt.png')}
            style={styles.dialogHeaderImg}
          />
          <Text style={styles.promptTtile}>{this.state.text}</Text>
        </View>
      </Dialog>
    )
  }
}

const styles = StyleSheet.create({
  dialogHeaderView: {
    flex: 1,
    flexDirection: 'column',
    alignItems: 'center',
  },
  dialogHeaderImg: {
    width: scaleSize(60),
    height: scaleSize(60),
    opacity: 1,
  },
  promptTtile: {
    fontSize: scaleSize(24),
    color: color.theme_white,
    marginTop: scaleSize(5),
    marginLeft: scaleSize(10),
    marginRight: scaleSize(10),
    textAlign: 'center',
  },
  dialogBackground: {
    width: scaleSize(350),
    height: scaleSize(240),
    // borderRadius: scaleSize(4),
    // backgroundColor: 'white',
  },
  opacityView: {
    width: scaleSize(350),
    height: scaleSize(240),
    // borderRadius: scaleSize(4),
    // backgroundColor: 'white',
  },
})
