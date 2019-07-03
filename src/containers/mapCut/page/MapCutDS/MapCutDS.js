/*
 Copyright © SuperMap. All rights reserved.
 Author: Yang Shanglong
 E-mail: yangshanglong@supermap.com
 */
import * as React from 'react'
import { View, Image, Text, FlatList, TouchableOpacity } from 'react-native'
import { Container } from '../../../../components'
import NavigationService from '../../../NavigationService'
import { color } from '../../../../styles'
import styles from '../../styles'
import { SMap } from 'imobile_for_reactnative'
import MTBtn from '../../../../components/mapTools/MT_Btn'
import FileTools from '../../../../native/FileTools'

export default class MapCutDS extends React.Component {
  props: {
    navigation: Object,
  }

  constructor(props) {
    super(props)
    let { params } = this.props.navigation.state
    this.state = {
      data: params ? params.data : [],
    }

    this.currentUser = params && params.currentUser
    this.cb = params && params.cb

    this.changeDSData = null
  }

  newDatasource = async () => {
    let homeDir = await FileTools.getHomeDirectory()
    NavigationService.navigate('InputPage', {
      headerTitle: '新建数据源',
      cb: async value => {
        let params = {
          alias: value,
          engineType: 219,
          server: `${homeDir}/iTablet/User/${
            this.currentUser.userName
          }/Data/Datasource/${value}.udb`,
        }
        await SMap.createDatasource(params)
        SMap.getDatasources().then(data => {
          this.setState(
            {
              data,
            },
            () => {
              NavigationService.goBack()
            },
          )
        })
      },
    })
  }
  renderDSItem = ({ item, index }) => {
    return (
      <TouchableOpacity
        style={styles.dsItem}
        onPress={() => {
          this.cb && this.cb({ item, index })
          NavigationService.goBack()
        }}
        activeOpacity={1}
      >
        <Image
          resizeMode="contain"
          style={styles.dsItemIcon}
          source={require('../../../../assets/Mine/mine_my_online_data.png')}
        />
        <Text style={styles.dsItemText}>{item.alias}</Text>
      </TouchableOpacity>
    )
  }

  render() {
    return (
      <Container
        ref={ref => (this.container = ref)}
        style={styles.container}
        headerProps={{
          title: '地图裁剪',
          navigation: this.props.navigation,
          headerRight: [
            <MTBtn
              key={'newDatasource'}
              title={'新建数据源'}
              textStyle={styles.headerBtnTitle}
              onPress={this.newDatasource}
            />,
          ],
        }}
      >
        <FlatList
          data={this.state.data}
          style={styles.dsListView}
          renderItem={this.renderDSItem}
          keyExtractor={item => item.alias}
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
        {/*<PopModal*/}
        {/*ref={ref => (this.popModal = ref)}*/}
        {/*onCloseModal={this.newDatasource}>*/}
        {/*<View style={{*/}
        {/*flex:1,*/}
        {/*height:scaleSize(200),*/}
        {/*backgroundColor:color.background,*/}
        {/*justifyContent:'flex-end',*/}
        {/*}}>*/}
        {/*<View*/}
        {/*style={{*/}
        {/*flex:1,*/}
        {/*height:scaleSize(80),*/}
        {/*flexDirection: 'row',*/}
        {/*justifyContent:'space-between',*/}
        {/*paddingHorizontal: scaleSize(20),*/}
        {/*}}>*/}
        {/*<Text>取消</Text>*/}
        {/*<Text>确定</Text>*/}
        {/*</View>*/}
        {/*<TextInput*/}
        {/*style={{*/}
        {/*height:scaleSize(80),*/}
        {/*}}*/}
        {/*/>*/}
        {/*</View>*/}
        {/*</PopModal>*/}
      </Container>
    )
  }
}
