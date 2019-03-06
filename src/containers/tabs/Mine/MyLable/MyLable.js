import React, { Component } from 'react'
import { FlatList, View, Image, TouchableOpacity, Text } from 'react-native'
import { ConstPath } from '../../../../constants'
import { FileTools } from '../../../../native'
import { SMap } from 'imobile_for_reactnative'
import styles from './styles'
import UserType from '../../../../constants/UserType'
import { Container } from '../../../../components'
import MyDataPopupModal from '../MyData/MyDataPopupModal'
export default class MyLable extends Component {
  props: {
    user: any,
    navigation: Object,
  }

  constructor(props) {
    super(props)
    const { params } = this.props.navigation.state
    this.state = {
      data: [],
      title: params.title,
      modalIsVisible: false,
    }
  }

  componentDidMount() {
    this.getData()
  }

  getData = async () => {
    let userPath = await FileTools.appendingHomeDirectory(
      this.props.user.currentUser.userType === UserType.PROBATION_USER
        ? ConstPath.CustomerPath
        : ConstPath.UserPath + this.props.user.currentUser.userName + '/',
    )
    let path = userPath + ConstPath.RelativePath.Lable + 'Lable.udb'
    let data = await SMap.getUDBName(path)
    this.setState({ data: data, udbPath: path })
  }

  _renderItem = ({ item, index }) => {
    let Img = require('../../../../assets/Mine/mine_my_online_data.png')
    let moreImg = require('../../../../assets/Mine/icon_more_gray.png')
    return (
      <TouchableOpacity style={{ flex: 1 }}>
        <View style={styles.rowView}>
          <Image source={Img} style={styles.Img} />
          <Text style={styles.title}>{item.title}</Text>
          <TouchableOpacity
            style={styles.moreImgBtn}
            onPress={() => {
              this.itemInfo = { item, index }
              this.setState({ modalIsVisible: true })
            }}
          >
            <Image source={moreImg} style={styles.moreImg} />
          </TouchableOpacity>
        </View>
      </TouchableOpacity>
    )
  }

  _keyExtractor = index => {
    return index
  }

  _closeModal = () => {
    this.setState({ modalIsVisible: false })
  }

  _showMyDataPopupModal = () => {
    let data = [
      {
        title: '删除数据',
        action: () => {},
      },
    ]
    return (
      <MyDataPopupModal
        // onDeleteData={this._onDeleteData}
        data={data}
        onCloseModal={this._closeModal}
        modalVisible={this.state.modalIsVisible}
      />
    )
  }

  render() {
    return (
      <Container
        ref={ref => (this.container = ref)}
        headerProps={{
          title: this.state.title,
          withoutBack: false,
          navigation: this.props.navigation,
        }}
      >
        <FlatList
          ref={ref => (this.ref = ref)}
          renderItem={this._renderItem}
          data={this.state.data}
        />
        {this._showMyDataPopupModal()}
      </Container>
    )
  }
}
