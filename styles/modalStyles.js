import { StyleSheet } from 'react-native';

export const modalStyles = StyleSheet.create({
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 24,
    alignItems: 'center',
    width: 280,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.4,
    shadowRadius: 16,
    elevation: 10,
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 12,
  },
  message: {
    fontSize: 16,
    marginBottom: 24,
    textAlign: 'center',
  },
  dialogBtn: {
    backgroundColor: '#48c774',
    borderRadius: 8,
    paddingVertical: 10,
    paddingHorizontal: 20,
  },
  dialogBtnText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
  },
    modalImage: {
    width: 250,
    height: 250,
    borderRadius: 8,
    marginBottom: 20,
  },
});
