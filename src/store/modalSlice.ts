import { createSlice, type PayloadAction } from '@reduxjs/toolkit';

export interface ModalState {
  isOpen: boolean;
  isPending: boolean;
  modalId: string;
  modalType: string | null;
  data: {
    title: string;
    description: string;
    submitLabel?: string;
    cancelLabel: string;
    extraData?: any;
    customButtons?: { label: string, onClick: () => void }[];
    icon: 'Users' | 'Tag' | 'Settings' | null; // Use a string key
  };
}

const initialState: ModalState = {
  isOpen: false,
  isPending: false,
  modalId: '100',
  modalType: null,
  data: {
    title: '',
    icon: null,
    description: '',
    cancelLabel: 'Cancel',
  },
};

const modalSlice = createSlice({
  name: 'modal',
  initialState,
  reducers: {
    openModal: (state, action: PayloadAction<{
      modalType: string;
      modalId?: string;
      data: Partial<ModalState['data']>
    }>) => {
      state.isOpen = true;
      state.modalType = action.payload.modalType;
      state.modalId = action.payload.modalId || '100';
      state.data = {
        ...initialState.data,
        ...action.payload.data,
      };
    },
    closeModal: (state) => {
      state.isOpen = false;
      state.modalType = null;
      state.isPending = false;
    },
    setPending: (state, action: PayloadAction<boolean>) => {
      state.isPending = action.payload;
    },
  },
});

export const { openModal, closeModal, setPending } = modalSlice.actions;
export default modalSlice.reducer;
