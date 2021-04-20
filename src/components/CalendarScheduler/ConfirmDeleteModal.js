import {
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Button,
  Dialog,
} from '@material-ui/core';
export default function ConfirmDeleteModal({
  toggleConfirmDeleteModal,
  confirmDeleteModalIsOpen,
  commitDeletedAppointment,
}) {
  return (
    <Dialog open={confirmDeleteModalIsOpen}>
      <DialogTitle>Delete Appointment</DialogTitle>
      <DialogContent>
        <DialogContentText>
          Are you sure you want to delete this appointment?
        </DialogContentText>
      </DialogContent>
      <DialogActions>
        <Button
          onClick={toggleConfirmDeleteModal}
          color="primary"
          variant="outlined"
        >
          Cancel
        </Button>
        <Button
          onClick={commitDeletedAppointment}
          color="secondary"
          variant="outlined"
        >
          Delete
        </Button>
      </DialogActions>
    </Dialog>
  );
}
