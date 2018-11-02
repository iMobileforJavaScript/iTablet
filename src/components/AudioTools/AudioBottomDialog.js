/*
 Copyright © SuperMap. All rights reserved.
 Author: Yang Shanglong
 E-mail: yangshanglong@supermap.com
 */
import React, { PureComponent } from 'react'
import {
  View,
  ScrollView,
  Text,
  StyleSheet,
  TouchableOpacity,
  Image,
} from 'react-native'
import { scaleSize } from '../../utils'
import { ConstPath } from '../../constants'
import { color, size } from '../../styles'

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    backgroundColor: 'transparent',
    zIndex: 1000,
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    flex: 1,
    flexDirection: 'column',
    justifyContent: 'flex-end',
  },
  dialogStyle: {
    width: '100%',
    backgroundColor: 'white',
    flexDirection: 'column',
    elevation: 20,
    shadowOffset: { width: 0, height: 0 },
    shadowColor: 'black',
    shadowOpacity: 1,
    shadowRadius: 5,
  },
  contentView: {
    padding: scaleSize(20),
    marginHorizontal: scaleSize(30),
    height: scaleSize(200),
    backgroundColor: color.grayLight,
  },
  btns: {
    marginTop: scaleSize(30),
    marginBottom: scaleSize(60),
    marginHorizontal: scaleSize(100),
    height: scaleSize(80),
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  confirmBtnStyle: {
    justifyContent: 'center',
    alignItems: 'center',
    height: scaleSize(60),
    paddingHorizontal: scaleSize(30),
    borderRadius: scaleSize(30),
    backgroundColor: color.blue2,
    minWidth: scaleSize(100),
  },
  cancelBtnStyle: {
    justifyContent: 'center',
    alignItems: 'center',
    height: scaleSize(60),
    paddingHorizontal: scaleSize(30),
    borderRadius: scaleSize(30),
    backgroundColor: color.gray,
    minWidth: scaleSize(120),
  },
  btnTitle: {
    color: 'white',
    fontSize: size.fontSize.fontSizeSm,
    backgroundColor: 'transparent',
    textAlign: 'center',
  },
  audioBtn: {
    marginTop: scaleSize(20),
    height: scaleSize(100),
    width: scaleSize(100),
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'transparent',
    alignSelf: 'flex-end',
  },
  audioImage: {
    height: scaleSize(100),
    width: scaleSize(100),
  },
  closeBtn: {
    height: scaleSize(60),
    width: scaleSize(60),
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'transparent',
  },
  closeImage: {
    height: scaleSize(40),
    width: scaleSize(40),
  },
  content: {
    fontSize: size.fontSize.fontSizeMd,
    backgroundColor: 'transparent',
  },
})

/**
 * 语音框，需要提前初始化SpeechManager
 */
export default class AudioDialog extends PureComponent {
  props: {
    startRecording: () => {},
    stopRecording: () => {},
    setVisible: () => {},
    startAudio: () => {},
    endAudio: () => {},
    confirmAction?: () => {},
    cancelAction?: () => {},
    backHide?: boolean,
    visible?: boolean,
    recording?: boolean,
    activeOpacity?: number,
    textStyle?: any,
    backgroundStyle?: any,
    style?: any,
    btnStyle?: any,
    confirmTitleStyle?: any,
    cancelTitleStyle?: any,
    audioBtnStyle?: any,
    closeBtnStyle?: any,
    title?: string,
    confirmBtnTitle?: string,
    cancelBtnTitle?: string,
    audioSavePath?: string,
    content?: string,
  }

  static defaultProps = {
    label: '',
    content: '',
    activeOpacity: 0.8,
    backHide: true,
    visible: false,
    recording: false,
    confirmBtnTitle: '保存',
    cancelBtnTitle: '清除',
    audioSavePath: ConstPath.Audio,
  }

  constructor(props) {
    super(props)
    this.state = {
      visible: props.visible,
      recording: props.recording,
      content: props.content,
    }
  }

  componentDidUpdate(prevProps) {
    if (
      JSON.stringify(prevProps.recording) !==
      JSON.stringify(this.props.recording)
    ) {
      this.setState({
        recording: this.props.recording,
      })
    }
  }

  setVisible = visible => {
    if (this.props.setVisible) {
      this.props.setVisible()
    } else {
      if (this.state.visible === visible) return
      this.setState({
        visible: visible,
        content: '',
      })
      !visible && this.props.stopRecording && this.props.stopRecording()
    }
  }

  confirm = () => {
    if (this.props.confirmAction) {
      this.props.confirmAction(this.state.content)
    }
  }

  cancel = () => {
    if (this.props.cancelAction) {
      this.props.cancelAction()
    }
    this.setState({
      content: '',
    })
  }

  renderBtns = () => {
    return (
      <View style={styles.btns}>
        <TouchableOpacity
          activeOpacity={this.props.activeOpacity}
          style={[styles.confirmBtnStyle, this.props.btnStyle]}
          onPress={this.confirm}
        >
          <Text style={[styles.btnTitle, this.props.confirmTitleStyle]}>
            {this.props.confirmBtnTitle}
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          activeOpacity={this.props.activeOpacity}
          style={[styles.cancelBtnStyle, this.props.btnStyle]}
          onPress={this.cancel}
        >
          <Text style={[styles.btnTitle, this.props.cancelTitleStyle]}>
            {this.props.cancelBtnTitle}
          </Text>
        </TouchableOpacity>
      </View>
    )
  }

  renderCloseBtn = () => {
    return (
      <TouchableOpacity
        activeOpacity={this.props.activeOpacity}
        style={[styles.closeBtn, this.props.closeBtnStyle]}
        onPress={() => this.setVisible(false)}
      >
        <Image
          resizeMode={'contain'}
          style={styles.closeImage}
          accessible={true}
          accessibilityLabel={'关闭语音'}
          source={require('../../assets/map/icon-arrow-down.png')}
        />
      </TouchableOpacity>
    )
  }

  renderAudioBtn = () => {
    let image = this.state.recording
      ? require('../../assets/public/icon-recording2.png')
      : require('../../assets/public/icon-recording.png')
    return (
      <TouchableOpacity
        activeOpacity={this.props.activeOpacity}
        style={[styles.audioBtn, this.props.audioBtnStyle]}
        onPress={this.props.startRecording}
      >
        <Image
          resizeMode={'contain'}
          style={styles.audioImage}
          accessible={true}
          accessibilityLabel={'语音'}
          source={image}
        />
      </TouchableOpacity>
    )
  }

  render() {
    if (!this.state.visible) return null
    return (
      <View style={[styles.container, this.props.backgroundStyle]}>
        <View style={[styles.dialogStyle, this.props.style]}>
          {this.renderCloseBtn()}
          <ScrollView style={styles.contentView}>
            <Text style={[styles.content, this.props.textStyle]}>
              {this.state.content}
            </Text>
          </ScrollView>
          {this.renderAudioBtn()}
          {this.renderBtns()}
        </View>
      </View>
    )
  }
}
