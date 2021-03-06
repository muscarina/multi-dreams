import {
  List,
  Typography,
  Modal,
  Box,
  ListItem,
  ListItemText,
  Divider
} from "@material-ui/core";
import { makeStyles } from "@material-ui/core/styles";
import gql from "graphql-tag";
import dayjs from "dayjs";

import SettingsListItem from "./SettingsListItem";
import SetCurrency from "./SetCurrency";
import SetGrantsPerMember from "./SetGrantsPerMember";
import SetTotalBudget from "./SetTotalBudget";
import SetGrantValue from "./SetGrantValue";
import SetDreamCreationCloses from "./SetDreamCreationCloses";
import SetGrantingCloses from "./SetGrantingCloses";
import SetGrantingOpens from "./SetGrantingOpens";

import thousandSeparator from "../../../utils/thousandSeparator";

const useStyles = makeStyles(theme => ({
  modal: {
    display: "flex",
    padding: theme.spacing(1),
    alignItems: "center",
    justifyContent: "center"
  },
  innerModal: {
    outline: "none",
    flex: "0 1 500px"
  }
}));

const modals = {
  SET_CURRENCY: SetCurrency,
  SET_DREAM_CREATION_CLOSES: SetDreamCreationCloses,
  SET_GRANTING_OPENS: SetGrantingOpens,
  SET_GRANTING_CLOSES: SetGrantingCloses,
  SET_GRANT_VALUE: SetGrantValue,
  SET_GRANTS_PER_MEMBER: SetGrantsPerMember,
  SET_TOTAL_BUDGET: SetTotalBudget
};

export const UPDATE_GRANTING_SETTINGS = gql`
  mutation updateGrantingSettings(
    $currency: String
    $grantsPerMember: Int
    $totalBudget: Int
    $grantValue: Int
    $grantingOpens: Date
    $grantingCloses: Date
    $dreamCreationCloses: Date
  ) {
    updateGrantingSettings(
      currency: $currency
      grantsPerMember: $grantsPerMember
      totalBudget: $totalBudget
      grantValue: $grantValue
      grantingOpens: $grantingOpens
      grantingCloses: $grantingCloses
      dreamCreationCloses: $dreamCreationCloses
    ) {
      id
      currency
      grantsPerMember
      totalBudget
      grantValue
      grantingOpens
      grantingCloses
      grantingIsOpen
      dreamCreationCloses
      dreamCreationIsOpen
    }
  }
`;

export default ({ event }) => {
  const [open, setOpen] = React.useState(null);

  const handleOpen = modal => {
    setOpen(modal);
  };

  const handleClose = () => {
    setOpen(null);
  };

  const classes = useStyles();

  const ModalContent = modals[open];

  const grantingHasOpened = dayjs(event.grantingOpens).isBefore(dayjs());

  return (
    <>
      <Box p={2}>
        <Typography variant="h5">Granting status</Typography>
      </Box>

      <List>
        <Divider />
        <ListItem>
          <ListItemText
            primary="Granting is"
            secondary={event.grantingIsOpen ? "OPEN" : "CLOSED"}
          />
        </ListItem>
        <Divider />
        <ListItem>
          <ListItemText
            primary="Unallocated grants in budget"
            secondary={`${event.remainingGrants} grants`}
          />
        </ListItem>
        <Divider />
        <ListItem>
          <ListItemText
            primary="Total grants in budget"
            secondary={`${event.totalBudgetGrants} grants`}
          />
        </ListItem>
        <Divider />
        <ListItem>
          <ListItemText
            primary="Grants given"
            secondary={`${event.totalBudgetGrants -
              event.remainingGrants} grants`}
          />
        </ListItem>
        <Divider />
      </List>

      <Box p={2}>
        <Typography variant="h5">Grant settings</Typography>
      </Box>
      <Modal
        aria-labelledby="simple-modal-title"
        aria-describedby="simple-modal-description"
        open={Boolean(open)}
        onClose={handleClose}
        className={classes.modal}
      >
        <div className={classes.innerModal}>
          {open && <ModalContent event={event} closeModal={handleClose} />}
        </div>
      </Modal>
      <List>
        <Divider />

        <SettingsListItem
          primary="Currency"
          secondary={event.currency}
          value={event.currency}
          disabled={!event.dreamCreationIsOpen}
          openModal={() => handleOpen("SET_CURRENCY")}
        />

        <Divider />

        <SettingsListItem
          primary="Grants per member"
          secondary={event.grantsPerMember}
          value={event.grantsPerMember}
          disabled={grantingHasOpened}
          openModal={() => handleOpen("SET_GRANTS_PER_MEMBER")}
        />

        <Divider />

        <SettingsListItem
          primary="Total budget"
          secondary={
            event.totalBudget
              ? `${thousandSeparator(event.totalBudget)} ${event.currency}`
              : "Not set"
          }
          value={event.totalBudget}
          disabled={grantingHasOpened}
          openModal={() => handleOpen("SET_TOTAL_BUDGET")}
        />

        <Divider />

        <SettingsListItem
          primary="Grant value"
          secondary={
            event.grantValue
              ? `${thousandSeparator(event.grantValue)} ${event.currency}`
              : "Not set"
          }
          value={event.grantValue}
          disabled={grantingHasOpened}
          openModal={() => handleOpen("SET_GRANT_VALUE")}
        />

        <Divider />

        <SettingsListItem
          primary="Dream creation closes"
          secondary={
            event.dreamCreationCloses
              ? dayjs(event.dreamCreationCloses).format("MMMM D, YYYY - h:mm a")
              : "Not set"
          }
          value={event.dreamCreationCloses}
          disabled={grantingHasOpened}
          openModal={() => handleOpen("SET_DREAM_CREATION_CLOSES")}
        />

        <Divider />

        <SettingsListItem
          primary="Granting opens"
          secondary={
            event.grantingOpens
              ? dayjs(event.grantingOpens).format("MMMM D, YYYY - h:mm a")
              : "Not set"
          }
          value={event.grantingOpens}
          openModal={() => handleOpen("SET_GRANTING_OPENS")}
          disabled={
            !event.dreamCreationCloses ||
            !event.totalBudget ||
            !event.grantValue
          }
        />

        <Divider />

        <SettingsListItem
          primary="Granting closes"
          secondary={
            event.grantingCloses
              ? dayjs(event.grantingCloses).format("MMMM D, YYYY - h:mm a")
              : "Not set"
          }
          value={event.grantingCloses}
          openModal={() => handleOpen("SET_GRANTING_CLOSES")}
          disabled={!event.grantingOpens}
        />
      </List>
    </>
  );
};
