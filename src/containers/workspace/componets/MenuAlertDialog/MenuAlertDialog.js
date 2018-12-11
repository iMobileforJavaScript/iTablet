import * as React from 'react'
import {
  View,
  Text,
  StyleSheet,
  Modal,
  TouchableOpacity,
  TouchableHighlight,
  FlatList,
} from 'react-native'
import { size } from '../../../../styles'
import { scaleSize } from '../../../../utils'
import constants from '../../constants'
import { ConstToolType } from '../../../../constants'

export default class MenuAlertDialog extends React.Component {
  props: {
    btnStyle: StyleSheet,
    btnTitleStyle: StyleSheet,
    backHide: any,
    existFullMap: () => {},
    showFullMap: () => {},
    getToolBarRef: () => {},
  }

  //单值
  uniqueMenuInfo = [
    {
      key: '表达式',
      btntitle: '表达式',
      action: () => {
        this.setDialogVisible(false)

        const toolRef = this.props.getToolBarRef()
        if (toolRef) {
          toolRef.getThemeExpress(ConstToolType.MAP_THEME_PARAM_UNIQUE_EXPRESSION)
        }
      },
    },
    {
      key: '颜色方案',
      btntitle: '颜色方案',
      action: () => {
        this.setDialogVisible(false)

        const toolRef = this.props.getToolBarRef()
        if (toolRef) {
          toolRef.getColorGradientType(ConstToolType.MAP_THEME_PARAM_UNIQUE_COLOR)
        }
      },
    },
  ]

  //分段
  rangeMenuInfo = [
    {
      key: '表达式',
      btntitle: '表达式',
      action: () => {
        this.setDialogVisible(false)


        const toolRef = this.props.getToolBarRef()
        if (toolRef) {
          toolRef.getThemeExpress(ConstToolType.MAP_THEME_PARAM_RANGE_EXPRESSION)
        }
      },
    },
    {
      key: '分段方法',
      btntitle: '分段方法',
      action: () => {
        this.setDialogVisible(false)
      },
    },
    {
      key: '颜色方案',
      btntitle: '颜色方案',
      action: () => {
        this.setDialogVisible(false)

        const toolRef = this.props.getToolBarRef()
        if (toolRef) {
          toolRef.getColorGradientType(ConstToolType.MAP_THEME_PARAM_RANGE_COLOR)
        }
      },
    },
  ]

  //统一标签
  labelMenuInfo = [
    {
      key: '表达式',
      btntitle: '表达式',
      action: () => {
        this.setDialogVisible(false)
      },
    },
    {
      key: '背景形状',
      btntitle: '背景形状',
      action: () => {
        this.setDialogVisible(false)
      },
    },
    {
      key: '字体',
      btntitle: '字体',
      action: () => {
        this.setDialogVisible(false)
      },
    },
    {
      key: '字号',
      btntitle: '字号',
      action: () => {
        this.setDialogVisible(false)
      },
    },
    {
      key: '旋转角度',
      btntitle: '旋转角度',
      action: () => {
        this.setDialogVisible(false)
      },
    },
    {
      key: '颜色',
      btntitle: '颜色',
      action: () => {
        this.setDialogVisible(false)
      },
    },
  ]

  constructor(props) {
    super(props)
    this.state = {
      type: '',
      childrens: [],
      visible: false,
    }
  }

  getData = () => {
    let data
    switch (this.state.type) {
      case constants.THEME_UNIQUE_STYLE:
        data = this.uniqueMenuInfo
        break
      case constants.THEME_RANGE_STYLE:
        data = this.rangeMenuInfo
        break
      case constants.THEME_UNIFY_LABEL:
        data = this.labelMenuInfo
        break
      default:
        data = this.uniqueMenuInfo
        break
    }
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

  renderItem({ item }) {
    return (
      <TouchableHighlight
        activeOpacity={0.9}
        underlayColor="#4680DF"
        style={styles.btn}
        onPress={item.action}
      >
        <Text style={styles.btnTitle}>{item.btntitle}</Text>
      </TouchableHighlight>
    )
  }
  itemSeparator = () => {
    return <View style={styles.itemSeparator} />
  }
  render() {
    if (this.state.childrens.length === 0) return null
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
        <TouchableOpacity
          activeOpacity={0.8}
          style={{ flex: 1 }}
          onPress={this._onClose}
        >
          <View style={styles.mainTitle}>
            <View style={styles.dialogStyle}>
              <FlatList
                data={this.state.childrens}
                renderItem={this.renderItem}
              />
            </View>
          </View>
        </TouchableOpacity>
      </Modal>
    )
  }
}

const styles = StyleSheet.create({
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
  btn: {
    justifyContent: 'center',
    alignItems: 'center',
    height: scaleSize(80),
    backgroundColor: 'transparent',
    minWidth: scaleSize(100),
    width: scaleSize(300),
  },
})
