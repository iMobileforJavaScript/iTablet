import * as React from 'react'
import {
  View,
  Text,
  StyleSheet,
  Modal,
  TouchableOpacity,
  FlatList,
} from 'react-native'
import { size } from '../../../../styles'
import { scaleSize } from '../../../../utils'
export default class MenuAlertDialog extends React.Component {
  props: {
    btnStyle: StyleSheet,
    btnTitleStyle: StyleSheet,
    backHide: any,
    existFullMap: () => {},
    showFullMap: () => {},
    getToolBarRef: () => {},
  }

  constructor(props) {
    super(props)
    this.state = {
      type: '',
      childrens: [],
      visible: false,
      selectedMenu: '',
    }
  }

  getData = () => {
    let data
    return data
  }

  showMenuDialog = () => {
    let data = this.getData()
    this.setState({
      visible: true,
      childrens: data,
    })
  }

  setMenuType = menuType => {
    this.setState({
      type: menuType,
      selectedMenu: '',
    })
  }

  setSelectedMenu(menu) {
    this.setState({
      selectedMenu: menu,
    })
  }

  setDialogVisible(visible) {
    visible !== this.state.visible && this.setState({ visible: visible })
    // if (visible) {
    //   this.props.showFullMap && this.props.showFullMap(true)
    // } else {
    //   this.props.showFullMap && this.props.showFullMap(false)
    // }
  }

  _onClose = () => {
    this.setState({ visible: false })
    // this.props.showFullMap && this.props.showFullMap(false)
  }

  renderItem(item) {
    if (this.state.selectedMenu === item.key) {
      return (
        <TouchableOpacity
          style={styles.selectedbtn}
          activeOpacity={0.5}
          onPress={item.action}
        >
          <Text style={styles.btnTitle}>{item.btnTitle}</Text>
        </TouchableOpacity>
      )
    } else {
      return (
        <TouchableOpacity
          style={styles.btn}
          // activeOpacity={0.5}
          onPress={item.action}
        >
          <Text style={styles.btnTitle}>{item.btnTitle}</Text>
        </TouchableOpacity>
      )
    }
  }
  itemSeparator = () => {
    return <View style={styles.itemSeparator} />
  }
  render() {
    if (this.state.childrens.length === 0) return null
    if (this.state.type === '') return null
    let modalBackgroundStyle = {
      backgroundColor: 'rgba(105, 105, 105, 0.3)',
    }
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
        <View style={[styles.container, modalBackgroundStyle]}>
          <TouchableOpacity
            activeOpacity={0.9}
            style={{ flex: 1 }}
            onPress={this._onClose}
          >
            <View style={styles.mainTitle}>
              <View style={styles.dialogStyle}>
                <FlatList
                  data={this.state.childrens}
                  renderItem={({ item }) => this.renderItem(item)}
                  ItemSeparatorComponent={this.itemSeparator.bind(this)}
                />
              </View>
            </View>
          </TouchableOpacity>
        </View>
      </Modal>
    )
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    // padding: 40,
  },
  mainTitle: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'transparent',
  },
  dialogStyle: {
    width: scaleSize(300),
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(48,48,48,0.85)',
  },
  btnTitle: {
    color: 'white',
    fontSize: size.fontSize.fontSizeLg,
    backgroundColor: 'transparent',
    textAlign: 'center',
  },
  selectedbtnTitle: {
    color: 'white',
    fontSize: size.fontSize.fontSizeLg,
    backgroundColor: '#4680DF',
    textAlign: 'center',
  },
  btn: {
    justifyContent: 'center',
    alignItems: 'center',
    height: scaleSize(80),
    backgroundColor: 'transparent',
    minWidth: scaleSize(100),
    width: scaleSize(300),
  },
  selectedbtn: {
    justifyContent: 'center',
    alignItems: 'center',
    height: scaleSize(80),
    backgroundColor: '#4680DF',
    minWidth: scaleSize(100),
    width: scaleSize(300),
  },
  itemSeparator: {
    height: scaleSize(5),
    backgroundColor: 'transparent',
  },
})
