import React, { Component } from 'react'
import { TextInput, TouchableOpacity, Text, StyleSheet } from 'react-native'
import { Container } from '../../../../components'
import { color, size } from '../../../../styles'
import NavigationService from '../../../NavigationService'
import { Toast } from '../../../../utils'
import { language, getLanguage } from '../../../../language';
export default class LoadServer extends Component {
  props: {
    navigation: Object,
  }
  constructor(props) {
    super(props)
    const { params } = this.props.navigation.state
    this.baseMaps = params.baseMaps || []
    this.setBaseMap = params.setBaseMap
    this.state = {
      server: '',
      name: '',
    }
  }

  _renderHeaderBtn = () => {
    return (
      <TouchableOpacity
        onPress={() => {
          try {
            if (this.state.name === '') {
              Toast.show('请输入底图名称')
              return
            }
            if (this.state.server === '') {
              Toast.show('请输入服务地址')
              return
            }
            let item = {
              type: 'Datasource',
              DSParams: {
                server: this.state.server,
                engineType: 225,
                alias: 'BaseMap',
              },
              layerIndex: 0,
              mapName: this.state.name,
            }
            let list = this.baseMaps
            list.push(item)
            this.setBaseMap && this.setBaseMap(list)
            NavigationService.goBack()
          } catch (error) {
            Toast.show('保存失败')
          }

          // console.log(this.props.navigation.state)
        }}
      >
        <Text style={styles.text}>
        {getLanguage(global.language).Profile.SAVE}
          
        {/* {'保存'} */}
        </Text>
      </TouchableOpacity>
    )
  }

  render() {
    return (
      <Container
        ref={ref => (this.container = ref)}
        headerProps={{
          title: getLanguage(global.language).Profile.SERVICE_ADDRESS,
          //'服务地址',
          navigation: this.props.navigation,
          headerRight: this._renderHeaderBtn(),
        }}
      >
        <TextInput
          placeholder={getLanguage(global.language).Profile.MAP_NAME}
          // {'地图名称'}
          style={styles.textInput}
          ref={ref => (this.name = ref)}
          onChangeText={text => this.setState({ name: text })}
        />
        <TextInput
          placeholder={getLanguage(global.language).Profile.ENTER_SERVICE_ADDRESS}
          //{'请输入服务地址'}
          style={[styles.textInput, { marginTop: 20 }]}
          ref={ref => (this.server = ref)}
          onChangeText={text => this.setState({ server: text })}
        />
      </Container>
    )
  }
}

const styles = StyleSheet.create({
  textInput: {
    fontSize: size.fontSize.fontSizeMd,
    margin: 15,
    padding: 10,
    borderWidth: 1,
    borderColor: color.bgG,
  },
  text: {
    fontSize: size.fontSize.fontSizeLg,
    color: color.reverseTheme,
  },
})
