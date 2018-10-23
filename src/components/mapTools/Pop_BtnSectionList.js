import * as React from 'react'
import { View, StyleSheet, FlatList } from 'react-native'
import { constUtil, scaleSize, screen } from '../../utils'
import { color } from '../../styles'
import PropTypes from 'prop-types'
import Pop_Btn from './Pop_Btn'
import PopTextBtn from './PopTextBtn'
import MTBtn from './MT_Btn'

const WIDTH = constUtil.WIDTH
const SEPATATOR_WIDTH = 1

const categoryHeight = scaleSize(80)

export default class Pop_BtnSectionList extends React.Component {
  static propTypes = {
    style: PropTypes.any,
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
    separatorWidth: PropTypes.number,
    separatorColor: PropTypes.string,
    columns: PropTypes.number,
    // currentSubKey: PropTypes.string,
    // lastSubKey: PropTypes.string,
  }

  static defaultProps = {
    subBtnType: 'textBtn',
    separatorWidth: scaleSize(20),
    separatorColor: 'transparent',
    columns: 1,
  }

  constructor(props) {
    super(props)
    this.categoryRefs = []
    this.operationRefs = []
    this.categoryHeight = categoryHeight
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
    item.action &&
      item.action({
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

  dealData = (data = []) => {
    let gridData = []
    data.forEach((obj, index) => {
      let row = Math.floor(index / this.props.columns)
      if (!gridData[row]) {
        gridData[row] = []
      }
      gridData[row].push(obj)
    })
    return gridData
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
        btnClick={() => this._btn_click_manager({ item, index })}
      />
    )
  }

  _renderOperationItem = ({ item, row, index }) => {
    let key = item.key
    const width = screen.deviceWidth / this.props.columns
    return (
      <View style={[styles.operationView, { width }]} key={row + '_' + index}>
        {// this.props.subBtnType === 'imageBtn'
          item.image ? (
            <MTBtn
              ref={ref => {
                this.setOperationRefs(ref, index)
              }}
              selected={key === this.state.currentSubKey}
              title={item.title}
              size={item.size}
              image={item.image}
              selectMode={item.selectMode}
              selectedImage={item.selectedImage}
              // textStyle={item.textStyle}
              onPress={() => this._btn_click_operation({ item, index })}
            />
          ) : (
            <Pop_Btn
              ref={ref => {
                this.setOperationRefs(ref, index)
              }}
              selected={key === this.state.currentSubKey}
              style={styles.operation}
              title={key}
              btnClick={() => this._btn_click_operation({ item, index })}
            />
          )}
      </View>
    )
  }

  setGridListProps = props => {
    let height = 0
    if (props && props.style && props.style.height) {
      height = props.style.height - this.categoryHeight
      Object.assign(props.style, { height })
    }
    this.gridList && this.gridList.setNativeProps(props)
  }

  _keyExtractor = item => item.key

  _keySubExtractor = item => item.key

  _renderItemSeparatorComponent = () => {
    return (
      <View
        style={[
          styles.separator,
          this.props.separatorWidth >= 0 && {
            width: scaleSize(this.props.separatorWidth),
            backgroundColor: this.props.separatorColor,
          },
        ]}
      />
    )
  }

  render() {
    let operations = []
    if (this.props.currentOperation.operations) {
      operations = this.props.currentOperation.operations.concat()
      // operations = this.dealData(this.props.currentOperation.operations)
    }
    return (
      <View style={[styles.container, this.props.style]} {...this.props}>
        <FlatList
          style={styles.categoryListView}
          data={this.props.data.concat([])}
          renderItem={this._renderItem}
          // ItemSeparatorComponent={this._renderSeparator}
          horizontal={true}
          keyExtractor={this._keyExtractor}
          showsHorizontalScrollIndicator={false}
        />
        {this.props.currentOperation && this.props.subPopShow ? (
          <View style={styles.subContainer}>
            {this.props.subLeft}
            {operations &&
              operations.length > 0 && (
              <FlatList
                ref={ref => (this.gridList = ref)}
                style={styles.operationsListView}
                contentContainerStyle={[styles.contentContainerStyle]}
                data={operations}
                numColumns={this.props.columns}
                renderItem={this._renderOperationItem}
                keyExtractor={this._keySubExtractor}
                showsHorizontalScrollIndicator={false}
                ItemSeparatorComponent={this._renderItemSeparatorComponent}
              />
            )}
            {this.props.subRight}
          </View>
        ) : null}
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
  },
  categoryListView: {
    height: scaleSize(80),
    backgroundColor: 'white',
  },
  contentContainerStyle: {
    // alignItems: 'center',
    backgroundColor: 'transparent',
    paddingVertical: scaleSize(30),
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
    // width: ITEM_HEIGHT,
  },
  subContainer: {
    // flex: 1,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
})
