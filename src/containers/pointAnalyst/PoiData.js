/**
 * Copyright © SuperMap. All rights reserved.
 * Author: Asort
 * https://github.com/AsortKeven
 */
import { getLanguage } from '../../language'
import { getThemeAssets } from '../../assets'

const PoiData = () => [
  {
    title: getLanguage(GLOBAL.language).Map_PoiTitle.FOOD,
    icon: getThemeAssets().search.search_icon_food,
  },
  {
    title: getLanguage(GLOBAL.language).Map_PoiTitle.SCENE,
    icon: getThemeAssets().search.search_icon_scenic,
  },
  {
    title: getLanguage(GLOBAL.language).Map_PoiTitle.BANK,
    icon: getThemeAssets().search.search_icon_bank,
  },
  {
    title: getLanguage(GLOBAL.language).Map_PoiTitle.SUPERMARKET,
    icon: getThemeAssets().search.search_icon_market,
  },
  {
    title: getLanguage(GLOBAL.language).Map_PoiTitle.HOTEL,
    icon: getThemeAssets().search.search_icon_hotel,
  },
  {
    title: getLanguage(GLOBAL.language).Map_PoiTitle.TOILET,
    icon: getThemeAssets().search.search_icon_toilet,
  },
  {
    title: getLanguage(GLOBAL.language).Map_PoiTitle.BUS_STOP,
    icon: getThemeAssets().search.search_icon_bus,
  },
  {
    title: getLanguage(GLOBAL.language).Map_PoiTitle.PARKING_LOT,
    icon: getThemeAssets().search.search_icon_park,
  },
  {
    title: getLanguage(GLOBAL.language).Map_PoiTitle.HOSPITAL,
    icon: getThemeAssets().search.search_icon_hospital,
  },
  {
    title: getLanguage(GLOBAL.language).Map_PoiTitle.GAS_STATION,
    icon: getThemeAssets().search.search_icon_gas_station,
  },
  {
    title: getLanguage(GLOBAL.language).Map_PoiTitle.MARKET,
    icon: getThemeAssets().search.search_icon_mall,
  },
  {
    title: getLanguage(GLOBAL.language).Map_PoiTitle.SUBWAY,
    icon: getThemeAssets().search.search_icon_subway,
  },
]

export default PoiData
