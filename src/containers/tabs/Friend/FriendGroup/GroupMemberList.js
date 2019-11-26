import React, { Component } from 'react'
import {
  Text,
  View,
  TouchableOpacity,
  FlatList,
  ScrollView,
} from 'react-native'
import { scaleSize } from '../../../../utils'
import TouchableItemView from '../TouchableItemView'
import Container from '../../../../components/Container'
import NavigationService from '../../../NavigationService'
import FriendListFileHandle from '../FriendListFileHandle'
import { getLanguage } from '../../../../language/index'

class GroupMemberList extends Component {
  props: {
    navigation: Object,
  }

  constructor(props) {
    super(props)

    this.friend = this.props.navigation.getParam('friend')
    this.user = this.props.navigation.getParam('user')
    this.language = this.props.navigation.getParam('language')
    this.groupID = this.props.navigation.getParam('groupID')
    this.mode = this.props.navigation.getParam('mode')
    this.CallBack = this.props.navigation.getParam('cb')
    this.state = {
      contacts: this.getGroupMembers(),
      selectArr: [],
    }
  }

  getGroupMembers = () => {
    return FriendListFileHandle.readGroupMemberList(this.groupID)
  }

  _selectItem = item => {
    let selectArr = [...this.state.selectArr]
    let n = -1
    for (let i = 0; i < selectArr.length; i++) {
      if (item.id === selectArr[i].id) {
        n = i
        break
      }
    }
    if (n !== -1) {
      selectArr.splice(n, 1)
    } else {
      selectArr.push({ id: item.id, name: item.name })
    }

    this.setState({ selectArr })
  }

  render() {
    let nSelect =
      getLanguage(this.language).Friends.CONFIRM2 +
      '(' +
      this.state.selectArr.length +
      ')'
    return (
      <Container
        ref={ref => (this.container = ref)}
        headerProps={{
          withoutBack: false,
          navigation: this.props.navigation,
          headerRight:
            this.mode === 'view' ? null : (
              <TouchableOpacity
                onPress={() => {
                  if (this.state.selectArr.length === 0) return
                  if (this.mode === 'select') {
                    this.CallBack && this.CallBack(this.state.selectArr)
                  }
                  NavigationService.goBack()
                }}
              >
                <Text
                  style={{
                    color: 'white',
                    fontSize: scaleSize(25),
                    textAlign: 'center',
                  }}
                >
                  {nSelect}
                </Text>
              </TouchableOpacity>
            ),
        }}
      >
        {this.renderMembers()}
      </Container>
    )
  }

  renderMembers = () => {
    return (
      <ScrollView>
        <FlatList
          style={{
            top: scaleSize(10),
          }}
          data={this.state.contacts}
          renderItem={this._renderMemberItem}
          keyExtractor={(item, index) => index.toString()}
        />
      </ScrollView>
    )
  }

  _renderMemberItem = ({ item }) => {
    return (
      <TouchableItemView
        text={item.name}
        disableTouch={
          this.mode === 'select' && this.user.userId === item.id ? true : false
        }
        renderRight={() => {
          if (this.mode === 'select') {
            let bSelected = false
            for (let i = 0; i < this.state.selectArr.length; i++) {
              if (item.id === this.state.selectArr[i].id) {
                bSelected = true
                break
              }
            }
            return (
              <View style={{ marginRight: scaleSize(40) }}>
                {bSelected ? <Text>√</Text> : null}
              </View>
            )
          }
        }}
        onPress={() => {
          if (this.mode === 'select') {
            this._selectItem(item)
          }
        }}
      />
    )
  }
}

export default GroupMemberList
