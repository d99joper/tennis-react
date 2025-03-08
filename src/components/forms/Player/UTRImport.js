import React, { useState } from "react";
import { IconButton, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, Button } from "@mui/material";
import { CiImport } from "react-icons/ci";
import { matchAPI, playerAPI } from "api/services"; // Ensure the correct import

const UTRImportButton = ({utr_id, callback}) => {
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  const handleConfirm = async () => {
    setLoading(true);
    try {
      await matchAPI.importFromUTR(utr_id);
      if(callback) callback()
    } catch (error) {
      console.error("Error importing from UTR:", error);
    }
    setLoading(false);
    handleClose();
  };

  return (
    <>
      {/* Import Button */}
      <IconButton onClick={handleOpen}>
        <CiImport /> 
      </IconButton>Import UTR matches

      {/* Confirmation Dialog */}
      <Dialog open={open} onClose={handleClose}>
        <DialogTitle>Confirm Import</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Are you sure you want to import from UTR? This action cannot be undone.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose} color="secondary">
            Cancel
          </Button>
          <Button onClick={handleConfirm} color="primary" disabled={loading}>
            {loading ? "Importing..." : "Confirm"}
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
};

export default UTRImportButton;
