import * as React from 'react';
import OutlinedInput from '@mui/material/OutlinedInput';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import ListItemText from '@mui/material/ListItemText';
import Select from '@mui/material/Select';
import Checkbox from '@mui/material/Checkbox';
import { ICategories } from '@models/post_model';

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

interface ICheckBoxSelectorProp {
  selectedCat: Array<number>;
  categories: ICategories[];
  handleChange: (event: any) => void;
}

export default function CheckboxSelector({ selectedCat, categories, handleChange }: ICheckBoxSelectorProp) {
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
        <InputLabel color="info" id="demo-multiple-checkbox-label">
          Categories
        </InputLabel>
        <Select
          color="info"
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
              <Checkbox color="success" checked={selectedCat.includes(cat?.id)} />
              <ListItemText primary={cat?.name} />
            </MenuItem>
          ))}
        </Select>
      </FormControl>
    </div>
  );
}
