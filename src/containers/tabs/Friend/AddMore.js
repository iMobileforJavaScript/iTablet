import React from 'react'
import {
  StyleSheet,
  View,
  Text,
  TouchableOpacity,
  Modal,
  Platform,
} from 'react-native'
import { scaleSize } from '../../../utils/screen'
import { getLanguage } from '../../../language/index'
let Top = scaleSize(88)
if (Platform.OS === 'ios') {
  Top += 20
}
// const deviceH = Dimensions.get('window').height
// const deviceW = Dimensions.get('window').width

// const basePx = 375

// function px2dp(px) {
//   return (px * deviceW) / basePx
// }

// const { width, height } = Dimensions.get('window')

export default class AddMore extends React.Component {
  props: {
    show: Boolean,
    closeModal: () => {},
    addMore: () => {},
  }
  constructor(props) {
    super(props)
    this.state = {
      isVisible: this.props.show,
    }
  }

  // eslint-disable-next-line
  componentWillReceiveProps(nextProps) {
    this.setState({ isVisible: nextProps.show })
  }

  // shouldComponentUpdate(prevProps, prevState) {
  //   if (
  //     JSON.stringify(prevProps.user) !== JSON.stringify(this.props.user) ||
  //     JSON.stringify(prevState) !== JSON.stringify(this.state)
  //   ) {
  //     return true
  //   }
  //   return false
  // }
  // show = ()=>{
  //   this.setState({
  //     isVisible: true
  //   });
  //
  // }

  closeModal() {
    this.setState({
      isVisible: false,
    })
    this.props.closeModal(false)
  }

  scan() {
    // this.props.navigator.push({
    //   component: QRScanPage,
    // })
  }

  render() {
    return (
      <Modal
        transparent={true}
        visible={this.state.isVisible}
        animationType={'fade'}
        onRequestClose={() => this.closeModal()}
      >
        <View style={{ flex: 1 }}>
          <TouchableOpacity
            style={styles.overlay}
            activeOpacity={1}
            onPress={() => this.closeModal()}
          />

          <View style={styles.modal}>
            <TouchableOpacity
              activeOpacity={1}
              onPress={() => {
                this.props.addMore(1), this.closeModal()
              }}
              style={styles.itemView}
            >
              <Text style={styles.textStyle}>
                {getLanguage(global.language).Friends.ADD_FRIENDS}

                {/* //添加好友 */}
              </Text>
            </TouchableOpacity>
            <View style={styles.seperator} />
            <TouchableOpacity
              activeOpacity={1}
              onPress={() => {
                this.props.addMore(2), this.closeModal()
              }}
              style={styles.itemView}
            >
              <Text style={styles.textStyle}>
                {getLanguage(global.language).Friends.NEW_GROUP_CHAT}

                {/* // 发起群聊 */}
              </Text>
            </TouchableOpacity>
            <View style={styles.seperator} />
            <TouchableOpacity
              activeOpacity={1}
              onPress={() => {
                this.props.addMore(3), this.closeModal()
              }}
              style={styles.itemView}
            >
              <Text style={styles.textStyle}>
                {getLanguage(global.language).Friends.RECOMMEND_FRIEND}
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    )
  }
}
const styles = StyleSheet.create({
  overlay: {
    position: 'absolute',
    top: 0,
    right: 0,
    bottom: 0,
    left: 0,
    backgroundColor: '#rgba(0,0,0,0)',
  },
  modal: {
    backgroundColor: '#505050',
    // width: scaleSize(300),
    // height: scaleSize(170),
    position: 'absolute',
    left: scaleSize(25),
    top: Top,
    padding: scaleSize(5),
    paddingLeft: scaleSize(20),
    justifyContent: 'center',
    // alignItems: 'flex-start',
    borderRadius: 3,
  },
  itemView: {
    flexDirection: 'row',
    justifyContent: 'flex-start',
    alignItems: 'flex-start',
    flex: 1,
    marginTop: scaleSize(15),
    marginBottom: scaleSize(15),
    marginLeft: scaleSize(10),
    marginRight: scaleSize(20),
  },
  textStyle: {
    color: '#fff',
    fontSize: scaleSize(24),
  },
  imgStyle: {
    width: 20,
    height: 20,
  },
  seperator: {
    height: scaleSize(1),
    marginLeft: scaleSize(10),
    marginRight: scaleSize(20),
    backgroundColor: '#A0A0A0',
  },
})
