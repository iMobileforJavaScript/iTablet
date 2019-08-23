import React from 'react'
import {
  StyleSheet,
  View,
  Text,
  TouchableOpacity,
  Modal,
  Platform,
  Image,
} from 'react-native'
import { scaleSize } from '../../../utils/screen'
import { getLanguage } from '../../../language/index'
import { getThemeAssets } from '../../../assets'
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
              onPress={() => {
                this.props.addMore(1), this.closeModal()
              }}
              style={styles.itemView}
            >
              <Image
                style={styles.imgStyle}
                source={getThemeAssets().friend.add_contacts}
              />
              <Text style={styles.textStyle}>
                {getLanguage(global.language).Friends.ADD_FRIENDS}

                {/* //添加好友 */}
              </Text>
            </TouchableOpacity>
            <View style={styles.seperator} />
            <TouchableOpacity
              onPress={() => {
                this.props.addMore(2), this.closeModal()
              }}
              style={styles.itemView}
            >
              <Image
                style={styles.imgStyle}
                source={getThemeAssets().friend.new_chat}
              />
              <Text style={styles.textStyle}>
                {getLanguage(global.language).Friends.NEW_GROUP_CHAT}

                {/* // 发起群聊 */}
              </Text>
            </TouchableOpacity>
            <View style={styles.seperator} />
            <TouchableOpacity
              onPress={() => {
                this.props.addMore(3), this.closeModal()
              }}
              style={styles.itemView}
            >
              <Image
                style={styles.imgStyle}
                source={getThemeAssets().friend.friend_mobileCon}
              />
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
    backgroundColor: '#FBFBFB',
    // width: scaleSize(300),
    // height: scaleSize(170),
    position: 'absolute',
    left: scaleSize(25),
    top: Top,
    paddingVertical: scaleSize(5),
    paddingLeft: scaleSize(20),
    paddingRight: scaleSize(40),
    justifyContent: 'center',
    borderRadius: 3,
  },
  itemView: {
    flexDirection: 'row',
    justifyContent: 'flex-start',
    alignItems: 'center',
    flex: 1,
    marginVertical: scaleSize(20),
  },
  textStyle: {
    color: '#505050',
    fontSize: scaleSize(26),
  },
  imgStyle: {
    width: scaleSize(48),
    height: scaleSize(48),
    marginRight: scaleSize(15),
  },
  seperator: {
    height: scaleSize(1),
    marginLeft: scaleSize(63),
    backgroundColor: '#A0A0A0',
  },
})
