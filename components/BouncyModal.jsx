import { modalStyles as styles } from '../styles/modalStyles';
import { Modal, View, Text, Pressable } from 'react-native';

export default function BouncyModal({ visibleBouncy, onCloseBouncy }) {
  return (
    <Modal
      animationType="fade"
      transparent={true}
      visible={visibleBouncy}
      onRequestClose={onCloseBouncy}
    >
      <View style={styles.modalOverlay}>
        <View style={styles.modalContent}>
          <Text style={styles.title}>Modo Bouncy</Text>
          <Text style={styles.message}>¡Muy pronto!!!</Text>

          <Pressable style={styles.dialogBtn} onPress={onCloseBouncy}>
            <Text style={styles.dialogBtnText}>
              Volver <Text style={{ fontSize: 16 }}>↩</Text>
            </Text>
          </Pressable>
        </View>
      </View>
    </Modal>
  );
}
