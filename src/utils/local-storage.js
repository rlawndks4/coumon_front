

export const setLocalStorage = async (key_, value_) => {
  let key = key_;
  let value = value_;
  if (typeof value == 'object') {
    value = JSON.stringify(value);
  }
  await localStorage.setItem(key, value);
}

export const getLocalStorage = (key) => {
  return localStorage.getItem(key);
}

export const deleteLocalStorage = (key) => {
  return localStorage.removeItem(key);
}

