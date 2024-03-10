import * as React from 'react';
import OutlinedInput from '@mui/material/OutlinedInput';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import ListItemText from '@mui/material/ListItemText';
import Select, { SelectChangeEvent } from '@mui/material/Select';
import Checkbox from '@mui/material/Checkbox';

const ITEM_HEIGHT = 48;
const ITEM_PADDING_TOP = 8;
const MenuProps = {
  PaperProps: {
    style: {
      maxHeight: ITEM_HEIGHT * 4.5 + ITEM_PADDING_TOP,
      width: 250,
      background: '#OF1111',
    },
  },
};

export default function CheckboxSelector({ selectedCat, categories, handleChange }) {
  function getSelectedCatName() {
    return categories
      .filter((cat) => selectedCat.includes(cat?.id))
      .map((cat, idx) => {
        let returnCat = '';
        if (idx > 0) {
          returnCat += ', ';
        }
        returnCat += cat?.name;
        return returnCat;
      });
  }

  return (
    <div>
      <FormControl sx={{ m: 1, width: 300 }}>
        <InputLabel id="demo-multiple-checkbox-label">Categories</InputLabel>
        <Select
          labelId="demo-multiple-checkbox-label"
          id="demo-multiple-checkbox"
          multiple
          value={selectedCat}
          onChange={handleChange}
          input={<OutlinedInput label="Tag" />}
          renderValue={() => getSelectedCatName()}
          MenuProps={MenuProps}
        >
          {categories.map((cat) => (
            <MenuItem key={cat?.id} value={cat?.id}>
              <Checkbox checked={selectedCat.includes(cat?.id)} />
              <ListItemText primary={cat?.name} />
            </MenuItem>
          ))}
        </Select>
      </FormControl>
    </div>
  );
}
