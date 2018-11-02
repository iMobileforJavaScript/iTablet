/*
 Copyright © SuperMap. All rights reserved.
 Author: Yang Shanglong
 E-mail: yangshanglong@supermap.com
 */
import React, { PureComponent } from 'react'
import { AudioAnalyst } from '../../utils'
import { ConstPath } from '../../constants'
import AudioTopDialog from './AudioTopDialog'
import AudioCenterDialog from './AudioCenterDialog'
import AudioBottomDialog from './AudioBottomDialog'

export default class AudioDialog extends PureComponent {
  props: {
    confirmTitleStyle?: StyleSheet,
    cancelTitleStyle?: StyleSheet,
    audioSavePath?: string,
    activeOpacity?: number,
    data?: Object,
  }

  static defaultProps = {
    audioSavePath: ConstPath.Audio,
    activeOpacity: 0.8,
  }

  constructor(props) {
    super(props)
    this.state = {
      type: 'center',
      visible: false,
      recording: false,
      content: '',
    }
  }

  componentWillUnmount() {
    (async function() {
      try {
        if (!this.state.visible && GLOBAL.SpeechManager) {
          await GLOBAL.SpeechManager.stopListening()
        }
      } catch (e) {
        () => {}
      }
    }.bind(this)())
  }

  //控制Modal框是否可以展示
  setVisible = (visible, type = 'center') => {
    this.setState({
      visible: visible,
      content: !visible ? '' : this.state.content,
      type: type,
      recording: false,
    })
    if (GLOBAL.SpeechManager) {
      (async function() {
        try {
          if (visible) {
            this.startRecording()
          } else {
            await GLOBAL.SpeechManager.stopListening()
          }
        } catch (e) {
          () => {}
        }
      }.bind(this)())
    }
  }

  startRecording = () => {
    if (!GLOBAL.SpeechManager) return
    this.setState({
      content: '',
      recording: true,
    })
    ;(async function() {
      try {
        let path = this.props.audioSavePath + new Date().getTime() + '.wav'
        await GLOBAL.SpeechManager.setAudioPath(path)
        await GLOBAL.SpeechManager.startListening({
          onEndOfSpeech: () => {
            this.setState({
              recording: false,
            })
          },
          onVolumeChanged: () => {},
          onError: () => {
            this.setState({
              recording: false,
            })
          },
          onResult: ({ info, isLast }) => {
            if (isLast) {
              GLOBAL.SpeechManager.stopListening().then(() => {
                AudioAnalyst.analyst(this.state.content, this.props.data)
              })
            } else {
              if (info === this.state.content) return
              this.setState({
                content: info,
                recording: !isLast,
              })
            }
          },
        })
      } catch (e) {
        () => {}
      }
    }.bind(this)())
  }

  stopRecording = () => {
    (async function() {
      try {
        if (GLOBAL.SpeechManager) {
          await GLOBAL.SpeechManager.stopListening()
        }
      } catch (e) {
        () => {}
      }
    }.bind(this)())
  }

  render() {
    if (!this.state.visible || !this.state.type) return null
    let TopDialog = (
      <AudioTopDialog
        ref={ref => (this.topDialog = ref)}
        startRecording={this.startRecording}
        stopRecording={this.stopRecording}
        setVisible={this.setVisible}
        visible={true}
        content={this.state.content}
        recording={this.state.recording}
      />
    )
    let BottomDialog = (
      <AudioBottomDialog
        ref={ref => (this.bottomDialog = ref)}
        startRecording={this.startRecording}
        stopRecording={this.stopRecording}
        setVisible={this.setVisible}
        visible={true}
        content={this.state.content}
        recording={this.state.recording}
      />
    )
    let CenterDialog = (
      <AudioCenterDialog
        ref={ref => (this.centerDialog = ref)}
        startRecording={this.startRecording}
        stopRecording={this.stopRecording}
        setVisible={this.setVisible}
        visible={true}
        content={this.state.content}
        recording={this.state.recording}
      />
    )
    switch (this.state.type) {
      case 'top':
        return TopDialog
      case 'bottom':
        return BottomDialog
      case 'center':
        return CenterDialog
    }
  }
}
