/*
 Copyright © SuperMap. All rights reserved.
 Author: Yang Shanglong
 E-mail: yangshanglong@supermap.com
 */
import React, { PureComponent } from 'react'
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Image,
} from 'react-native'
import { scaleSize } from '../../utils'
import { size } from '../../styles'
import { ConstPath } from '../../constants'

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    backgroundColor: 'transparent',
    zIndex: 1000,
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    justifyContent: 'center',
    alignItems: 'center',
  },
  overlay: {
    flex: 1,
    backgroundColor: 'transparent',
    width: '100%',
    height: '100%',
  },
  dialogStyle: {
    position: 'absolute',
    borderRadius: scaleSize(20),
    height: scaleSize(400),
    width: '80%',
    backgroundColor: 'white',
    flexDirection: 'column',
    elevation: 20,
    shadowOffset: { width: 0, height: 0 },
    shadowColor: 'black',
    shadowOpacity: 1,
    shadowRadius: 5,
    justifyContent: 'center',
    alignItems: 'center',
  },
  contentView: {
    flex: 1,
    padding: scaleSize(20),
    borderRadius: scaleSize(20),
    height: scaleSize(200),
    width: '100%',
    backgroundColor: 'transparent',
  },
  content: {
    fontSize: size.fontSize.fontSizeMd,
    backgroundColor: 'transparent',
  },
  closeBtn: {
    height: scaleSize(60),
    width: scaleSize(60),
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'transparent',
    alignSelf: 'flex-end',
  },
  closeImage: {
    height: scaleSize(40),
    width: scaleSize(40),
  },
  audioBtn: {
    marginTop: scaleSize(20),
    height: scaleSize(100),
    width: scaleSize(100),
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'transparent',
  },
  audioImage: {
    height: scaleSize(100),
    width: scaleSize(100),
  },
})

export default class AudioCenterDialog extends PureComponent {
  props: {
    startRecording: () => {},
    stopRecording: () => {},
    setVisible: () => {},
    confirmTitleStyle?: StyleSheet,
    cancelTitleStyle?: StyleSheet,
    audioSavePath?: string,
    content?: string,
    activeOpacity?: number,
    visible?: boolean,
    recording?: boolean,
  }

  static defaultProps = {
    audioSavePath: ConstPath.Audio,
    activeOpacity: 0.8,
    visible: false,
    recording: false,
    content: '',
  }

  constructor(props) {
    super(props)
    this.state = {
      visible: props.visible,
      content: props.content,
      recording: props.recording,
    }
    this.content = ''
  }

  componentDidUpdate(prevProps) {
    if (
      prevProps.content !== this.props.content ||
      prevProps.recording !== this.props.recording
    ) {
      this.setState({
        content: this.props.content,
        recording: this.props.recording,
      })
    }
  }

  //控制Modal框是否可以展示
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

  renderAudioBtn = () => {
    let image = this.state.recording
      ? require('../../assets/public/icon-recording.png')
      : require('../../assets/public/icon-audio.png')
    return (
      <TouchableOpacity
        activeOpacity={this.props.activeOpacity}
        style={styles.audioBtn}
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

  renderCloseBtn = () => {
    return (
      <TouchableOpacity
        activeOpacity={this.props.activeOpacity}
        style={styles.closeBtn}
        onPress={() => this.setVisible(false)}
      >
        <Image
          resizeMode={'contain'}
          style={styles.closeImage}
          accessible={true}
          accessibilityLabel={'语音'}
          source={require('../../assets/public/close.png')}
        />
      </TouchableOpacity>
    )
  }

  render() {
    if (!this.state.visible) return null
    return (
      <View style={styles.container}>
        <TouchableOpacity
          activeOpacity={1}
          style={styles.overlay}
          onPress={() => {
            this.setVisible(false)
          }}
        />
        <View style={styles.dialogStyle}>
          {this.renderCloseBtn()}
          <ScrollView style={styles.contentView}>
            <Text style={styles.content}>{this.state.content}</Text>
          </ScrollView>
          {this.renderAudioBtn()}
        </View>
      </View>
    )
  }
}
