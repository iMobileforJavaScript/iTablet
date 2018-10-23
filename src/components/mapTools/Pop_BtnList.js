import * as React from 'react'
import { View, StyleSheet, FlatList } from 'react-native'
import * as Util from '../../utils/constUtil'
import PropTypes from 'prop-types'
import Pop_Btn from './Pop_Btn'

const WIDTH = Util.WIDTH
const ITEM_HEIGHT = 0.75 * 1.4 * 0.1 * WIDTH
const BORDERCOLOR = Util.USUAL_SEPARATORCOLOR

let measure_show = false

export default class Pop_BtnList extends React.Component {
  static propTypes = {
    data: PropTypes.array,
    measure: PropTypes.func,
    analyst: PropTypes.func,
    addlayer: PropTypes.func,
    edit: PropTypes.func,
  }

  constructor(props) {
    super(props)
    this.state = {
      data: props.data || [],
    }
    this.itemRefs = []
  }

  _measure_btn_click = () => {
    measure_show = !measure_show
    this.props.measure(measure_show)
  }

  _analyst_btn_click = () => {
    this.props.analyst()
  }

  _addLayer_btn_click = type => {
    this.props.addlayer(type)
  }

  _edit_select_click = async () => {
    this.props.edit && (await this.props.edit())
  }

  /**
   * 一级菜单选择事件
   * @param item
   * @param index
   * @private
   */
  _btnClick = ({ item, index }) => {
    item.action &&
      item.action({
        data: item,
        callback: hasChanged => {
          if (hasChanged) {
            this.itemRefs[index] && this.itemRefs[index].setSelected(true)
            this.itemRefs[this.state.lastIndex] &&
              this.itemRefs[this.state.lastIndex].setSelected(false)
            this.operationRefs = [] // 清空二级菜单
            this.setState({
              currentOperation: item,
              currentIndex: index,
              lastIndex: index,
            })
          }
        },
      })
  }

  setcCategoryRefs = (ref, index) => {
    this.itemRefs[index] = ref
  }

  _renderItem = ({ item, index }) => {
    let key = item.key
    return (
      <View style={styles.itemView}>
        <Pop_Btn
          ref={ref => {
            this.setcCategoryRefs(ref, index)
          }}
          style={styles.itemBtn}
          title={key}
          selectable={item.selectable}
          btnClick={() => this._btnClick({ item, index })}
        />
      </View>
    )
  }

  _keyExtractor = item => item.key

  render() {
    return (
      <FlatList
        style={styles.listView}
        data={this.state.data || []}
        renderItem={this._renderItem}
        horizontal={true}
        keyExtractor={this._keyExtractor}
        showsHorizontalScrollIndicator={false}
      />
    )
  }
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'column',
    height: ITEM_HEIGHT + 5,
    width: WIDTH,
    backgroundColor: 'white',
    alignSelf: 'center',
    borderStyle: 'solid',
    borderColor: BORDERCOLOR,
    borderTopWidth: 1,
    borderRightWidth: 0,
    borderLeftWidth: 0,
    borderBottomWidth: 0,
  },
  listView: {
    width: WIDTH,
  },
  itemView: {
    paddingHorizontal: 10,
  },
  itemBtn: {
    alignItems: 'center',
    justifyContent: 'center',
    height: ITEM_HEIGHT,
    width: ITEM_HEIGHT,
  },
})
