/**
 * 多媒体预览界面
 */
import * as React from 'react'
import { View, Modal, Platform } from 'react-native'
import { checkType } from '../../utils'
import Swiper from 'react-native-swiper' // eslint-disable-line
import styles from './styles'
import VideoViewer from './VideoViewer'
import ImageViewer from './ImageViewer'

export default class MediaPager extends React.Component {
  props: {
    data: Array,
    isModal: boolean,
    withBackBtn: boolean,
    backHide?: boolean,
    defaultIndex: number,
  }

  static defaultProps = {
    isModal: false,
    withBackBtn: false,
    defaultIndex: 0,
    data: [],
    backHide: true,
  }

  constructor(props) {
    super(props)

    this.state = {
      defaultIndex: props.defaultIndex,
      visible: false,
    }
    this.dataRef = []
  }

  shouldComponentUpdate(nextProps, nextState) {
    let shouldUpdate =
      JSON.stringify(this.props) !== JSON.stringify(nextProps) ||
      JSON.stringify(this.state) !== JSON.stringify(nextState)
    if (shouldUpdate) this.dataRef = []
    return shouldUpdate
  }

  setVisible = (visible = !this.state.visible, index = 0) => {
    let newState = {}
    if (visible !== this.state.visible) {
      newState.visible = visible
    }
    if (index !== this.state.defaultIndex) {
      newState.defaultIndex = index
    }
    if (Object.keys(newState).length > 0) {
      this.setState(newState, () => {
        visible && this.forceUpdate()
      })
    }
  }

  getData = () => {
    let data = []
    this.dataRef = []
    for (let i = 0; i < this.props.data.length; i++) {
      let item = this.props.data[i]
      const type = checkType.getMediaTypeByPath(item.uri)
      let uri = item.uri
      if (
        Platform.OS === 'android' &&
        uri.toLowerCase().indexOf('content://') !== 0
      ) {
        uri = 'file://' + uri
      }
      if (type === 'video') {
        data.push(
          <VideoViewer
            ref={ref => (this.dataRef[i] = ref)}
            key={uri}
            uri={uri}
            withBackBtn={this.props.withBackBtn}
            backAction={() => this.setVisible(false)}
          />,
        )
      } else {
        // data.push(
        //   <Image style={{flex: 1}} source={{uri: uri}} />
        // )
        data.push(
          <ImageViewer
            ref={ref => (this.dataRef[i] = ref)}
            key={uri}
            uri={uri}
            // containerStyle={this.props.containerStyle}
            backAction={() => this.setVisible(false)}
          />,
        )
      }
    }
    return data
  }

  renderContent = () => {
    return (
      <Swiper
        // eslint-disable-next-line
        onScrollBeginDrag={(e, state, context) => {
          const type = checkType.getMediaTypeByPath(
            this.props.data[state.index].uri,
          )
          if (type === 'video') {
            this.dataRef[state.index] && this.dataRef[state.index].pause()
          }
        }}
        dot={<View style={styles.dot} />}
        activeDot={<View style={styles.activeDot} />}
        // paginationStyle={styles.paginationStyle}
        index={this.state.defaultIndex}
        loop={false}
        // showsButtons={this.props.data.length > 1}
        // prevButton={
        //   <View style={styles.arrowView}>
        //     <Image
        //       style={styles.arrowImg}
        //       source={getPublicAssets().common.icon_back}
        //     />
        //   </View>
        // }
        // nextButton={
        //   <View style={styles.arrowView}>
        //     <Image
        //       style={styles.arrowImg}
        //       source={getPublicAssets().common.icon_next}
        //     />
        //   </View>
        // }
      >
        {this.getData()}
      </Swiper>
    )
  }

  render() {
    if (this.props.data.length === 0 || !this.state.visible) return null

    if (this.props.isModal) {
      return (
        <Modal
          visible={this.state.visible}
          transparent={true}
          onRequestClose={() => {
            //点击物理按键需要隐藏对话框
            if (this.props.backHide) {
              this.setVisible(false)
            }
          }}
        >
          {this.renderContent()}
        </Modal>
      )
    }
    return this.renderContent()
  }
}
