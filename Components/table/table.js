import React from 'react';
import { StyleSheet, View } from 'react-native';
import TableRow from './tableRow';

const DataTable = ({ style, data, ...props}) => {

  return (
    <View styles={[styles.container, style]} {...props}>
      {data.map((item, index) => (
        <TableRow key={index} indexMain={index} dataLength={data.length} data={item} />
      ))}
    </View>
  );
       
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 50,
    paddingHorizontal: 10,
    borderRadius: 20,
  },
  
});

export default DataTable
