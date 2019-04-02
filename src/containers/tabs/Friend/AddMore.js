import React from 'react'
import { StyleSheet, View, Text, TouchableOpacity, Modal } from 'react-native'
import { Platform } from 'react-native'
import { scaleSize } from '../../../utils/screen'

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
              <Text style={styles.textStyle}>添加好友</Text>
            </TouchableOpacity>

            <TouchableOpacity
              activeOpacity={1}
              onPress={() => {
                this.props.addMore(2), this.closeModal()
              }}
              style={styles.itemView}
            >
              <Text style={styles.textStyle}>发起群聊</Text>
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
    backgroundColor: '#696969',
    width: scaleSize(150),
    height: scaleSize(170),
    position: 'absolute',
    left: scaleSize(25),
    top: Top,
    padding: scaleSize(5),
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 3,
  },
  itemView: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    flex: 1,
  },
  textStyle: {
    color: '#fff',
    fontSize: scaleSize(25),
    marginLeft: scaleSize(6),
  },
  imgStyle: {
    width: 20,
    height: 20,
  },
})
