import { FieldType } from 'imobile_for_reactnative'

function getBoolean(value, defaultValue) {
  let _value
  if (value === '' && (defaultValue === '' || defaultValue === undefined)) {
    return ''
  }
  if (value === '1' || value === 'true' || value === 1 || value === true) {
    _value = true
  } else if (
    value === '0' ||
    value === 'false' ||
    value === 0 ||
    value === false
  ) {
    _value = false
  } else {
    _value = defaultValue !== '0' || defaultValue !== 'false'
  }
  return _value
}

function getInt16(value, defaultValue) {
  let _value
  if (value === '' || value === undefined || isNaN(value)) {
    if (defaultValue === '' || defaultValue === undefined) {
      return ''
    } else {
      _value =
        defaultValue !== undefined && defaultValue !== '' ? defaultValue : 0
    }
  } else {
    _value = parseInt(value)
  }
  if (_value < -32768) {
    _value = -32768
  } else if (_value > 32767) {
    _value = 32767
  }
  return _value
}

function getInt32(value, defaultValue) {
  let _value
  if (value === '' || value === undefined || isNaN(value)) {
    if (defaultValue === '' || defaultValue === undefined) {
      return ''
    } else {
      _value =
        defaultValue !== undefined && defaultValue !== '' ? defaultValue : 0
    }
  } else {
    _value = parseInt(value)
  }
  if (_value < -2147483648) {
    _value = -2147483648
  } else if (_value > 2147483647) {
    _value = 2147483647
  }
  return _value
}

function getInt64(value, defaultValue) {
  let _value
  if (value === '' || value === undefined || isNaN(value)) {
    if (defaultValue === '' || defaultValue === undefined) {
      return ''
    } else {
      _value =
        defaultValue !== undefined && defaultValue !== '' ? defaultValue : 0
    }
  } else {
    _value = parseInt(value)
  }
  if (_value < -9223372036854775808) {
    _value = -9223372036854775808
  } else if (_value > 9223372036854775807) {
    _value = 9223372036854775807
  }
  return _value
}

function getSingle(value, defaultValue) {
  let _value
  if (value === '' || value === undefined || isNaN(value)) {
    if (defaultValue === '' || defaultValue === undefined) {
      return ''
    } else {
      _value =
        defaultValue !== undefined && defaultValue !== '' ? defaultValue : 0
    }
  } else {
    _value = parseFloat(value)
  }
  if (value < -3.4e38) {
    _value = -3.4e38
  } else if (value > 3.4e38) {
    _value = 3.4e38
  }
  return _value
}

function getDouble(value, defaultValue) {
  let _value
  if (value === '' || value === undefined || isNaN(value)) {
    if (defaultValue === '' || defaultValue === undefined) {
      return ''
    } else {
      _value =
        defaultValue !== undefined && defaultValue !== '' ? defaultValue : 0
    }
  } else {
    _value = parseFloat(value)
  }
  if (value < -1.7e-308) {
    _value = -1.7e-308
  } else if (value > 1.7e308) {
    _value = 1.7e308
  }
  return _value
}

function getText(value, defaultValue) {
  let _value = value
  if (_value === '' || _value === undefined) {
    _value =
      defaultValue !== undefined && defaultValue !== '' ? defaultValue : ''
  }
  if (_value.length > 5) {
    _value = _value.substr(0, 5)
  }
  return _value
}

function getValueWithDefault(value, defaultValue, type) {
  let _value
  switch (type) {
    case FieldType.BOOLEAN:
      _value = getBoolean(value, defaultValue)
      break
    case FieldType.INT16:
      _value = getInt16(value, defaultValue)
      break
    case FieldType.INT32:
      _value = getInt32(value, defaultValue)
      break
    case FieldType.INT64:
      _value = getInt64(value, defaultValue)
      break
    case FieldType.SINGLE:
      _value = getSingle(value, defaultValue)
      break
    case FieldType.DOUBLE:
      _value = getDouble(value, defaultValue)
      break
    case FieldType.TEXT:
    default:
      _value = getText(value, defaultValue)
      break
  }
  return _value
}

function getValue(value, type) {
  let _value = getValueWithDefault(value, undefined, type)
  return _value
}

function isNumber(type) {
  return (
    type === FieldType.INT16 ||
    type === FieldType.INT32 ||
    type === FieldType.INT64 ||
    type === FieldType.SINGLE ||
    type === FieldType.DOUBLE
  )
}

function getKeyboardType(type) {
  let keyboardType
  switch (type) {
    case FieldType.INT16:
    case FieldType.INT32:
    case FieldType.INT64:
    case FieldType.SINGLE:
    case FieldType.DOUBLE:
      keyboardType = 'decimal-pad'
      break
    case FieldType.TEXT:
    case FieldType.BOOLEAN:
    default:
      keyboardType = 'default'
      break
  }
  return keyboardType
}

export default {
  getValue,
  getValueWithDefault,
  isNumber,
  getKeyboardType,
}
