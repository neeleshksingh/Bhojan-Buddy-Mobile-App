import React from 'react';
import { View, StyleSheet } from 'react-native';
import { Title, Text } from 'react-native-paper';
import * as Animatable from 'react-native-animatable';

const OrderScreen: React.FC = () => {
  return (
    <View style={styles.container}>
      <Animatable.View animation="zoomIn" duration={1000}>
        <Title style={styles.title}>Order Confirmed!</Title>
        <Text style={styles.subtitle}>Your food will be delivered in 20-30 minutes.</Text>
      </Animatable.View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#fff' },
  title: { fontSize: 28, color: '#ff5722', textAlign: 'center' },
  subtitle: { fontSize: 16, color: '#555', textAlign: 'center' },
});

export default OrderScreen;