import * as React from 'react'
import { View, StyleSheet, FlatList } from 'react-native'
import { constUtil, scaleSize } from '../../utils'
import { color } from '../../styles'
import PropTypes from 'prop-types'
import Pop_Btn from './Pop_Btn'
import PopTextBtn from './PopTextBtn'
import { BtnOne } from '../Button'
import MTBtn from './MT_Btn'

const WIDTH = constUtil.WIDTH
const ITEM_HEIGHT = 0.75 * 1.4 * 0.1 * WIDTH
const BORDERCOLOR = constUtil.USUAL_SEPARATORCOLOR
const SEPATATOR_WIDTH = 1

export default class Pop_BtnSectionList extends React.Component {

  static propTypes = {
    data: PropTypes.array,
    measure: PropTypes.func,
    analyst: PropTypes.func,
    addlayer: PropTypes.func,
    edit: PropTypes.func,
    popType: PropTypes.any,
    subPopShow: PropTypes.bool,
    currentData: PropTypes.object,
    subLeft: PropTypes.any,
    subRight: PropTypes.any,
    subBtnType: PropTypes.string,
    operationAction: PropTypes.func,
    currentOperation: PropTypes.object,
    currentIndex: PropTypes.number,
    // currentSubKey: PropTypes.string,
    // lastSubKey: PropTypes.string,
  }

  static defaultProps = {
    subBtnType: 'textBtn',
  }

  constructor(props) {
    super(props)
    this.categoryRefs = []
    this.operationRefs = []
    this.state = {
      currentSubKey: '',
      lastSubKey: '',
    }
  }

  // componentDidMount() {
  //   let name = this.props.currentData && this.props.currentData.name ? this.props.currentData.name : ''
  //   name && Toast.show('当前可编辑的图层为\n' + name)
  // }

  // findData = (data = [], currentData) => {
  //   let currentOperation = {},
  //     index = -1, lastIndex = -1
  //   if (data.length <= 0) return
  //   if (data[0].key !== this.props.data[0].key) {
  //     lastIndex = 0
  //   } else {
  //     lastIndex = this.state ? this.props.currentIndex : 0
  //   }
  //   for (let i = 0; i < data.length; i++) {
  //     if (currentData.type === data[i].type) {
  //       currentOperation = data[i]
  //       index = i
  //       break
  //     }
  //   }
  //   return { currentOperation, index, lastIndex }
  //   // this.currentOperation = currentOperation
  //   // this.index = index
  // }

  setCurrentOption = options => {
    this.setState({
      currentOperation: options,
    })
  }

  /**
   * 一级菜单选择事件
   * @param item
   * @param index
   * @private
   */
  _btn_click_manager = ({ item, index }) => {
    this.props.operationAction && this.props.operationAction({ item, index })
  }

  /**
   * 二级菜单选择事件
   * @param item
   * @param index
   * @private
   */
  _btn_click_operation = ({ item }) => {
    item.action && item.action({
      data: item,
      callback: (reset = false) => {
        let selected = false
        if (reset || item.key === this.state.currentSubKey) {
          this.setState({
            currentSubKey: '',
          })
          selected = false
        } else {
          this.setState({
            currentSubKey: item.key,
          })
          selected = true
        }
        return selected
      },
    })
  }

  setCategoryRefs = (ref, index) => {
    this.categoryRefs[index] = ref
  }

  setOperationRefs = (ref, index) => {
    this.operationRefs[index] = ref
  }

  clearCategoryRefs = () => {
    this.categoryRefs = []
  }

  clearOperationRefs = () => {
    this.operationRefs = []
  }

  _renderItem = ({ item, index }) => {
    let key = item.key
    let width = WIDTH / this.props.data.length - SEPATATOR_WIDTH
    return (
      <PopTextBtn
        ref={ref => {
          this.setCategoryRefs(ref, index)
        }}
        selected={this.props.currentIndex === index}
        style={[styles.item, { width }]}
        title={key}
        btnClick={() => this._btn_click_manager({ item, index })}/>
    )
  }

  _renderOperationItem = ({ item, index }) => {
    let key = item.key
    return (
      <View style={styles.operationView}>
        {
          // this.props.subBtnType === 'imageBtn'
          // item.image
          //   ? <MTBtn BtnText={key} image={item.image} BtnClick={() => this._btn_click_operation({ item, index })}/>
          //   :
          <Pop_Btn
            ref={ref => {
              this.setOperationRefs(ref, index)
            }}
            selected={key === this.state.currentSubKey}
            style={styles.operation}
            BtnText={key}
            btnClick={() => this._btn_click_operation({ item, index })}/>
        }
      </View>
    )
  }

  _renderSeparator = () => {
    return (
      <View style={styles.separator}/>
    )
  }

  _keyExtractor = item => item.key

  _keySubExtractor = item => item.key

  render() {
    // let props = { ...this.props }
    // this.findData(props.data, props.currentData)
    let operations = []
    if (this.props.currentOperation.operations) {
      operations = this.props.currentOperation.operations.concat()
    }
    return (
      <View style={styles.container}{...this.props}>
        <FlatList
          style={styles.categoryListView}
          data={this.props.data.concat([])}
          renderItem={this._renderItem}
          // ItemSeparatorComponent={this._renderSeparator}
          horizontal={true}
          keyExtractor={this._keyExtractor}
          showsHorizontalScrollIndicator={false}
        />
        {
          this.props.currentOperation && this.props.subPopShow ? <View style={styles.subContainer}>
            {this.props.subLeft}
            {
              // this.props.currentOperation.operations && this.props.currentOperation.operations.length > 0 &&
              operations && operations.length > 0 &&
              <FlatList
                ref={ref => (this.operationList = ref)}
                style={styles.operationsListView}
                // data={this.props.currentOperation.operations || []}
                data={operations}
                renderItem={this._renderOperationItem}
                horizontal={true}
                keyExtractor={this._keySubExtractor}
                showsHorizontalScrollIndicator={false}
              />
            }
            {this.props.subRight}
          </View> : null
        }
      </View>
    )
  }
}

Pop_BtnSectionList.SubBtnType = {
  IMAGE_BTN: 'imageBtn',
  TEXT_BTN: 'textBtn',
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'column',
    backgroundColor: 'white',
    alignSelf: 'center',
    borderStyle: 'solid',
    borderColor: BORDERCOLOR,
    borderTopWidth: 1,
    borderRightWidth: 0,
    borderLeftWidth: 0,
    borderBottomWidth: 0,
  },
  categoryListView: {
    height: scaleSize(80),
    // borderBottomWidth: 1,
    borderTopWidth: 1,
    borderColor: color.USUAL_SEPARATORCOLOR,
    backgroundColor: 'white',
  },
  operationsListView: {
    flex: 1,
    borderTopWidth: 1,
    borderColor: color.USUAL_SEPARATORCOLOR,
    paddingVertical: scaleSize(10),
    backgroundColor: 'white',
  },
  separator: {
    alignSelf: 'center',
    width: SEPATATOR_WIDTH,
    height: 20,
    backgroundColor: color.USUAL_SEPARATORCOLOR,
  },
  item: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  operationView: {
    paddingHorizontal: 10,
  },
  operation: {
    alignItems: 'center',
    justifyContent: 'center',
    height: scaleSize(100),
    width: ITEM_HEIGHT,
  },
  subContainer: {
    // flex: 1,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
})