const AsyncStorage =  require ('@react-native-async-storage/async-storage');

 const getData = async (key:number) => {
  try {
    const value = await AsyncStorage.getItem(key);
    if (value !== null) {
      return value;
    }
    return null;
  } catch (error) {
    console.error('Erro ao obter dados do AsyncStorage:', error);
    return null;
  }
};

 const storeData = async (key:number, value:any) => {
  try {
    await AsyncStorage.setItem(key, value);
  } catch (error) {
    console.error('Erro ao salvar dados no AsyncStorage:', error);
  }
};

 const clearAllItems = async () => {
  try {
    await AsyncStorage.clear();

  } catch (error) {
    console.error(error);
  }
};

module.exports = {
  getData,
  storeData,
  clearAllItems
}