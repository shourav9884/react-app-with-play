import logo from './logo.svg';
import './App.css';
import axios from 'axios';
import { useState, useEffect } from 'react';
import { Grid } from '@mui/joy';
import Button from '@mui/joy/Button';
import { styled } from '@mui/joy/styles';
import Sheet from '@mui/joy/Sheet';
import Table from '@mui/joy/Table';
import FormControl from '@mui/joy/FormControl';
import FormLabel from '@mui/joy/FormLabel';
import Input from '@mui/joy/Input';
import Modal from '@mui/joy/Modal';
import ModalDialog from '@mui/joy/ModalDialog';
import DialogTitle from '@mui/joy/DialogTitle';
import DialogContent from '@mui/joy/DialogContent';
import Stack from '@mui/joy/Stack';
import Box from '@mui/joy/Box';


const Item = styled(Sheet)(({ theme }) => ({
  backgroundColor:
    theme.palette.mode === 'dark' ? theme.palette.background.level1 : '#fff',
  ...theme.typography['body-sm'],
  padding: theme.spacing(1),
  textAlign: 'left',
  borderRadius: 4,
  color: theme.vars.palette.text.secondary,
}));

function App() {
  const [users, setUsers] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [newUserData, setNewUserData] = useState({ name: '', emailAddress: '' });
  const apiBaseUrl = "http://localhost:9000"

  useEffect(() => {
    // Fetch initial user data
    fetchUserData();
  }, []);

  const fetchUserData = async () => {
    try {
      const response = await axios.get(apiBaseUrl + '/users'); // Replace with your actual API endpoint
      setUsers(response.data);
    } catch (error) {
      console.error('Error fetching user data:', error);
    }
  };

  const createUser = async () => {
    try {
      await axios.post(apiBaseUrl + '/users', newUserData); // Replace with your actual API endpoint
      setShowModal(false);
      fetchUserData(); // Refresh user data after creating a new user
    } catch (error) {
      console.error('Error creating user:', error);
    }
  };

  const exportUserData = async () => {
    try {
      const response = await axios.get(apiBaseUrl + '/users/export', { responseType: 'arraybuffer' }); // Replace with your actual API endpoint
      const blob = new Blob([response.data], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
      const link = document.createElement('a');
      link.href = window.URL.createObjectURL(blob);
      link.download = 'users.xlsx';
      link.click();
    } catch (error) {
      console.error('Error exporting user data:', error);
    }
  };

  return (
    <Grid container spacing={2} sx={{ flexGrow: 1 }}>
    <Grid xs={2}>
      <Item>
      </Item>
    </Grid>
    <Grid xs={4}>
      <Item><h1>User List</h1></Item>
    </Grid>
    <Grid xs={4}>
      <Item spacing={2} >
         <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap' }}>
        <Button 
        variant="outlined"
        color="neutral"
        onClick={() => setShowModal(true)}
        >Create User</Button>
        <Button onClick={exportUserData}>Export User</Button>
        </Box>
      </Item>
    </Grid>
    <Grid xs={2}>
      <Item>
      </Item>
    </Grid>
    <Grid xs={2}>
      <Item>
      </Item>
    </Grid>  
    <Grid xs={8}>
      <Item>
      <Table aria-label="basic table">
        <thead>
          <tr>
            <th>ID</th>
            <th>Name</th>
            <th>Email</th>
          </tr>
        </thead>
        <tbody>
          {users.map((user) => (
            <tr key={user.id}>
              <td>{user.id}</td>
              <td>{user.name}</td>
              <td>{user.emailAddress}</td>
            </tr>
          ))}
        </tbody>
      </Table></Item>
    </Grid>
    <Grid xs={2}>
      <Item>
      </Item>
    </Grid>
    <Modal open={showModal} onClose={() => setShowModal(false)}>
        <ModalDialog>
          <DialogTitle>Create new user</DialogTitle>
          <DialogContent>Fill in the information of the user.</DialogContent>
          <form
            onSubmit={(event: React.FormEvent<HTMLFormElement>) => {
              event.preventDefault();
              setShowModal(false);
            }}
          >
            <Stack spacing={2}>
              <FormControl>
                <FormLabel>Name</FormLabel>
                <Input autoFocus required value={newUserData.name} onChange={(e) => setNewUserData({ ...newUserData, name: e.target.value })}/>
              </FormControl>
              <FormControl>
                <FormLabel>Email Address</FormLabel>
                <Input required value={newUserData.emailAddress} onChange={(e) => setNewUserData({ ...newUserData, emailAddress: e.target.value })}/>
              </FormControl>
              <Button onClick={createUser}>Submit</Button>
            </Stack>
          </form>
        </ModalDialog>
      </Modal>
 
  </Grid>
    
  );
}

export default App;
