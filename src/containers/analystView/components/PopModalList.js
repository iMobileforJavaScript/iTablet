/*
 Copyright © SuperMap. All rights reserved.
 Author: Yangshanglong
 E-mail: yangshanglong@supermap.com
 */
import * as React from 'react'
import { View, TouchableOpacity, Text, StyleSheet } from 'react-native'
import { PopModal, FingerMenu } from '../../../components'
import { scaleSize } from '../../../utils'
import { size, color } from '../../../styles'
import { getLanguage } from '../../../language'

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
})

export default class PopModalList extends React.Component {
  props: {
    language: String,
    confirm: () => {},
    cancel: () => {},
    popData: Array,
    currentPopData: Object,
  }

  setVisible = (visible, cb) => {
    this.popModal && this.popModal.setVisible(visible, cb)
  }

  render() {
    return (
      <PopModal ref={ref => (this.popModal = ref)}>
        <View style={[styles.popView, { width: '100%' }]}>
          <FingerMenu
            ref={ref => (this.fingerMenu = ref)}
            data={this.props.popData}
            initialKey={
              this.props.currentPopData && this.props.currentPopData.key
            }
          />
          <View style={[styles.btnsView, { width: '100%' }]}>
            <TouchableOpacity
              style={[styles.btnView, { justifyContent: 'flex-start' }]}
              onPress={() => this.popModal && this.popModal.setVisible(false)}
            >
              <Text style={styles.btnText}>
                {
                  getLanguage(this.props.language || GLOBAL.language)
                    .Analyst_Labels.CANCEL
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
                  let { data } =
                    this.fingerMenu && this.fingerMenu.getCurrentData()
                  this.props.confirm(data)
                }
              }}
            >
              <Text style={styles.btnText}>
                {
                  getLanguage(this.props.language || GLOBAL.language)
                    .Analyst_Labels.CONFIRM
                }
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </PopModal>
    )
  }
}
