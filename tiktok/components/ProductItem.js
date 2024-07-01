import React from 'react';
import { StyleSheet, View } from 'react-native';
import { ThemedText } from './ThemedText';
import { ThemedView } from './ThemedView';
import { TouchableOpacity } from 'react-native';

export const ProductItem = ({ item, onPress }) => {
    return (
        <TouchableOpacity onPress={() => onPress(item)} style={styles.item}>
            <ThemedView style={styles.contentContainer}>
                <View style={styles.nameContainer}>
                    <ThemedText style={styles.itemName} numberOfLines={3} ellipsizeMode="tail">
                        {item.name}
                    </ThemedText>
                </View>
                <View style={styles.infoContainer}>
                    <ThemedText style={styles.itemPrice}>${item.price}</ThemedText>
                    <ThemedText style={styles.itemSold}>{item.unitsSold} Sold</ThemedText>
                </View>
            </ThemedView>
        </TouchableOpacity>
    );
};

const styles = StyleSheet.create({
    item: {
        flexBasis: '47%',
        margin: 6,
        padding: 10,
        backgroundColor: '#fff',
        borderRadius: 10,
        elevation: 1,
        height: 100, // Fixed height for the entire item
    },
    contentContainer: {
        flex: 1,
        justifyContent: 'space-between',
    },
    nameContainer: {
        flex: 1, // This allows the name container to flex
        justifyContent: 'center',
    },
    itemName: {
        fontSize: 16,
        fontWeight: 'bold',
        textAlign: 'center',
    },
    infoContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginTop: 10,
    },
    itemPrice: {
        fontSize: 14,
        fontWeight: 'bold',
        color: '#888',
    },
    itemSold: {
        fontSize: 12,
        color: '#888',
    },
});