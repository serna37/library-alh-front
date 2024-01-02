import * as React from 'react';
import {Link, useNavigate} from "react-router-dom";
import axios from 'axios'
import {calling} from '../util/Axios.js'
import {styled, alpha} from '@mui/material/styles';
import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import Toolbar from '@mui/material/Toolbar';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';
import InputBase from '@mui/material/InputBase';
import Badge from '@mui/material/Badge';
import TextField from '@mui/material/TextField';
import MenuItem from '@mui/material/MenuItem';
import Menu from '@mui/material/Menu';
import MenuIcon from '@mui/icons-material/Menu';
import SearchIcon from '@mui/icons-material/Search';
import AccountCircle from '@mui/icons-material/AccountCircle';
import MailIcon from '@mui/icons-material/Mail';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import NotificationsIcon from '@mui/icons-material/Notifications';
import VolunteerActivismIcon from '@mui/icons-material/VolunteerActivism';
import MoreIcon from '@mui/icons-material/MoreVert';

const Search = styled('div')(({theme}) => ({
    position: 'relative',
    borderRadius: theme.shape.borderRadius,
    backgroundColor: alpha(theme.palette.common.white, 0.15),
    '&:hover': {
        backgroundColor: alpha(theme.palette.common.white, 0.25),
    },
    marginRight: theme.spacing(2),
    marginLeft: 0,
    width: '100%',
    [theme.breakpoints.up('sm')]: {
        marginLeft: theme.spacing(3),
        width: 'auto',
    },
}));

const SearchIconWrapper = styled('div')(({theme}) => ({
    padding: theme.spacing(0, 2),
    height: '100%',
    position: 'absolute',
    pointerEvents: 'none',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
}));

const StyledInputBase = styled(InputBase)(({theme}) => ({
    color: 'inherit',
    '& .MuiInputBase-input': {
        padding: theme.spacing(1, 1, 1, 0),
        // vertical padding + font size from searchIcon
        paddingLeft: `calc(1em + ${theme.spacing(4)})`,
        transition: theme.transitions.create('width'),
        width: '100%',
        [theme.breakpoints.up('md')]: {
            width: '20ch',
        },
    },
}));

const StyledBadge = styled(Badge)(({theme}) => ({
    '& .MuiBadge-badge': {
        right: -3,
        top: 13,
        border: `2px solid ${theme.palette.background.paper}`,
        padding: '0 4px',
    },
}));

export default function Header({host, ff, isProfile, profile}) {
    const history = useNavigate();

    function userProfile() {
        // get user profile
        calling('/ping', {})
            .then(res => {
                // if success -> go user profile view
                profile()
                console.log("success")
                console.log(res)
            })
            .catch(e => {
                // if error -> go login view
                history("/sign");
                console.log("error")
                console.log(e)
            })
    }

    return (
        <AppBar position="sticky">
            <Toolbar>
                {!isProfile ?
                    <IconButton
                        size="large"
                        edge="start"
                        color="inherit"
                        aria-label="open drawer"
                        onClick={ff}
                        sx={{mr: 2}}
                    >
                        {/** TODO tag attr search*/}
                        <MenuIcon />
                    </IconButton>
                    : <div></div>}
                <Typography
                    variant="h6"
                    noWrap
                    component="div"
                    sx={{display: {xs: 'none', sm: 'block'}}}
                >
                    Library for ALH
                </Typography>
                <Box sx={{flexGrow: 1}} />
                <Box sx={{display: {xs: 'none', md: 'flex'}}}>
                    {/** TODO 寄贈ページへ*/}
                    <IconButton size="large" aria-label="donate books" color="inherit">
                        <VolunteerActivismIcon />
                    </IconButton>
                    {/** TODO 一次借りページに行く*/}
                    {/**
                    <IconButton size="large" aria-label="cart" color="inherit">
                        <StyledBadge badgeContent={4} color="secondary">
                            <ShoppingCartIcon />
                        </StyledBadge>
                    </IconButton>
                    */}
                    <IconButton
                        size="large"
                        edge="end"
                        aria-label="account of current user"
                        //aria-controls={menuId}
                        aria-haspopup="true"
                        //onClick={handleProfileMenuOpen}
                        color="inherit"
                    >
                        <AccountCircle onClick={userProfile} />
                    </IconButton>
                </Box>
            </Toolbar>
        </AppBar>
    );
}
