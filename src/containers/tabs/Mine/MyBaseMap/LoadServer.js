import React, { Component } from 'react'
import { TextInput, TouchableOpacity, Text, StyleSheet } from 'react-native'
import { Container } from '../../../../components'
import { color, size } from '../../../../styles'
import NavigationService from '../../../NavigationService'
import { Toast } from '../../../../utils'
import { getLanguage } from '../../../../language'
export default class LoadServer extends Component {
  props: {
    navigation: Object,
  }
  constructor(props) {
    super(props)
    const { params } = this.props.navigation.state
    this.baseMaps = params.baseMaps || []
    this.setBaseMap = params.setBaseMap
    this.user = params.user
    if (params.item) {
      //修改原来 add xiezhy
      this.item = {
        server: params.item.DSParams.server,
        name: params.item.mapName,
      }
      this.state = {
        server: params.item.DSParams.server,
        name: params.item.mapName,
      }
    } else {
      this.item = undefined
      this.state = {
        server: '',
        name: '',
      }
    }
  }

  _renderHeaderBtn = () => {
    let thisHandle = this
    return (
      <TouchableOpacity
        onPress={() => {
          try {
            if (this.state.name === '') {
              Toast.show(getLanguage(global.language).Prompt.ENTER_MAP_NAME)
              //'请输入底图名称')
              return
            }
            if (this.state.server === '') {
              Toast.show(
                getLanguage(global.language).Prompt.ENTER_SERVICE_ADDRESS,
              )
              //'请输入服务地址')
              return
            }
            let alias = this.state.name
            let layerName =
              this.state.server.substring(
                this.state.server.lastIndexOf('/') + 1,
                this.state.server.length,
              ) +
              '@' +
              alias //this.state.server.lastIndexOf('/')
            let item = {
              type: 'Datasource',
              DSParams: {
                server: this.state.server,
                engineType: 225,
                alias: alias,
              },
              layerIndex: 0,
              mapName: this.state.name,
              layerName: layerName,
              userAdd: true,
            }
            let list = this.baseMaps
            //add xiezhy
            if (thisHandle.item != undefined) {
              for (let i = 0, n = list.length; i < n; i++) {
                if (
                  list[i].DSParams.server === thisHandle.item.server &&
                  list[i].mapName === thisHandle.item.name
                ) {
                  list.splice(i, 1)
                  break
                }
              }
            }
            list.push(item)
            this.setBaseMap &&
              this.setBaseMap({
                userId: this.user.currentUser.userId,
                baseMaps: list,
              })
            NavigationService.goBack()
          } catch (error) {
            Toast.show(getLanguage(global.language).Prompt.SAVE_FAILED)
            //'保存失败')
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
          value={this.state.name}
          placeholder={getLanguage(global.language).Profile.MAP_NAME}
          // {'地图名称'}
          style={styles.textInput}
          ref={ref => (this.name = ref)}
          onChangeText={text => this.setState({ name: text })}
        />
        <TextInput
          value={this.state.server}
          placeholder={
            getLanguage(global.language).Profile.ENTER_SERVICE_ADDRESS
          }
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
