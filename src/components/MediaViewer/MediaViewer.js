/**
 * 多媒体预览界面
 */
import * as React from 'react'
import { Modal } from 'react-native'
import { checkType } from '../../utils'
import VideoViewer from './VideoViewer'
import ImageViewer from './ImageViewer'

import styles from './styles'

export default class MediaViewer extends React.Component {
  props: {
    uri: Object,
    // type: string,
    isModal: boolean,
    containerStyle: any,
    withBackBtn: boolean,
  }

  static defaultProps = {
    isModal: false,
    withBackBtn: false,
    containerStyle: styles.container,
  }

  constructor(props) {
    super(props)

    this.state = {
      uri: props.uri || '',
      visible: false,
    }
  }

  shouldComponentUpdate(nextProps, nextState) {
    return (
      JSON.stringify(this.props) !== JSON.stringify(nextProps) ||
      JSON.stringify(this.state) !== JSON.stringify(nextState)
    )
  }

  // componentDidUpdate(prevProps, prevState) {
  //   if (this.state.uri !== prevState.uri) {
  //     this.forceUpdate()
  //   }
  // }

  setVisible = (visible = !this.state.visible, uri = '') => {
    let newState = {}
    if (visible !== this.state.visible) {
      newState.visible = visible
    }
    if (uri !== this.state.uri) {
      let type = checkType.getMediaTypeByPath(uri)
      if (this.state.type !== type) {
        newState.type = type
      }
      newState.uri = uri
    }
    if (Object.keys(newState).length > 0) {
      this.setState(newState, () => {
        visible && this.forceUpdate()
      })
    }
  }

  renderContent = () => {
    const type = checkType.getMediaTypeByPath(this.state.uri)
    if (type === 'video') {
      return (
        <VideoViewer
          uri={this.state.uri}
          withBackBtn={this.props.withBackBtn}
          backAction={() => this.setVisible(false)}
        />
      )
    } else {
      return (
        <ImageViewer
          uri={this.state.uri}
          containerStyle={this.props.containerStyle}
          backAction={() => this.setVisible(false)}
        />
      )
    }
  }

  render() {
    if (!this.state.uri || !this.state.visible) return null

    if (this.props.isModal) {
      return (
        <Modal visible={this.state.visible} transparent={true}>
          {this.renderContent()}
        </Modal>
      )
    }
    return this.renderContent()
  }
}
