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

export default class MultiPicker extends React.Component {
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
    this.state = {
      secondData: this.currentFirstData.children,
    }
    this.update = false
  }

  shouldComponentUpdate(nextProps, nextState) {
    return (
      this.props.language !== nextProps.language ||
      JSON.stringify(this.props.popData) !==
        JSON.stringify(nextProps.popData) ||
      JSON.stringify(this.props.currentPopData) !==
        JSON.stringify(nextProps.currentPopData) ||
      JSON.stringify(this.state) !== JSON.stringify(nextState)
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

  _getFirstDataIndex = () => {
    for (let i = 0; i < this.props.popData.length; i++) {
      if (
        this.props.popData[i].key !== undefined &&
        this.props.popData[i].key === this.currentFirstData.key
      ) {
        return i
      }
    }
  }

  _getSecondDataIndex = () => {
    let index = this._getFirstDataIndex()
    let currentFirstData = this.props.popData[index]
    for (let i = 0; i < currentFirstData.children.length; i++) {
      if (
        currentFirstData.children[i].key !== undefined &&
        currentFirstData.children[i].key === currentFirstData.selectedItem.key
      ) {
        return i
      }
    }
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
            this.update = true
            item &&
              item.children &&
              this.setState(
                {
                  secondData: item.children,
                },
                () => {
                  this.update = false
                  this.secondMenu &&
                    this.secondMenu._scrollToIndex(this._getSecondDataIndex())
                },
              )
          }}
          onSelect={item => {
            this.currentFirstData = item
            this.update = true
            item &&
              item.children &&
              this.setState(
                {
                  secondData: item.children,
                },
                () => {
                  this.update = false
                  this.secondMenu &&
                    this.secondMenu._scrollToIndex(this._getSecondDataIndex())
                },
              )
          }}
          viewableItems={this.props.viewableItems}
        />
        <FingerMenu
          style={{ flex: 1, width: '50%' }}
          ref={ref => (this.secondMenu = ref)}
          data={this.state.secondData}
          initialKey={this.currentFirstData.initItem.key}
          onScroll={item => {
            if (this.update) return
            let index = this._getFirstDataIndex()
            this.props.popData[index].selectedItem = item
          }}
          onSelect={item => {
            if (this.update) return
            let index = this._getFirstDataIndex()
            this.props.popData[index].selectedItem = item
          }}
          viewableItems={this.props.viewableItems}
        />
      </View>
    )
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
              this.props.confirm(this.props.popData)
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
        {this.renderLinkList()}
      </View>
    )
  }
}
