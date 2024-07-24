import React from 'react';
import { 
  StyleSheet, 
  ScrollView,
  SafeAreaView, 
} from 'react-native';

const Container = ({children}) => {
    return (
        <SafeAreaView  style={styles.SAVContainer}>
            <ScrollView style={styles.scrollview} alwaysBounceVertical={false}>
                {React.Children.map(children, (child) => 
                    React.cloneElement(child, {
                        style: [child.props.style],
                    })
                )}

            </ScrollView>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    SAVContainer: {
        backgroundColor: 'rgb(250,250,250)',
        flex: 1
    },
});

export default Container;