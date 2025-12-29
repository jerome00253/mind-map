import {
  fontSizeList,
  colorList,
  borderWidthList,
  borderRadiusList,
  lineWidthList,
  lineHeightList,
  store,
  langList,
  shapeListMap,
  lineStyleMap,
  fontFamilyList as fontFamilyListZh,
  borderDasharrayList as borderDasharrayListZh,
  lineStyleList as lineStyleListZh,
  rootLineKeepSameInCurveList as rootLineKeepSameInCurveListZh,
  backgroundRepeatList as backgroundRepeatListZh,
  backgroundPositionList as backgroundPositionListZh,
  shortcutKeyList as shortcutKeyListZh,
  shapeList as shapeListZh,
  sidebarTriggerList as sidebarTriggerListZh,
  backgroundSizeList as backgroundSizeListZh,
  downTypeList as downTypeListZh,
  numberTypeList as numberTypeListZh,
  numberLevelList as numberLevelListZh,
  linearGradientDirList as linearGradientDirListZh,
  alignList as alignListZh,
  layoutGroupList as layoutGroupListZh
} from './zh'
import {
  fontFamilyList as fontFamilyListEn,
  borderDasharrayList as borderDasharrayListEn,
  lineStyleList as lineStyleListEn,
  rootLineKeepSameInCurveList as rootLineKeepSameInCurveListEn,
  backgroundRepeatList as backgroundRepeatListEn,
  backgroundPositionList as backgroundPositionListEn,
  shortcutKeyList as shortcutKeyListEn,
  shapeList as shapeListEn,
  sidebarTriggerList as sidebarTriggerListEn,
  backgroundSizeList as backgroundSizeListEn,
  downTypeList as downTypeListEn,
  numberTypeList as numberTypeListEn,
  numberLevelList as numberLevelListEn,
  linearGradientDirList as linearGradientDirListEn,
  alignList as alignListEn,
  layoutGroupList as layoutGroupListEn
} from './en'
import {
  fontFamilyList as fontFamilyListZhtw,
  borderDasharrayList as borderDasharrayListZhtw,
  lineStyleList as lineStyleListZhtw,
  rootLineKeepSameInCurveList as rootLineKeepSameInCurveListZhtw,
  backgroundRepeatList as backgroundRepeatListZhtw,
  backgroundPositionList as backgroundPositionListZhtw,
  shortcutKeyList as shortcutKeyListZhtw,
  shapeList as shapeListZhtw,
  sidebarTriggerList as sidebarTriggerListZhtw,
  backgroundSizeList as backgroundSizeListZhtw,
  downTypeList as downTypeListZhtw,
  numberTypeList as numberTypeListZhtw,
  numberLevelList as numberLevelListZhtw,
  linearGradientDirList as linearGradientDirListZhtw,
  alignList as alignListZhtw,
  layoutGroupList as layoutGroupListZhtw
} from './zhtw'
import {
  fontFamilyList as fontFamilyListVi,
  borderDasharrayList as borderDasharrayListVi,
  lineStyleList as lineStyleListVi,
  rootLineKeepSameInCurveList as rootLineKeepSameInCurveListVi,
  backgroundRepeatList as backgroundRepeatListVi,
  backgroundPositionList as backgroundPositionListVi,
  shortcutKeyList as shortcutKeyListVi,
  shapeList as shapeListVi,
  sidebarTriggerList as sidebarTriggerListVi,
  backgroundSizeList as backgroundSizeListVi,
  downTypeList as downTypeListVi,
  numberTypeList as numberTypeListVi,
  numberLevelList as numberLevelListVi,
  linearGradientDirList as linearGradientDirListVi,
  alignList as alignListVi,
  layoutGroupList as layoutGroupListVi
} from './vi'
import {
  fontFamilyList as fontFamilyListFr,
  borderDasharrayList as borderDasharrayListFr,
  lineStyleList as lineStyleListFr,
  rootLineKeepSameInCurveList as rootLineKeepSameInCurveListFr,
  backgroundRepeatList as backgroundRepeatListFr,
  backgroundPositionList as backgroundPositionListFr,
  shortcutKeyList as shortcutKeyListFr,
  shapeList as shapeListFr,
  sidebarTriggerList as sidebarTriggerListFr,
  backgroundSizeList as backgroundSizeListFr,
  downTypeList as downTypeListFr,
  numberTypeList as numberTypeListFr,
  numberLevelList as numberLevelListFr,
  linearGradientDirList as linearGradientDirListFr,
  alignList as alignListFr,
  layoutGroupList as layoutGroupListFr
} from './fr'

const fontFamilyList = {
  zh: fontFamilyListZh,
  en: fontFamilyListEn,
  zhtw: fontFamilyListZhtw,
  vi: fontFamilyListVi,
  fr: fontFamilyListFr
}

const borderDasharrayList = {
  zh: borderDasharrayListZh,
  en: borderDasharrayListEn,
  zhtw: borderDasharrayListZhtw,
  vi: borderDasharrayListVi,
  fr: borderDasharrayListFr
}

const lineStyleList = {
  zh: lineStyleListZh,
  en: lineStyleListEn,
  zhtw: lineStyleListZhtw,
  vi: lineStyleListVi,
  fr: lineStyleListFr
}

const rootLineKeepSameInCurveList = {
  zh: rootLineKeepSameInCurveListZh,
  en: rootLineKeepSameInCurveListEn,
  zhtw: rootLineKeepSameInCurveListZhtw,
  vi: rootLineKeepSameInCurveListVi,
  fr: rootLineKeepSameInCurveListFr
}

const backgroundRepeatList = {
  zh: backgroundRepeatListZh,
  en: backgroundRepeatListEn,
  zhtw: backgroundRepeatListZhtw,
  vi: backgroundRepeatListVi,
  fr: backgroundRepeatListFr
}

const backgroundPositionList = {
  zh: backgroundPositionListZh,
  en: backgroundPositionListEn,
  zhtw: backgroundPositionListZhtw,
  vi: backgroundPositionListVi,
  fr: backgroundPositionListFr
}

const backgroundSizeList = {
  zh: backgroundSizeListZh,
  en: backgroundSizeListEn,
  zhtw: backgroundSizeListZhtw,
  vi: backgroundSizeListVi,
  fr: backgroundSizeListFr
}

const shortcutKeyList = {
  zh: shortcutKeyListZh,
  en: shortcutKeyListEn,
  zhtw: shortcutKeyListZhtw,
  vi: shortcutKeyListVi,
  fr: shortcutKeyListFr
}

const shapeList = {
  zh: shapeListZh,
  en: shapeListEn,
  zhtw: shapeListZhtw,
  vi: shapeListVi,
  fr: shapeListFr
}

const sidebarTriggerList = {
  zh: sidebarTriggerListZh,
  en: sidebarTriggerListEn,
  zhtw: sidebarTriggerListZhtw,
  vi: sidebarTriggerListVi,
  fr: sidebarTriggerListFr
}

const downTypeList = {
  zh: downTypeListZh,
  en: downTypeListEn,
  zhtw: downTypeListZhtw,
  vi: downTypeListVi,
  fr: downTypeListFr
}

const numberTypeList = {
  zh: numberTypeListZh,
  en: numberTypeListEn,
  zhtw: numberTypeListZhtw,
  vi: numberTypeListVi,
  fr: numberTypeListFr
}

const numberLevelList = {
  zh: numberLevelListZh,
  en: numberLevelListEn,
  zhtw: numberLevelListZhtw,
  vi: numberLevelListVi,
  fr: numberLevelListFr
}

const linearGradientDirList = {
  zh: linearGradientDirListZh,
  en: linearGradientDirListEn,
  zhtw: linearGradientDirListZhtw,
  vi: linearGradientDirListVi,
  fr: linearGradientDirListFr
}

const alignList = {
  zh: alignListZh,
  en: alignListEn,
  zhtw: alignListZhtw,
  vi: alignListVi,
  fr: alignListFr
}

const layoutGroupList = {
  zh: layoutGroupListZh,
  en: layoutGroupListEn,
  zhtw: layoutGroupListZhtw,
  vi: layoutGroupListVi,
  fr: layoutGroupListFr
}

export {
  fontSizeList,
  borderWidthList,
  borderRadiusList,
  lineWidthList,
  lineHeightList,
  store,
  colorList,
  langList,
  fontFamilyList,
  borderDasharrayList,
  lineStyleList,
  lineStyleMap,
  rootLineKeepSameInCurveList,
  backgroundRepeatList,
  backgroundPositionList,
  backgroundSizeList,
  shortcutKeyList,
  shapeList,
  shapeListMap,
  sidebarTriggerList,
  downTypeList,
  numberTypeList,
  numberLevelList,
  linearGradientDirList,
  alignList,
  layoutGroupList
}
