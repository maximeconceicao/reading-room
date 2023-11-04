import * as React from 'react';

import SimpleDialog from '../../components/SimpleDialog';

const SimpleDialogContext = React.createContext<{
  openSimpleDialog: (title: string, contentText: string, onClose?: () => void, onConfirm?: () => void) => void;
}>({ openSimpleDialog: () => {} });

const SimpleDialogProvider = ({ children }: { children: React.ReactNode }) => {
  const [state, setState] = React.useState<{
    isOpen: boolean;
    dialogTitle: string;
    dialogContentText: string;
    beforeClose: () => void;
    handleConfirm: () => void;
  }>({
    isOpen: false,
    dialogTitle: '',
    dialogContentText: '',
    beforeClose: () => {},
    handleConfirm: () => {},
  });

  const openSimpleDialog = (
    title: string,
    contentText: string,
    onClose: () => void | undefined = () => {},
    onConfirm: () => void | undefined = () => {},
  ) => {
    setState({
      isOpen: true,
      dialogTitle: title,
      dialogContentText: contentText,
      beforeClose: onClose,
      handleConfirm: onConfirm,
    });
  };

  const closeSimpleDialog = () => {
    if (typeof state.beforeClose === 'function') {
      state.beforeClose();
    }
    setState({
      ...state,
      isOpen: false,
    });
  };

  return (
    <SimpleDialogContext.Provider value={{ openSimpleDialog }}>
      {children}
      <SimpleDialog
        dialogTitle={state.dialogTitle}
        dialogContentText={state.dialogContentText}
        isOpen={state.isOpen}
        handleClose={closeSimpleDialog}
        handleConfirm={state.handleConfirm}
      />
    </SimpleDialogContext.Provider>
  );
};

export { SimpleDialogContext, SimpleDialogProvider };
