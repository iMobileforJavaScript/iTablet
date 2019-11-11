/*
 Copyright © SuperMap. All rights reserved.
 Author: Yangshanglong
 E-mail: yangshanglong@supermap.com
 */
import * as React from 'react'
import {
  View,
  TouchableOpacity,
  Text,
  StyleSheet,
  FlatList,
} from 'react-native'
import { PopView, FingerMenu } from '../../../components'
import { scaleSize } from '../../../utils'
import { size, color } from '../../../styles'
import { getLanguage } from '../../../language'
import AnalystMultiListItem from './AnalystMultiListItem'

const styles = StyleSheet.create({
  btnsView: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: scaleSize(50),
    height: scaleSize(80),
  },
  btnView: {
    flex: 1,
    flexDirection: 'row',
    height: scaleSize(80),
    alignItems: 'center',
    justifyContent: 'center',
  },
  btnText: {
    fontSize: size.fontSize.fontSizeMd,
    color: color.fontColorBlack,
    textAlign: 'center',
    backgroundColor: 'transparent',
  },
  list: {
    maxHeight: (scaleSize(80) + 1) * 6, // 最多6条
    backgroundColor: 'transparent',
  },
})

const LIST_TYPE = {
  FINGER: 'finger', // 指滑单选列表
  MULTI: 'multi', // 复选框多选列表
}

export default class PopModalList extends React.Component {
  props: {
    language: String,
    type?: String,
    confirm: () => {},
    cancel: () => {},
    popData: Array,
    currentPopData: Object,
  }

  static defaultProps = {
    type: LIST_TYPE.FINGER, // finger, multi
  }

  constructor(props) {
    super(props)

    this.state = {
      selectedData: (new Map(): Map<string, Object>),
      // type: props.type,
    }
  }

  shouldComponentUpdate(nextProps, nextState) {
    return (
      this.props.language !== nextProps.language ||
      JSON.stringify(this.props.popData) !==
        JSON.stringify(nextProps.popData) ||
      JSON.stringify(this.props.currentPopData) !==
        JSON.stringify(nextProps.currentPopData) ||
      !this.state.selectedData.compare(nextState.selectedData)
    )
  }

  setVisible = (visible, cb) => {
    this.popModal && this.popModal.setVisible(visible, cb)
  }

  // setVisible = (...arg) => { // visible, type, cb = () => {}
  //   if (arg.length === 3 || arg.length === 2 && typeof arg[1] !== 'function') {
  //     if (this.state.type !== arg[1]) {
  //       this.setState({
  //         type: arg[1],
  //       }, () => {
  //         this.popModal && this.popModal.setVisible(arg[0], arg[2])
  //       })
  //     } else {
  //       this.popModal && this.popModal.setVisible(arg[0], arg[2])
  //     }
  //   } else {
  //     this.popModal && this.popModal.setVisible(arg[0], arg[1])
  //   }
  // }

  clearMultiSelected = () => {
    this.setState({
      selectedData: (new Map(): Map<string, Object>),
    })
  }

  onSelect = item => {
    this.setState(state => {
      const selectedData = new Map().clone(state.selectedData)
      if (selectedData.has(item.key)) {
        selectedData.delete(item.key)
      } else {
        selectedData.set(item.key, item)
      }
      return { selectedData }
    })
  }

  renderFingerList = () => {
    return (
      <FingerMenu
        ref={ref => (this.fingerMenu = ref)}
        data={this.props.popData}
        initialKey={
          (this.props.currentPopData && this.props.currentPopData.key) ||
          (this.props.popData.length > 0 && this.props.popData[0].key)
        }
      />
    )
  }

  renderMultiList = () => {
    return (
      <FlatList
        style={styles.list}
        initialNumToRender={20}
        ref={ref => (this.ref = ref)}
        renderItem={({ item }) => {
          return (
            <AnalystMultiListItem
              data={item}
              onSelect={this.onSelect}
              selected={this.state.selectedData.has(item.key)}
            />
          )
        }}
        data={this.props.popData}
        keyExtractor={item => item.name}
        ItemSeparatorComponent={() => (
          <View
            style={{
              backgroundColor: color.separateColorGray,
              flex: 1,
              height: 1,
            }}
          />
        )}
      />
    )
  }

  renderContent = () => {
    switch (this.props.type) {
      case LIST_TYPE.FINGER:
        return this.renderFingerList()
      case LIST_TYPE.MULTI:
        return this.renderMultiList()
    }
  }

  renderBottom = () => {
    return (
      <View style={[styles.btnsView, { width: '100%' }]}>
        <TouchableOpacity
          style={[styles.btnView, { justifyContent: 'flex-start' }]}
          onPress={() => this.popModal && this.popModal.setVisible(false)}
        >
          <Text style={styles.btnText}>
            {
              getLanguage(this.props.language || GLOBAL.language).Analyst_Labels
                .CANCEL
            }
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.btnView, { justifyContent: 'flex-end' }]}
          onPress={() => {
            if (
              this.props.confirm &&
              typeof this.props.confirm === 'function'
            ) {
              let data
              switch (this.props.type) {
                case LIST_TYPE.FINGER: {
                  let fingerData =
                    this.fingerMenu && this.fingerMenu.getCurrentData()
                  data = fingerData.data
                  break
                }
                case LIST_TYPE.MULTI: {
                  data = []
                  this.state.selectedData.forEach(value => {
                    data.push(value)
                  })
                }
              }
              this.props.confirm(data)
            }
          }}
        >
          <Text style={styles.btnText}>
            {
              getLanguage(this.props.language || GLOBAL.language).Analyst_Labels
                .CONFIRM
            }
          </Text>
        </TouchableOpacity>
      </View>
    )
  }

  render() {
    return (
      <PopView ref={ref => (this.popModal = ref)}>
        <View style={[styles.popView, { width: '100%' }]}>
          {this.renderBottom()}
          {this.renderContent()}
        </View>
      </PopView>
    )
  }
}
