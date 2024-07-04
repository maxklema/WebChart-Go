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
        <Text key={index} style={styles.text}>{cell.length != 0 ? cell : "--"}</Text>
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
  },
  text: {
    color: 'black',
    fontSize: '17px',
    
  }
});

export default TableRow;