import { StackNavigator } from 'react-navigation'
import animated from './animated'
import Tabs from './tabs'
//主页
import MapLoad from './mapLoad'

//我的
import Register from './register&getBack/register'
import GetBack from './register&getBack/GetBack'

//地图加载
import LocalMap from './localMap'
//地图功能页面
import MTDataCollection from './mtDataCollection'
import MTDataManagement from './mtDataManagement'
import NewDSource from './newDSource'
import { ChooseDatasource, NewDSet } from './newDSet'
import MTLayerManager from './mtLayerManager'
import Map3DLayerManager from './map3DLayerManager'
import AnalystParams from './analystParams'
import AddLayer from './addLayer'
import ChooseEditLayer from './chooseEditLayer'
import AddDataset from './addDataset'
import AddLayerGroup from './addLayerGroup'
import MapChange from './mapChange'
import { LayerAttribute, LayerAttributeEdit, LayerAttributeAdd } from './layerAttribute'
import { ThemeEntry, ThemeEdit, ChoosePage, ThemeStyle } from './theme'
import workspaceFlieList from './workspaceFileList'
import dataSourcelist from './dataSourcelist'
import dataSets from './dataSets'
import ColorPickerPage from './colorPickerPage'

import Map from './map'
import MapView from './mapView'
import Map3D from './map3D'

export default StackNavigator({
  Tabs: {
    screen: Tabs,
    navigationOptions: {
      header: null,
    },
  },
  MapLoad: {
    screen: MapLoad,
    navigationOptions: {
      header: null,
    },
  },
  Map: {
    screen: Map,
    navigationOptions: {
      header: null,
    },
  },
  MapView: {
    screen: MapView,
    navigationOptions: {
      header: null,
    },
  },
  Map3D: {
    screen: Map3D,
    navigationOptions: {
      header: null,
    },
  },
  Register: {
    screen: Register,
    navigationOptions: {
      header: null,
    },
  },
  GetBack: {
    screen: GetBack,
    navigationOptions: {
      header: null,
    },
  },
  LocalMap: {
    screen: LocalMap,
    navigationOptions: {
      header: null,
    },
  },
  LayerManager: {
    screen: MTLayerManager,
    navigationOptions: {
      header: null,
    },
  },
  Map3DLayerManager: {
    screen: Map3DLayerManager,
    navigationOptions: {
      header: null,
    },
  },
  DataCollection: {
    screen: MTDataCollection,
    navigationOptions: {
      header: null,
    },
  },
  DataManagement: {
    screen: MTDataManagement,
    navigationOptions: {
      header: null,
    },
  },
  NewDSource: {
    screen: NewDSource,
    navigationOptions: {
      header: null,
    },
  },
  ChooseDatasource: {
    screen: ChooseDatasource,
    navigationOptions: {
      header: null,
    },
  },
  NewDSet: {
    screen: NewDSet,
    navigationOptions: {
      header: null,
    },
  },
  ChooseEditLayer: {
    screen: ChooseEditLayer,
    navigationOptions: {
      header: null,
    },
  },
  AnalystParams: {
    screen: AnalystParams,
    navigationOptions: {
      header: null,
    },
  },
  AddLayer: {
    screen: AddLayer,
    navigationOptions: {
      header: null,
    },
  },
  AddDataset: {
    screen: AddDataset,
    navigationOptions: {
      header: null,
    },
  },
  AddLayerGroup: {
    screen: AddLayerGroup,
    navigationOptions: {
      header: null,
    },
  },
  MapChange: {
    screen: MapChange,
    navigationOptions: {
      header: null,
    },
  },
  LayerAttribute: {
    screen: LayerAttribute,
    navigationOptions: {
      header: null,
    },
  },
  LayerAttributeEdit: {
    screen: LayerAttributeEdit,
    navigationOptions: {
      header: null,
    },
  },
  LayerAttributeAdd: {
    screen: LayerAttributeAdd,
    navigationOptions: {
      header: null,
    },
  },
  ThemeEntry: {
    screen: ThemeEntry,
    navigationOptions: {
      header: null,
    },
  },
  ThemeEdit: {
    screen: ThemeEdit,
    navigationOptions: {
      header: null,
    },
  },
  ChoosePage: {
    screen: ChoosePage,
    navigationOptions: {
      header: null,
    },
  },
  ThemeStyle: {
    screen: ThemeStyle,
    navigationOptions: {
      header: null,
    },
  },
  WorkspaceFlieList: {
    screen: workspaceFlieList,
    navigationOptions: {
      header: null,
    },
  },
  DataSourcelist:{
    screen:dataSourcelist,
    navigationOptions:{
      header:null,
    },
  },
  DataSets:{
    screen:dataSets,
    navigationOptions:{
      header:null,
    },
  },
  ColorPickerPage:{
    screen:ColorPickerPage,
    navigationOptions:{
      header:null,
    },
  },
  animated:{
    screen: animated,
    navigationOptions: {
      header: null,
    },
  },
},
{
  navigationOptions: {
    headerBackTitle: null,
    headerTintColor: '#333333',
    showIcon: true,
    swipeEnabled: false,
    animationEnabled: false,
    headerTitleStyle: { alignSelf: 'center' },
  },
  lazy: true,
  mode: 'card',
})