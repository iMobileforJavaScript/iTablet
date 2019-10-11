/**
 Copyright © SuperMap. All rights reserved.
 Author: Yangshanglong
 E-mail: yangshanglong@supermap.com

 两列指滑选择器
 */
import * as React from 'react'
import { View, TouchableOpacity, Text, StyleSheet } from 'react-native'
import { FingerMenu } from '../../components'
import { scaleSize } from '../../utils'
import { size, color } from '../../styles'
import { getLanguage } from '../../language'

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
  linkView: {
    flex: 1,
    height: scaleSize(300),
    flexDirection: 'row',
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
    // backgroundColor: 'transparent',
  },
  popView: {
    flex: 1,
    flexDirection: 'column',
    backgroundColor: color.bgW,
  },
})

export default class Picker extends React.Component {
  props: {
    language: String,
    confirm: () => {},
    cancel: () => {},
    popData: Array,
    currentPopData: Object,
    viewableItems?: number,
  }

  constructor(props) {
    super(props)

    this.currentFirstData =
      this.props.popData &&
      this.props.popData.length > 0 &&
      this.props.popData[0]
    this.currentSecondData =
      this.currentFirstData &&
      this.currentFirstData.children &&
      this.currentFirstData.children.length > 0 &&
      this.currentFirstData.children[0]
    this.state = {
      secondData: this.currentFirstData.children,
    }
  }

  shouldComponentUpdate(nextProps, nextState) {
    return (
      this.props.language !== nextProps.language ||
      JSON.stringify(this.props.popData) !==
        JSON.stringify(nextProps.popData) ||
      JSON.stringify(this.props.currentPopData) !==
        JSON.stringify(nextProps.currentPopData) ||
      JSON.stringify(this.state.secondData) !==
        JSON.stringify(nextState.secondData)
    )
  }

  setVisible = (visible, cb) => {
    if (visible === undefined) {
      visible = !this.state.visible
    } else if (visible === this.state.visible) {
      return
    }
    this.setState(
      {
        visible: visible,
      },
      () => {
        if (cb && typeof cb === 'function') {
          cb()
        }
      },
    )
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

  renderLinkList = () => {
    return (
      <View style={styles.linkView}>
        <FingerMenu
          style={{ flex: 1, width: '50%' }}
          ref={ref => (this.firstMenu = ref)}
          data={this.props.popData}
          initialKey={
            (this.props.currentPopData && this.props.currentPopData.key) ||
            (this.props.popData.length > 0 && this.props.popData[0].key)
          }
          onScroll={item => {
            this.currentFirstData = item
            item &&
              item.children &&
              this.setState(
                {
                  secondData: item.children,
                },
                () => {
                  this.secondMenu && this.secondMenu._scrollToIndex()
                },
              )
          }}
          onSelect={item => {
            this.currentFirstData = item
            item &&
              item.children &&
              this.setState(
                {
                  secondData: item.children,
                },
                () => {
                  this.secondMenu && this.secondMenu._scrollToIndex()
                },
              )
          }}
          viewableItems={this.props.viewableItems}
        />
        <FingerMenu
          style={{ flex: 1, width: '50%' }}
          ref={ref => (this.secondMenu = ref)}
          data={this.state.secondData}
          initialKey={this.state.secondData && this.state.secondData.key}
          onScroll={item => {
            this.currentSecondData = item
          }}
          onSelect={item => {
            this.currentSecondData = item
          }}
          viewableItems={this.props.viewableItems}
        />
      </View>
    )
  }

  renderContent = () => {
    if (this.props.popData.length > 0 && this.props.popData[0].children) {
      return this.renderLinkList()
    } else {
      return this.renderFingerList()
    }
  }

  renderBottom = () => {
    return (
      <View style={[styles.btnsView, { width: '100%' }]}>
        <TouchableOpacity
          style={[styles.btnView, { justifyContent: 'flex-start' }]}
          onPress={() => {
            if (this.props.cancel && typeof this.props.cancel === 'function') {
              this.props.cancel()
            }
          }}
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
              this.props.confirm([
                this.currentFirstData,
                this.currentSecondData,
              ])
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
      <View style={styles.popView}>
        {this.renderBottom()}
        {this.renderContent()}
      </View>
    )
  }
}
