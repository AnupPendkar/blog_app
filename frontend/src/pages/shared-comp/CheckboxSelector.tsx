import * as React from 'react';
import OutlinedInput from '@mui/material/OutlinedInput';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import ListItemText from '@mui/material/ListItemText';
import Select from '@mui/material/Select';
import Checkbox from '@mui/material/Checkbox';
import { ICategories, IPostDetails } from '@models/post_model';
import { Autocomplete, TextField } from '@mui/material';

interface ICheckBoxSelectorProp {
  selectedCat: Array<number>;
  categories: ICategories[];
  handleChange: (event: any, value: ICategories[]) => void;
}

export default function CheckboxSelector({ selectedCat, categories, handleChange }: ICheckBoxSelectorProp) {
  return (
    <div>
      <Autocomplete
        multiple
        id="checkboxes-tags-demo"
        options={categories}
        disableCloseOnSelect
        getOptionLabel={(option) => option.name}
        onChange={handleChange}
        renderOption={(props, option) => (
          <MenuItem {...props}>
            <Checkbox color="success" checked={selectedCat.includes(option?.id)} />
            <ListItemText primary={option?.name} />
          </MenuItem>
        )}
        className='custom__autocomplete'
        renderInput={(params) => <TextField {...params} variant="standard" label="Categories" placeholder="Add" />}
      />
      {/* <FormControl sx={{ m: 1, width: 300 }}>
        <InputLabel color="info" id="demo-multiple-checkbox-label">
          Categories
        </InputLabel>
        <Select
          color="info"
          labelId="demo-multiple-checkbox-label"
          id="demo-multiple-checkbox"
          multiple
          input={<OutlinedInput label="Tag" />}
          renderValue={() => getSelectedCatName()}
        >
          {categories.map((cat) => (
          ))}
        </Select>
      </FormControl> */}
    </div>
  );
}
