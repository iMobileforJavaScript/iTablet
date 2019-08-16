import React, { Component } from 'react'
import { View, Text, TouchableOpacity, Image, StyleSheet } from 'react-native'
import { scaleSize, setSpText } from '../../../../utils'
import { getLanguage } from '../../../../language'

export default class ModuleItem extends Component {
  props: {
    downloads: Object,
    downloadData: Object,
    item: Object,
    importWorkspace: () => {},
    showDialog: () => {},
    getModuleItem: () => {},
    itemAction: () => {},
  }

  constructor(props) {
    super(props)
    this.downloading = false
    this.state = {
      isShowProgressView: false,
      progress: '',
      disabled: false,
      dialogCheck: false,
    }
  }

  shouldComponentUpdate(nextProps, nextState) {
    if (
      JSON.stringify(this.state) !== JSON.stringify(nextState) ||
      JSON.stringify(this.props) !== JSON.stringify(nextProps)
    ) {
      return true
    }
    return false
  }

  setNewState = data => {
    if (!data) return
    this.setState(data)
  }

  getDialogCheck = () => {
    return this.state.dialogCheck
  }

  getDownloading = () => {
    return this.downloading
  }

  setDownloading = (downloading = false) => {
    this.downloading = downloading
  }

  _renderProgressView = () => {
    if (!this.props.downloadData) return <View />
    // let value =
    //   (this.props.downloadData.progress >= 0
    //     ? ~~this.props.downloadData.progress.toFixed(0)
    //     : 0) + '%'
    let value = this.props.downloadData.progress + '%'
    let progress =
      this.props.downloadData.progress >= 100
        ? getLanguage(global.language).Prompt.IMPORTING
        : value
    return (
      <View
        style={[
          {
            position: 'absolute',
            width: scaleSize(260),
            height: scaleSize(260),
            backgroundColor: '#rgba(112, 128, 144,0.9)',
            alignItems: 'center',
            justifyContent: 'center',
            borderRadius: 5,
          },
        ]}
      >
        <Text
          style={{
            fontSize: setSpText(25),
            fontWeight: 'bold',
            color: 'white',
          }}
        >
          {progress}
        </Text>
      </View>
    )
  }

  render() {
    let item = this.props.item
    return (
      <View style={styles.moduleView}>
        <TouchableOpacity
          disabled={this.state.disabled}
          onPress={() => {
            this.props.itemAction && this.props.itemAction(item)
          }}
          style={[styles.module]}
        >
          {/* <Image source={image} style={item.img} /> */}
          {/* <Image source={item.baseImage} style={item.style} /> */}
          <View style={styles.moduleItem}>
            <Image
              resizeMode={'contain'}
              source={item.moduleImage}
              style={styles.moduleImage}
            />
            <Text style={styles.title}>{item.title}</Text>
          </View>
          {this._renderProgressView()}
        </TouchableOpacity>
      </View>
    )
  }
}

const styles = StyleSheet.create({
  module: {
    width: scaleSize(260),
    height: scaleSize(260),
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#707070',
    borderRadius: scaleSize(4),
  },
  moduleImage: {
    width: scaleSize(100),
    height: scaleSize(100),
  },
  moduleView: {
    width: scaleSize(300),
    height: scaleSize(300),
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
  },
  moduleItem: {
    alignItems: 'center',
    justifyContent: 'center',
    flex: 1,
  },
  title: {
    width: scaleSize(200),
    height: scaleSize(37),
    fontSize: setSpText(25),
    color: '#FFFFFF',
    textAlign: 'center',
    marginTop: scaleSize(13),
  },
})
