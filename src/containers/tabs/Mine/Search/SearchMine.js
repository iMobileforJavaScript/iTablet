import React, { Component } from 'react'
import { Container } from '../../../../components'
class SearchMine extends Component {
  props: {
    navigation: Object,
    user: Object,
  }

  constructor(props) {
    super(props)
    const { params } = this.props.navigation.state
    this.searchText = params.searchText
    this.state = {
      resultList: [],
    }
  }

  render() {
    return (
      <Container
        headerProps={{
          title: '搜索',
          withoutBack: false,
          navigation: this.props.navigation,
        }}
      ></Container>
    )
  }
}

export default SearchMine
