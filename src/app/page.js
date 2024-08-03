'use client'

import { useState, useEffect } from 'react'
import { Box, Stack, Typography, Button, Modal, TextField, MenuItem, Grid, TableContainer, Paper, Table, TableBody,
  TableCell,
  Card, CardMedia, CardContent,
  TableHead,
  TableRow, TablePagination } from '@mui/material'
import { ThemeProvider, createTheme } from '@mui/material/styles';

import { firestore } from '@/firebase'
import {
  collection,
  doc,
  getDocs,
  query,
  setDoc,
  deleteDoc,
  getDoc,
  updateDoc,
  where,
} from 'firebase/firestore'

const style = {
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: 400,
  border: '2px solid #000',
  boxShadow: 24,
  p: 4,
  display: 'flex',
  flexDirection: 'column',
  gap: 3,
  bgcolor: 'background.paper',
  color: 'primary.main'

}

export default function Home() {
  // We'll add our component logic here
  const [inventory, setInventory] = useState([])
const [itemName, setItemName] = useState('')
const [category,setCategory] = useState('')
const [quantity,setQuantity] = useState('')
const [description,setDescription] = useState('')
const [pg, setpg] = useState(0); 
const [rpg, setrpg] = useState(5); 
const [SearchitemName,setSearchItemName] = useState('');
const [Searchcategory,setSearchCategory] = useState('All');
  
    function handleChangePage(event, newpage) { 
        setpg(newpage); 
    } 
  
    function handleChangeRowsPerPage(event) { 
        setrpg(parseInt(event.target.value, 10)); 
        setpg(0); 
    } 


const updateInventory = async () => {
  const snapshot = query(collection(firestore, 'inventory'))
  const docs = await getDocs(snapshot)
  const inventoryList = []
  docs.forEach((doc) => {
    inventoryList.push({ name: doc.id, ...doc.data() })
  })
  setInventory(inventoryList)
}

const filterInventory = async (filterCategory) => {
  let snapshot;
  if(filterCategory === "All"){
  snapshot = query(collection(firestore, 'inventory'))
  }
  else{
    snapshot = query(collection(firestore, 'inventory'), where("category","==",filterCategory))
  }
  const docs = await getDocs(snapshot)
  const inventoryList = []
  docs.forEach((doc) => {
    inventoryList.push({ name: doc.id, ...doc.data() })
  })
  setInventory(inventoryList)
}

const searchItem = async (searchitemName) => {
  searchitemName = searchitemName.toLowerCase();
  
  const inventoryList=[]
if(searchitemName === ''){

  updateInventory()
}else{
  // console.log(inventory)
  inventory.forEach((item) => {
    console.log(item.name)
    if(item.name === searchitemName){
      inventoryList.push(item)
    }
  })}
  setInventory(inventoryList)
}

useEffect(() => {
  updateInventory()
}, [])

const addNewItem = async (item,category,newquantity,description) => {
  item = item.toLowerCase();
  const docRef = doc(collection(firestore, 'inventory'), item)
  const docSnap = await getDoc(docRef)
  console.log(docSnap)

  if (docSnap.exists()) {
    // const { quantity } = docSnap.data()
    // await setDoc(docRef,{category, quantity: quantity + newquantity,description })
    alert('Item already exists in the inventory.');
  } else {
    newquantity = parseInt(newquantity, 10)
    await setDoc(docRef,{category, quantity: newquantity,description })
  }
  await updateInventory()
}

const updateItem = async (item,updatequantity) => {
  const docRef = doc(collection(firestore, 'inventory'), item)
  const docSnap = await getDoc(docRef)
  if (!docSnap.exists()) {
    // const { quantity } = docSnap.data()
    // await setDoc(docRef,{category, quantity: quantity + newquantity,description })
    alert('Item missing in the inventory.');
  } else {
    const { quantity } = docSnap.data()
    // updatequantity = parseInt(updatequantity, 10) 
    let newquantity = quantity + parseInt(updatequantity, 10) 
    if(newquantity<0){
      alert("Cannot delete more items than present. Operation canceled.")
      newquantity = quantity
    }

    await updateDoc(docRef,{

      quantity: newquantity
    })
  }
  await updateInventory()
}

const removeItem = async (item) => {
  const docRef = doc(collection(firestore, 'inventory'), item)
  const docSnap = await getDoc(docRef)
  if (docSnap.exists()) {
    const { quantity } = docSnap.data()

    if(quantity>0){
    alert('Quantity is not 0. Cannot delete. Make quantity 0 and try again.');
    }else{
    await deleteDoc(docRef)
    }

    
  }else{
    alert('Item missing in the inventory.');
  }
  await updateInventory()
}

const [openModal1, setOpenModal1] = useState(false);
const [openModal2, setOpenModal2] = useState(false);


const handleOpenModal1 = () => setOpenModal1(true)
const handleClosemModal1 = () => setOpenModal1(false)


const [updateName, setUpdateName] = useState('');
const [updateQ, setUpdateQ] = useState('');


const handleOpenModal2 = (updateName,updateQ) => {
  setUpdateName(updateName);
  setUpdateQ(updateQ);
  setOpenModal2(true);
};

const handleCloseModal2 = () => {
  setOpenModal2(false);
  setUpdateName('');
  setUpdateQ('');
};
const darkTheme = createTheme({
  palette: {
    mode: 'dark',
  },
});
const SearchCategories = [
  {
    value: 'All',
    label: 'All',
  },{
    value: 'Groceries',
    label: 'Groceries',
  },
  {
    value: 'Bath',
    label: 'Bath',
  },{
    value: 'Auto',
    label: 'Auto',
  },
  {
    value: 'Laundry',
    label: 'Laundry',
  },{
    value: 'Electronics',
    label: 'Electronics',
  },{
    value: 'Stationery',
    label: 'Stationery',
  }]


const categories = [
  {
    value: 'Groceries',
    label: 'Groceries',
  },
  {
    value: 'Bath',
    label: 'Bath',
  },{
    value: 'Auto',
    label: 'Auto',
  },
  {
    value: 'Laundry',
    label: 'Laundry',
  },{
    value: 'Electronics',
    label: 'Electronics',
  },{
    value: 'Stationery',
    label: 'Stationery',
  }]

  return (
    <ThemeProvider theme={darkTheme} >
        <Modal
          open={openModal1}
          onClose={handleClosemModal1}
          aria-labelledby="modal-modal-title"
          aria-describedby="modal-modal-description"

        >

          <Box sx={style}>
            <Typography id="modal-modal-title" variant="h6" component="h6">
              Add Item
            </Typography>
            <Grid container spacing={2}>
              <Grid item xs={12} sm={6}>
                <TextField
                  id="outlined-basic"
                  label="Item"
                  variant="outlined"
                  placeholder="Item Name"
                  fullWidth
                  value={itemName}
                  onChange={(e) => setItemName(e.target.value)}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  id="outlined-select-category"
                  select
                  label="Select"
                  value={category}
                  defaultValue="Grocery"
                  helperText="Please select item category"
                  fullWidth
                  onChange={(e) => setCategory(e.target.value)}
                >
                  {categories.map((option) => (
                    <MenuItem key={option.value} value={option.value}>
                      {option.label}
                    </MenuItem>
                  ))}
                </TextField>
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  id="outlined-number"
                  label="Quantity"
                  type="number"
                  placeholder="Number of items"
                  fullWidth
                  value={quantity}
                  onChange={(e) => setQuantity(e.target.value)}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  id="outlined-multiline-static"
                  label="Description"
                  multiline
                  rows={4}
                  placeholder="Description"
                  fullWidth
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                />
              </Grid>
              <Grid item xs={12}>
                <Button
                  variant="outlined"
                  onClick={() => {
                    addNewItem(itemName, category, quantity, description);
                    setItemName('');
                    setCategory('');
                    setQuantity('');
                    setDescription('');
                    handleClosemModal1();
                  }}
                >
                  Add
                </Button>
              </Grid>
            </Grid>
          </Box>
         
        </Modal>

        <Modal
          open={openModal2}
          onClose={handleCloseModal2}
          aria-labelledby="modal-modal-title"
          aria-describedby="modal-modal-description"
        >

          <Box sx={style}>
            <Typography id="modal-modal-title" variant="h6" component="h2">
              Add or Subtract Quantity
            </Typography>
            <Grid container spacing={2}>
              <Grid item xs={12}>
                <Typography id="item-name" variant="body1" component="p">
                  The current quantity of {updateName} in Pantry = {updateQ}
                </Typography>
              </Grid>
              <Grid item xs={12}>
                <TextField
                  id="outlined-number"
                  label="Quantity"
                  type="number"
                  placeholder="Number of items"
                  fullWidth
                  value={quantity}
                  onChange={(e) => setQuantity(e.target.value)}
                />
              </Grid>
              <Grid item xs={6}>
                <Button
                  variant="outlined"
                  color='success'
                  fullWidth
                  onClick={() => {
                    updateItem(updateName, parseInt(quantity, 10));
                    setQuantity('');
                    handleCloseModal2();
                  }}
                >
                  Add
                </Button>
              </Grid>
              <Grid item xs={6}>
                <Button
                  variant="outlined"
                  color='error'
                  fullWidth
                  onClick={() => {
                    updateItem(updateName, -parseInt(quantity, 10));
                    setQuantity('');
                    handleCloseModal2();
                  }}
                >
                  Subtract
                </Button>
              </Grid>
            </Grid>
          </Box>

        </Modal>
     
      <Box width="100vw" height="100%" display="flex" flexDirection="column" alignItems="center" bgcolor="background.paper" p={2}>
      <Typography variant="h4" textAlign="center" color="primary.main" mb={4}>
        Pantry List
      </Typography>

      <Box width="80%" margin="auto" mb={4}>
        <Box
          display="flex"
          justifyContent="space-between"
          alignItems="center"
          bgcolor="background.paper"
          color="primary.main"
          padding={2}
          boxShadow={3}
        >
          <TextField
            id="outlined-basic"
            label="Search Item"
            variant="outlined"
            placeholder="Search Item"
            value={SearchitemName}
            onChange={(e) => setSearchItemName(e.target.value)}
            sx={{ flex: 1, marginRight: 2 }}
          />
          <Button
            variant="contained"
            onClick={() => {
              searchItem(SearchitemName);
              setSearchItemName(SearchitemName);
            }}
            sx={{ flex: 1, marginRight: 2 }}
          >
            Search
          </Button>
          <Button
            variant="contained"
            color="error"
            onClick={() => {
              setSearchItemName('');
              searchItem('');
            }}
            sx={{ flex: 1, marginRight: 2 }}
          >
            Clear
          </Button>
          <TextField
            id="outlined-select-category"
            select
            label="Filter Category"
            value={Searchcategory}
            onChange={(e) => {
              filterInventory(e.target.value);
              setSearchCategory(e.target.value);
            }}
            sx={{ flex: 1, marginRight: 2 }}
          >
            {SearchCategories.map((option) => (
              <MenuItem key={option.value} value={option.value}>
                {option.label}
              </MenuItem>
            ))}
          </TextField>
          <Button variant="contained" onClick={handleOpenModal1} sx={{ flexShrink: 0 }}>
            Add New Item
          </Button>
        </Box>
      </Box>

      <Box width="80%" margin="auto">
        <Grid container spacing={3}>
          {inventory.map(({ name, category, quantity, description }) => (
            <Grid item xs={12} sm={6} md={4} key={name}>
              <Card>
                <CardContent>
                  <Box display="flex" flexDirection="column" alignItems="center" padding={2}>
                   
                    <Typography gutterBottom variant="h5" component="div" sx={{ marginBottom: 2 }}>
                      {name.charAt(0).toUpperCase() + name.slice(1)}
                    </Typography>
                    <Box display="flex" flexDirection="column" alignItems="flex-start" width="100%">
                      <Typography variant="body2" color="text.secondary" sx={{ marginBottom: 1 }}>
                        <strong>Category:</strong> {category}
                      </Typography>
                      <Typography variant="body2" color="text.secondary" sx={{ marginBottom: 1 }}>
                        <strong>Quantity:</strong> {quantity}
                      </Typography>
                      <Typography variant="body2" color="text.secondary" sx={{ marginBottom: 2 }}>
                        <strong>Description:</strong> {description}
                      </Typography>
                    </Box>
                    <Box display="flex" justifyContent="space-between" width="100%">
                      <Button variant="contained" onClick={() => handleOpenModal2(name, quantity)} sx={{ marginRight: 1 }}>
                        Update Quantity
                      </Button>
                      <Button variant="contained" onClick={() => removeItem(name, category)}>
                        Remove
                      </Button>
                    </Box>
                  </Box>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      </Box>
    </Box>
    </ThemeProvider>
  )
}