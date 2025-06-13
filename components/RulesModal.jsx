import { useNavigation } from '@react-navigation/native';
import { modalStyles as styles } from '../styles/modalStyles';
import { Modal, View, Text, Image, Pressable } from 'react-native';

export default function RulesModal({ visible, onClose }) {
  const navigation = useNavigation();
  return (
    <Modal
      animationType="fade"
      transparent={true}
      visible={visible}
      onRequestClose={onClose}
    >
      <View style={styles.modalOverlay}>
        <View style={styles.modalContent}>
          <Image
            source={require('../assets/rules-classic.png')}
            style={styles.modalImage}
            resizeMode="contain"
          />
          <Pressable style={styles.dialogBtn}
            onPress={() => {
              onClose();
              navigation.navigate('Game');
            }
            }>
            <Text style={styles.dialogBtnText}
                >¡Entendido!</Text>
          </Pressable>
        </View>
      </View>
    </Modal>
  );
}