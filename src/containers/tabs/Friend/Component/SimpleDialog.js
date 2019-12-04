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
    renderExtra: () => {},
    style: Object,
    text: String,
    disableBackTouch: boolean,
  }

  constructor(props) {
    super(props)
    this.state = {
      visible: false,
      confirmAction: this.confirm,
      cancelAction: this.cancel,
      text: this.props.text,
      renderExtra: props.renderExtra,
      dialogHeight: undefined,
    }
  }

  setVisible(visible) {
    this.Dialog.setDialogVisible(visible)
  }

  set = ({ text, confirmAction, cancelAction, renderExtra, dialogHeight }) => {
    let confirm, cancel
    if (confirmAction && typeof confirmAction === 'function') {
      confirm = () => {
        this.setVisible(false)
        confirmAction()
      }
    }
    if (cancelAction && typeof cancelAction === 'function') {
      cancel = () => {
        this.setVisible(false)
        cancelAction()
      }
    }
    this.setState({
      text: text || this.props.text,
      confirmAction: confirmAction ? confirm || this.confirm : this.confirm,
      cancelAction: cancelAction ? cancel || this.cancel : this.cancel,
      renderExtra: renderExtra,
      dialogHeight: dialogHeight,
    })
  }

  reset = () => {
    this.setState({
      text: this.props.text,
      confirmAction: this.confirm,
      cancelAction: this.cancel,
      renderExtra: undefined,
      dialogHeight: undefined,
    })
  }

  setConfirm = action => {
    if (action && typeof action === 'function') {
      this.setState({
        confirmAction: () => {
          this.setVisible(false)
          action()
        },
      })
    }
  }

  setCancel = action => {
    if (action && typeof action === 'function') {
      this.setState({
        cancelAction: () => {
          this.setVisible(false)
          action()
        },
      })
    }
  }

  setText = text => {
    this.setState({ text: text })
  }

  setExtra = renderExtra => {
    this.setState({ renderExtra: renderExtra })
  }

  setDialogHeight = height => {
    this.setState({ dialogHeight: height })
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
        style={[
          styles.dialogBackground,
          this.props.style,
          this.state.dialogHeight && { height: this.state.dialogHeight },
        ]}
        disableBackTouch={this.props.disableBackTouch}
      >
        <View style={styles.dialogHeaderView}>
          <Image
            source={require('../../../../assets/home/Frenchgrey/icon_prompt.png')}
            style={styles.dialogHeaderImg}
          />
          <Text style={styles.promptTtile}>{this.state.text}</Text>
          {this.state.renderExtra}
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
    paddingTop: scaleSize(10),
    width: scaleSize(80),
    height: scaleSize(80),
    opacity: 1,
  },
  promptTtile: {
    fontSize: scaleSize(24),
    color: color.theme_white,
    marginTop: scaleSize(5),
    marginLeft: scaleSize(20),
    textAlign: 'center',
  },
  dialogBackground: {
    height: scaleSize(240),
    // borderRadius: scaleSize(4),
    // backgroundColor: 'white',
  },
  opacityView: {
    height: scaleSize(240),
    // borderRadius: scaleSize(4),
    // backgroundColor: 'white',
  },
})
