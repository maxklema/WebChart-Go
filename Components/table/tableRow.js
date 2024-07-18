import React from 'react';
import { StyleSheet, Text, View } from 'react-native';

const TableRow = ({ data, dataLength, indexMain }) => {
  return (
    <View style={[
        indexMain === 0 && styles.firstRow,
        indexMain === dataLength-1 && styles.lastRow,
        (indexMain != 0 && indexMain != dataLength - 1) && styles.row,
        ]}>
      {data.map((cell, index) => (
        <View key={index} style={index === 0 ? styles.key : styles.value}>
          <Text style={index === 0 ? styles.key_text : styles.value_text}>{cell.length != 0 ? cell : "--"}</Text>
        </View>
      ))}
    </View>
  );
};

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    borderBottomWidth: 0.5,
    borderColor: '#dedede',
    backgroundColor: 'white',
    justifyContent: 'space-between',
    paddingHorizontal: '5%',
    paddingVertical: '3%',
    alignItems: 'center'
  },
  firstRow: {
    flexDirection: 'row',
    borderBottomWidth: 0.5,
    borderColor: '#dedede',
    backgroundColor: 'white',
    justifyContent: 'space-between',
    paddingHorizontal: '5%',
    paddingVertical: '3%',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    alignItems: 'center'
  },
  lastRow: {
    flexDirection: 'row',
    backgroundColor: 'white',
    border: 'none',
    borderWidth: 0,
    justifyContent: 'space-between',
    paddingHorizontal: '5%',
    paddingVertical: '3%',
    borderBottomLeftRadius: 20,
    borderBottomRightRadius: 20,
    alignItems: 'center'
  },
  key_text: {
    color: 'black',
    fontSize: 17
  },
  value_text: {
    color: 'rgb(125,125,125)',
    fontSize: 17
  },
  value: {
    display: 'flex',
    maxWidth: '60%',
  },
  key: {
    display: 'flex',
    maxWidth: '50%',
  }
});

export default TableRow;