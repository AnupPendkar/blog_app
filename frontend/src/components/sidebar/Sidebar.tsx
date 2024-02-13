import { Box, IconButton, List, ListItem, ListItemButton, useTheme } from '@mui/material';
import React, { useEffect, useState } from 'react';
import { AppSolutionRegistry } from '@shared/appSolutionsRegistry';
import { ISideBarItem } from '@models/common';
import { useLocation, useNavigate } from 'react-router-dom';
import { AppRoutesEnum } from '@shared/appRotues';
import { getValue } from '@testing-library/user-event/dist/utils';

const Sidebar = () => {
  const navigate = useNavigate();
  const { pathname } = useLocation();
  const [sidebarItems, updateSidebarItems] = useState(AppSolutionRegistry.sidebarItems);
  const [showSidebar, setSidebarActiveness] = useState(true);

  function onListClick(event: React.KeyboardEvent | React.MouseEvent) {
    if (event.type === 'keydown' && ((event as React.KeyboardEvent).key === 'Tab' || (event as React.KeyboardEvent).key === 'Shift')) {
      return;
    }
  }

  function onSidebarItemClick(ItemId: number) {
    navigate(sidebarItems.find((sidebar) => sidebar?.id === ItemId)?.route);
  }

  function setSidebarActiveState() {
    updateSidebarItems((prev) =>
      prev.map((sidebar) => {
        if (sidebar.route === pathname) {
          sidebar.isActive = true;
        } else {
          sidebar.isActive = false;
        }

        return sidebar;
      })
    );
  }

  function toggleSidebar() {
    const mainPageRoutes = sidebarItems?.map((item) => {
      return item?.route;
    });

    if (!mainPageRoutes?.includes(pathname as AppRoutesEnum)) {
      setSidebarActiveness(false);
    } else {
      setSidebarActiveness(true);
    }
  }

  useEffect(() => {
    setSidebarActiveState();
    toggleSidebar();
  }, [pathname]);

  return (
    <div
      className="app-sidebar pt-6"
      style={{
        backgroundColor: '#1A232D',
        color: '#ffffff',
      }}
    >
      {showSidebar && (
        <div className="px-1 py-1">
          <Box sx={{ width: 'fit-content', height: '100%' }} role="presentation" onClick={onListClick}>
            <List>
              {sidebarItems.map((sidebar, index) => (
                <SidebarItem itemDetails={sidebar} sidebarItemSelection={onSidebarItemClick} key={index} />
              ))}
            </List>
          </Box>
        </div>
      )}
    </div>
  );
};

export default Sidebar;

interface SidebarItem {
  itemDetails: ISideBarItem;
  sidebarItemSelection: (ItemId: number) => void;
}

const SidebarItem = ({ itemDetails, sidebarItemSelection }: SidebarItem) => {
  return (
    <ListItem className="mb-7 cursor-pointer flex" style={{ cursor: itemDetails?.disabled && 'not-allowed' }} disablePadding>
      <ListItemButton
        sx={{
          justifyContent: 'center',
          textAlign: 'center',
          width: 80,
        }}
        disabled={itemDetails?.disabled}
        onClick={() => sidebarItemSelection(itemDetails?.id)}
      >
        <div className="flex flex-col items-center justify-center">
          <IconButton
            className="w-8 h-8"
            sx={{
              backgroundColor: itemDetails?.isActive ? 'success.main' : 'inactive.main',
              '&:hover': {
                backgroundColor: itemDetails?.isActive ? 'success.main' : 'hover.main',
              },
            }}
          >
            <img className="w-5 h-5" src={itemDetails.icon} alt={`${itemDetails.text} icon`} />
          </IconButton>
          <span className="fsr-11 font-isb mt-1">{itemDetails.text}</span>
        </div>
      </ListItemButton>
    </ListItem>
  );
};
