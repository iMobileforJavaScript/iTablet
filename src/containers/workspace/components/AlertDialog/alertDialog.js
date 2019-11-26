import * as React from 'react'
import {
  View,
  Text,
  StyleSheet,
  Modal,
  TouchableOpacity,
  FlatList,
} from 'react-native'
import { color, size } from '../../../../styles'
import { scaleSize } from '../../../../utils'

export default class AlertDialog extends React.Component {
  props: {
    btnStyle: StyleSheet,
    btnTitleStyle: StyleSheet,
    childrens: any,
    Alerttitle: string,
    backHide: any,
  }

  constructor(props) {
    super(props)
    this.state = {
      visible: false,
    }
  }

  setDialogVisible(visible) {
    visible !== this.state.visible && this.setState({ visible: visible })
  }

  renderItem({ item }) {
    return (
      <TouchableOpacity
        activeOpacity={0.8}
        style={styles.btn}
        onPress={item.action}
      >
        <Text style={styles.btnTitle}>{item.btnTitle}</Text>
      </TouchableOpacity>
    )
  }
  itemSeparator = () => {
    return <View style={styles.itemSeparator} />
  }
  render() {
    return (
      <Modal
        animationType="none"
        transparent={true}
        visible={this.state.visible}
        onRequestClose={() => {
          //点击物理按键需要隐藏对话框
          if (this.props.backHide) {
            this.setDialogVisible(false)
          }
        }}
      >
        <View style={styles.mainTitle}>
          <View style={styles.dialogStyle}>
            <Text style={styles.alertTitle}>{this.props.Alerttitle}</Text>
            <FlatList
              ItemSeparatorComponent={this.itemSeparator}
              style={styles.container}
              data={this.props.childrens}
              renderItem={this.renderItem}
            />
          </View>
        </View>
      </Modal>
    )
  }
}

const styles = StyleSheet.create({
  mainTitle: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.75)',
  },
  dialogStyle: {
    width: '50%',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: scaleSize(16),
    backgroundColor: color.white,
    paddingVertical: scaleSize(30),
  },
  alertTitle: {
    fontSize: size.fontSize.fontSizeLg,
    backgroundColor: 'transparent',
    marginVertical: scaleSize(15),
    textAlign: 'center',
    color: color.title,
  },
  btnTitle: {
    color: 'white',
    fontSize: size.fontSize.fontSizeSm,
    backgroundColor: 'transparent',
    textAlign: 'center',
  },
  btn: {
    justifyContent: 'center',
    alignItems: 'center',
    height: scaleSize(60),
    paddingHorizontal: scaleSize(30),
    borderRadius: scaleSize(30),
    backgroundColor: color.blue2,
    minWidth: scaleSize(100),
    width: scaleSize(300),
  },
  itemSeparator: {
    height: scaleSize(10),
    backgroundColor: 'transparent',
  },
})
