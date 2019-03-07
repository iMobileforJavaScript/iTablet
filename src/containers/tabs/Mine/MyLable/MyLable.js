import React, { Component } from 'react'
import { View, Image, TouchableOpacity, Text } from 'react-native'
import { ConstPath } from '../../../../constants'
import { FileTools } from '../../../../native'
import { SMap } from 'imobile_for_reactnative'
import styles from './styles'
import UserType from '../../../../constants/UserType'
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
    let path = userPath + 'Lable.udb'
    let data = await SMap.getUDBName(path)
    this.setState({ data: data })
  }

  _renderItem = ({ item }) => {
    let Img = require('../../../../assets/Mine/mine_my_online_data.png')
    let moreImg = require('../../../../assets/Mine/icon_more_gray.png')
    return (
      <TouchableOpacity style={{ flex: 1 }}>
        <View style={styles.rowView}>
          <Image source={Img} style={styles.Img} />
          <Text style={styles.title}>{item.title}</Text>
          <TouchableOpacity style={styles.moreImgBtn}>
            <Image source={moreImg} style={styles.moreImg} />
          </TouchableOpacity>
        </View>
      </TouchableOpacity>
    )
  }

  render() {
    //   return(<FlatList
    //            ref={ref=>this.ref=ref}
    //            renderItem={this._renderItem}
    //            data={this.state.data}
    // />)
    return <View />
  }
}
