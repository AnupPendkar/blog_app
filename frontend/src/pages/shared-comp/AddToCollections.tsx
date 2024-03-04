import { Button, Checkbox, Dialog, DialogContent } from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import React from 'react';
import userService from '@services/userService';
import postService from '@services/postService';
import { useAppSelector } from '@redux/store';

const AddToCollections = ({ postId, showWishlist }: { postId: number; showWishlist: () => void }) => {
  const [dialogType, setDialogType] = React.useState(1);
  const [collections, setCollections] = React.useState([]);
  const [collectionName, setCollectionName] = React.useState('');
  const { createCollection, fetchUserCollections } = userService();
  const { addPostToCollection } = postService();

  function onSelection(id: number) {
    const modifiedCollections = collections?.map((coll) => {
      if (coll?.id === id) {
        coll.checked = !coll?.checked;
      }
      return coll;
    });

    setCollections(modifiedCollections);
  }

  async function onCreateColleaction() {
    const { id } = await createCollection(collectionName);
    onSavePostToCollectionIds([id]);
  }

  async function onSavePostToCollectionIds(collecIds: Array<number>) {
    console.log(postId);
    await addPostToCollection({ postId, collectionIdList: collecIds });
    showWishlist();
  }

  function addPost() {
    const selectedCollectionIds = collections?.filter((coll) => coll?.checked)?.map((coll) => coll?.id);
    onSavePostToCollectionIds(selectedCollectionIds);
  }

  async function getUserCollections() {
    const data = await fetchUserCollections();
    data.forEach((coll) => {
      coll.checked = coll?.post?.some((p) => p?.postId === postId);
    });
    setCollections(data);
  }

  React.useEffect(() => {
    getUserCollections();
  }, []);

  return (
    <>
      <Dialog open={true}>
        <DialogContent sx={{ minWidth: '300px' }}>
          {dialogType === 1 ? (
            <>
              {collections?.map((coll, index) => (
                <div className="flex items-center" key={index}>
                  <Checkbox color="success" checked={coll?.checked} onChange={() => onSelection(coll?.id)} />
                  <span className="fsr-16 inter">{coll.name}</span>
                </div>
              ))}

              <div onClick={() => setDialogType(2)} className="flex items-center gap-3 cursor-pointer ml-2 mt-3 mb-3">
                <AddIcon />
                <span className="fsr-16 inter">New Collection</span>
              </div>

              <div className="flex justify-end gap-3 mt-5">
                <Button className="float-right" onClick={() => showWishlist()} variant="contained" color="cancel">
                  Close
                </Button>
                <Button className="float-right" onClick={addPost} variant="contained" color="success">
                  Save
                </Button>
              </div>
            </>
          ) : (
            <div>
              <div className="flex flex-col gap-2">
                <span className="fsr-16 inter">Collection Name:</span>
                <input
                  value={collectionName}
                  onChange={(e) => setCollectionName(e.target.value)}
                  maxLength={30}
                  type="text"
                  className="border-none fsr-18 inter py-[7px] px-[15px] outline-none"
                />
              </div>
              <div className="flex justify-end gap-3 mt-5">
                <Button onClick={() => setDialogType(1)} variant="contained" color="cancel">
                  Cancel
                </Button>
                <Button onClick={() => onCreateColleaction()} disabled={collectionName === ''} variant="contained" color="success">
                  Create
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </>
  );
};

export default AddToCollections;
