import React, { Component } from 'react'
import { FlatList, View, TouchableOpacity, Image } from 'react-native'
// import { ConstPath, ConstInfo } from '../../../../constants'
// import { FileTools } from '../../../../native'
// import { SMap, EngineType, SOnlineService } from 'imobile_for_reactnative'
// import UserType from '../../../../constants/UserType'
import { Container } from '../../../../components'
// import MyDataPopupModal from '../MyData/MyDataPopupModal'
import BaseMapItem from './BaseMapItem'
import { color } from '../../../../styles'
import NavigationService from '../../../NavigationService'
import { getLanguage } from '../../../../language/index'
// import { InputDialog } from '../../../../components/Dialog'
// import { Toast } from '../../../../utils'
import styles from './styles'
export default class MyBaseMap extends Component {
  props: {
    user: any,
    navigation: Object,
    baseMaps: Object,
    setBaseMap: () => {},
  }

  constructor(props) {
    super(props)
    this.state = {
      title: getLanguage(global.language).Profile.BASEMAP,
      //'底图',
      modalIsVisible: false,
    }
    this.curUserBaseMaps = this.props.baseMaps[
      this.props.user.currentUser.userId
    ]
    if (!this.curUserBaseMaps) {
      this.curUserBaseMaps = this.props.baseMaps['default']
    }
    this.uploadList = []
  }

  componentDidMount() {}

  _renderItem = ({ item, index }) => {
    return (
      <BaseMapItem
        {...this.props}
        curUserBaseMaps={this.curUserBaseMaps}
        item={item}
        index={index}
        saveItemInfo={this.saveItemInfo}
      />
    )
  }

  _keyExtractor = index => {
    return index
  }

  // saveItemInfo = ({ item, index }) => {
  //   this.itemInfo = { item, index }
  //   this.setState({ modalIsVisible: true },()=>{
  //     this.MyDataPopModal.setVisible(true)
  //   })
  // }

  // _showMyDataPopupModal = () => {
  //   let data = [
  //     {
  //       title: '游览地图',
  //       action: () => {
  //         // SMap.removeDatasetByName(this.state.udbPath, this.itemInfo.item.title)
  //       },
  //     },
  //   ]
  //   return (
  //     <MyDataPopupModal
  //       // onDeleteData={this._onDeleteData}
  //       ref={ref=>(this.MyDataPopModal = ref)}
  //       data={data}
  //       modalVisible={this.state.modalIsVisible}
  //     />
  //   )
  // }

  _renderHeaderBtn = () => {
    let Img = require('../../../../assets/Mine/mine_my_local_import_white.png')
    return (
      <TouchableOpacity
        onPress={() => {
          NavigationService.navigate('LoadServer', {
            setBaseMap: this.props.setBaseMap,
            baseMaps: this.curUserBaseMaps,
            user: this.props.user,
          })
        }}
      >
        <Image source={Img} style={styles.rightBtn} />
      </TouchableOpacity>
    )
  }

  render() {
    return (
      <Container
        ref={ref => (this.container = ref)}
        headerProps={{
          title: this.state.title,
          navigation: this.props.navigation,
          headerRight: this._renderHeaderBtn(),
        }}
      >
        <FlatList
          initialNumToRender={20}
          ref={ref => (this.ref = ref)}
          renderItem={this._renderItem}
          keyExtractor={(item, index) => index.toString()}
          data={this.curUserBaseMaps}
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
        {/*{this._showMyDataPopupModal()}*/}
      </Container>
    )
  }
}
