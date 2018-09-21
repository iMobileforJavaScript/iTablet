import React, { Component } from 'react'
import { StyleSheet, TouchableOpacity, Text, View, Image, FlatList ,Dimensions} from 'react-native'
import { Container, EmptyView, MTBtn } from '../../../components'
import { Toast, scaleSize } from '../../../utils'
import{ AlertDialog} from '../../mapView/componets/AlertDialog'
const SCREEN_WIDTH = Dimensions.get('window').width
const IMAGE_WIDTH=SCREEN_WIDTH*0.87
export default class CloudService extends Component {

  props: {
    navigation: Object,
    image: any,
  }
  constructor(props) {
    super(props)
    this.state = {
      showData: true,
      data: [
        {
          image: '',
          itemTitle: "世界地图",
          uploadTime: '修改时间：2018-9-14',
        },
      ],
    }
  }


  componentDidMount() {
    // this.container.setLoading(false)
    
    // this.AlertDialog.getData(data)
    this.AlertDialog.setDialogVisible(true)
  }

  getdata = async () => {
      console.log("aaa")
  }

  _keyExtractor = item => {
    return item
  }

  itemSeparator() {
    return (<View style={styles.itemSeparator}></View>)
  }

  renderItem({ item }) {
    return (
      <View style={styles.item}>
        <Image source={require('../../../assets/public/beijing.png')} style={styles.itemImage} />
        <Text style={styles.itemTitle}>{item.itemTitle}</Text>
        <View style={styles.itemBottom}>
          <Text style={styles.upLoadtime}>{item.uploadTime}</Text>
          <TouchableOpacity style={styles.itmeBtn1}>
            <Image source={require('../../../assets/public/下载-选中.png') } style={styles.btnImage}/>
          </TouchableOpacity>
          <TouchableOpacity style={styles.itmeBtn2}>
            <Image source={require('../../../assets/public/分享.png')} style={styles.btnImage}/>
          </TouchableOpacity>
        </View>
      </View>)

  }


     


  render() {
    return (
      <Container
        style={styles.container}
        ref={ref => this.container = ref}
        // initWithLoading
        headerProps={{
          title: '云服务',
          navigation: this.props.navigation,
          headerRight: [
            // <MTBtn key={'upload'} image={require('../../../assets/public/上传.png')} imageStyle={styles.upload}
            //   BtnClick={this.upload} />
          ],
          withoutBack: true,
        }}>
         {/* <View style={styles.search}>

         </View>
         <FlatList
          ItemSeparatorComponent={this.itemSeparator}
          style={styles.dataList}
          data={this.state.data}
          renderItem={this.renderItem}
          keyExtractor={this._keyExtractor}
        /> */}
      <EmptyView title={'待完善'} />
      </Container>

    )
  }
}
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F1F1F1',
  },
  upload: {
    width: scaleSize(40),
    height: scaleSize(40),
    marginRight: scaleSize(20)
  },
  search:{
    width:SCREEN_WIDTH,
    height: scaleSize(10),
  },
  itemSeparator: {
    height: scaleSize(15),
  },
  dataList: {
    flex: 1,
  },
  item: {
    width: SCREEN_WIDTH,
    height: scaleSize(365),
    backgroundColor:"white",
    alignItems: 'center',
  },
  itemImage: {
   width:IMAGE_WIDTH,
   height: scaleSize(250),
   backgroundColor:"blue"
  },
  itemTitle:{
    width:IMAGE_WIDTH,
    height: scaleSize(60),
    fontSize:scaleSize(40),
    color:"black",
    textAlignVertical:'center',

   },
  itemBottom: {
    width:IMAGE_WIDTH,
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  upLoadtime: {
    width: scaleSize(540),
    height: scaleSize(45),
    fontSize:scaleSize(25),
    textAlignVertical:'center',
  },
  itmeBtn1: {
    width: scaleSize(45),
    height: scaleSize(45),
  },
  itmeBtn2: {
    width: scaleSize(45),
    height: scaleSize(45),
    paddingRight:scaleSize(15),
    marginRight:scaleSize(40),
  },
  btnImage:{
    width: scaleSize(45),
    height: scaleSize(45),
  },
})
