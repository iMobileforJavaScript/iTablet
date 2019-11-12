import { Navigator_Label } from './Navigator'
import { Map_Module } from './Map_module'
import { Profile } from './Profile'
import { Friends } from './Friends'
import * as Analyst from './Analyst'

import * as Map from './Map'
import { Prompt } from './Prompt'
import { Protocol } from './Common'

export default {
  Navigator_Label: Navigator_Label,
  Map_Module: Map_Module,
  Profile: Profile,
  ...Map,
  Prompt: Prompt,
  Friends: Friends,
  ...Analyst,
  Protocol: Protocol,
}
