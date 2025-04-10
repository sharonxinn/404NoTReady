import React from 'react';
import { View, TouchableOpacity, Text, StyleSheet } from 'react-native';
import i18n from 'i18next';

export default function LanguageSwitcher() {
  const changeLanguage = (lang) => {
    i18n.changeLanguage(lang);
  };

  return (
    <View style={styles.container}>
      <TouchableOpacity onPress={() => changeLanguage('en')}>
        <Text style={styles.button}>🇬🇧 EN</Text>
      </TouchableOpacity>
      <TouchableOpacity onPress={() => changeLanguage('es')}>
        <Text style={styles.button}>🇪🇸 ES</Text>
      </TouchableOpacity>
      <TouchableOpacity onPress={() => changeLanguage('zh')}>
        <Text style={styles.button}>🇨🇳 中文</Text>
      </TouchableOpacity>
      <TouchableOpacity onPress={() => changeLanguage('ms')}>
        <Text style={styles.button}>🇲🇾 MS</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    justifyContent: 'center',
    padding: 16,
    borderTopWidth: 1,
    borderColor: '#ccc',
    flexWrap: 'wrap',
  },
  button: {
    marginHorizontal: 10,
    marginVertical: 6,
    fontSize: 16,
    color: '#007bff',
  },
});
