import * as React from 'react'
import { View, StyleSheet, FlatList } from 'react-native'
import { constUtil, Toast, scaleSize} from '../../utils'
import { color } from '../../styles'
import PropTypes from 'prop-types'
import Pop_Btn from './Pop_Btn'
import PopTextBtn from './PopTextBtn'
import MTBtn from './MT_Btn'

const WIDTH = constUtil.WIDTH
const ITEM_HEIGHT = 0.75 * 1.4 * 0.1 * WIDTH
const ITEM_WIDTH = ITEM_HEIGHT
const BORDERCOLOR = constUtil.USUAL_SEPARATORCOLOR
const SEPATATOR_WIDTH = 1

let measure_show = false

export default class Pop_BtnSectionList extends React.Component {

  static propTypes = {
    data: PropTypes.array,
    measure: PropTypes.func,
    analyst: PropTypes.func,
    addlayer: PropTypes.func,
    edit: PropTypes.func,
    popType: PropTypes.string,
    subPopShow: PropTypes.bool,
    currentData: PropTypes.object,
    subLeft: PropTypes.any,
    subRight: PropTypes.any,
    subBtnType: PropTypes.string,
  }

  static defaultProps = {
    subBtnType: 'textBtn',
  }

  constructor(props) {
    super(props)
    let { currentOperation, index } = this.findData(props.data, props.currentData)
    this.state = {
      data: props.data || [],
      currentOperation: currentOperation,
      currentIndex: index,
      lastIndex: index,
    }

    this.categoryRefs = []
    this.operationRefs = []
  }

  componentDidMount() {
    let name = this.props.currentData && this.props.currentData.name ? this.props.currentData.name : ''
    name && Toast.show('当前可编辑的图层为\n' + name)
    this.props.subPopShow
    && this.changeCategorySelected(this.state.currentIndex)
  }
  //
  // componentWillReceiveProps(nextProps) {
  //   if (
  //     JSON.stringify(nextProps.data) !== JSON.stringify(this.state.data) ||
  //     JSON.stringify(nextProps.currentData) !== JSON.stringify(this.props.currentData)
  //   ) {
  //     let { currentOperation, index } = this.findData(nextProps.data, nextProps.currentData)
  //     this.setState({
  //       data: nextProps.data || [],
  //       currentOperation: currentOperation,
  //       currentIndex: index,
  //       lastIndex: this.state.currentIndex,
  //     }, () => {
  //       nextProps.subPopShow && this.changeCategorySelected(index)
  //     })
  //   }
  // }

  findData = (data = [], currentData) => {
    let currentOperation = {},
      index = -1
    for (let i = 0; i < data.length; i++) {
      if (currentData.type === data[i].type) {
        currentOperation = data[i]
        index = i
        break
      }
    }
    return {currentOperation, index}
  }

  changeCategorySelected = index => {
    if (this.props.popType !== 'data_edit' && this.props.popType !== 'analyst') return
    this.categoryRefs[index] && this.categoryRefs[index].setSelected(true)
    if (index === this.state.lastIndex) return
    this.categoryRefs[this.state.lastIndex] && this.categoryRefs[this.state.lastIndex].setSelected(false)
  }

  _measure_btn_click = () => {
    measure_show = !measure_show
    this.props.measure(measure_show)
  }

  _analyst_btn_click = () =>{
    this.props.analyst()
  }

  _addLayer_btn_click =type=>{
    this.props.addlayer(type)
  }

  _edit_select_click = async() => {
    this.props.edit && await this.props.edit()
  }

  /**
   * 一级菜单选择事件
   * @param item
   * @param index
   * @private
   */
  _btn_click_manager = ({item, index}) => {
    item.action && item.action({
      data: item,
      index: index,
      callback: hasChanged => {
        if (hasChanged) {
          this.changeCategorySelected(index)
          this.operationRefs = [] // 清空二级菜单
          this.setState({
            currentOperation: item,
            currentIndex: index,
            lastIndex: index,
          })
        }
      }})

  }

  /**
   * 二级菜单选择事件
   * @param item
   * @param index
   * @private
   */
  _btn_click_operation = ({item, index}) => {
    item.action && item.action({
      data: item,
      callback: hasChanged => {

      }})
  }

  setcCategoryRefs = (ref, index) => {
    this.categoryRefs[index] = ref
  }

  setcOperationRefs = (ref, index) => {
    this.operationRefs[index] = ref
  }

  _renderItem = ({ item, index }) => {
    let key = item.key
    let width = WIDTH / this.state.data.length - SEPATATOR_WIDTH
    return (
      <PopTextBtn
        ref={ref => {
          this.setcCategoryRefs(ref, index)
        }}
        style={[styles.item, { width }]}
        title={key}
        btnClick={() => this._btn_click_manager({item, index})} />
    )
  }

  _renderOperationItem = ({ item, index }) => {
    let key = item.key
    return (
      <View style={styles.operationView}>
        {
          this.props.subBtnType === 'imageBtn'
            ? <MTBtn BtnText={key} BtnImageSrc={item.image} BtnClick={() => this._btn_click_operation({item, index})} />
            : <Pop_Btn
              ref={ref => {
                this.setcOperationRefs(ref, index)
              }}
              style={styles.operation}
              BtnText={key}
              btnClick={() => this._btn_click_operation({item, index})} />
        }
      </View>
    )
  }

  _renderSeparator = () => {
    return (
      <View style={styles.separator} />
    )
  }

  _keyExtractor = (item, index) => item.key

  _keySubExtractor = (item, index) => (this.state.currentOperation.key + '-' + item.key)

  render() {
    let props = { ...this.props }
    return (
      <View style={styles.container}{...props}>
        <FlatList
          style={styles.categoryListView}
          data={this.state.data}
          renderItem={this._renderItem}
          ItemSeparatorComponent={this._renderSeparator}
          horizontal={true}
          keyExtractor={this._keyExtractor}
          showsHorizontalScrollIndicator={false}
        />
        {
          this.state.currentOperation && this.props.subPopShow ? <View style={styles.subContainer}>
            {this.props.subLeft}
            {
              this.state.currentOperation.operations && this.state.currentOperation.operations.length > 0 &&
              <FlatList
                ref={ref => (this.operationList = ref)}
                style={styles.operationsListView}
                data={this.state.currentOperation.operations || []}
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
    height: ITEM_HEIGHT + 5,
    width: WIDTH,
    backgroundColor: constUtil.USUAL_GREEN,
    alignSelf: 'center',
    borderStyle: 'solid',
    borderColor: BORDERCOLOR,
    borderTopWidth: 1,
    borderRightWidth: 0,
    borderLeftWidth: 0,
    borderBottomWidth: 0,
  },
  categoryListView: {
    width: WIDTH,
    height: scaleSize(80),
    borderBottomWidth: 1,
    borderColor: color.USUAL_SEPARATORCOLOR,
  },
  operationsListView: {
    // width: WIDTH,
    flex: 1,
    paddingVertical: scaleSize(10),
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
    // height: ITEM_HEIGHT,
    // width: ITEM_WIDTH,
  },
  operationView: {
    paddingHorizontal: 10,
  },
  operation: {
    alignItems: 'center',
    justifyContent: 'center',
    height: ITEM_HEIGHT,
    width: ITEM_HEIGHT,
  },
  subContainer: {
    // flex: 1,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
})