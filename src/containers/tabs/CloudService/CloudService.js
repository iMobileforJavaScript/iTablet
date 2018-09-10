import React, { Component } from 'react'
import { StyleSheet, TouchableOpacity, Text, View } from 'react-native'
import { Container, EmptyView } from '../../../components'
import { Toast, scaleSize } from '../../../utils'

export default class CloudService extends Component {

  props: {
    navigation: Object,
    image: any,
  }

  render() {
    return (
      <Container
        style={styles.container}
        headerProps={{
          title: '云服务',
          navigation: this.props.navigation,
          headerRight: [

          ],
          withoutBack: true,
        }}>
        <TouchableOpacity style={styles.headupload} onPress={() => this.upload()}>
          <View style={styles.uploadview}>
            <Text style={styles.uploadtitle}>上传</Text>
          </View>
        </TouchableOpacity>
        <EmptyView title={'待完善'} />
      </Container>
    )
  }
}
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white',
  },
  headupload: {
    
    backgroundColor: 'white',
    paddingHorizontal: scaleSize(30),
    marginTop:scaleSize(10)
  },
  uploadview: {
    width: scaleSize(120),
    height: scaleSize(70),
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: "#1296db",
    borderRadius: 20,
  },
  uploadtitle:{
    color: 'white',
    fontSize: scaleSize(28),
  }
})
