import React, {useEffect, useState} from 'react'
import axios from 'axios'
import {useNavigate} from 'react-router-dom'
import Visibility from '@mui/icons-material/Visibility';
import VisibilityOff from '@mui/icons-material/VisibilityOff'; import InputLabel from '@mui/material/InputLabel';
import InputAdornment from '@mui/material/InputAdornment';
import Drawer from '@mui/material/Drawer';
//import {useCookies} from 'react-cookie'
import {Avatar, Box, Button, Grid, Paper, TextField, Typography, Snackbar, IconButton, Alert} from "@mui/material"
//import IconButton from '@mui/material/IconButton';
import Input from '@mui/material/Input';
import FilledInput from '@mui/material/FilledInput';
import OutlinedInput from '@mui/material/OutlinedInput';
//import InputLabel from '@mui/material/InputLabel';
//import InputAdornment from '@mui/material/InputAdornment';
import FormHelperText from '@mui/material/FormHelperText';
import FormControl from '@mui/material/FormControl';
//import TextField from '@mui/material/TextField';
//import Visibility from '@mui/icons-material/Visibility';
//import VisibilityOff from '@mui/icons-material/VisibilityOff';import CloseIcon from '@mui/icons-material/Close'
import {teal} from "@mui/material/colors"
import LockOutlinedIcon from "@mui/icons-material/LockOutlined"
import InfiniteScroll from "react-infinite-scroller"
import BookCard from './BookCard'
import Header from './Header'
import {Ajax} from '../util/Ajax'
import Skeleton from '@mui/material/Skeleton';
import {AdapterDayjs} from '@mui/x-date-pickers/AdapterDayjs';
import {LocalizationProvider} from '@mui/x-date-pickers/LocalizationProvider';
import {DatePicker} from '@mui/x-date-pickers/DatePicker';
import Divider from '@mui/material/Divider';
import CircularProgress from '@mui/material/CircularProgress';
import {isIS} from '@mui/x-date-pickers';

const Sign = ({host}) => {
    const navigate = useNavigate()
    // ページ遷移サンプル
    //navigate('/notes')

    const [loginid, setLoginid] = useState("")
    const [showUsername, setShowUsername] = useState("none")
    const [showSignupBtn, setshowSignupBtn] = useState("block")
    const [hasNext, setHasNext] = useState(true)

    //const [_, setCookie] = useCookies(["authtoken"])



    const [open, setOpen] = React.useState(false);

    const handleClick = () => {
        setOpen(true);
    };

    const handleClose = (event, reason) => {
        if (reason === 'clickaway') {
            return;
        }

        setOpen(false);
    };

    const [mail, setMail] = useState("")
    const [password, setPassword] = useState("")

    const [username, setUsername] = useState("")
    const [isSignup, setIsSignup] = useState(false)

    const [msg, setMsg] = useState("")
    async function signin() {
        if (isSignup) {
            axios.post(host + '/sign/up', {
                mail_address: mail,
                user_name: username,
                password: password
            })
                .then(res => {
                    console.log(res)
                    if (res.data.code == 0) {
                        console.log("sign up success")
                        document.cookie = 'token=' + res.data.token
                        sessionStorage.setItem("header", mail)
                        navigate('/')
                    }
                    if (res.data.code == 20) {
                        setMsg(res.data.msg)
                        setOpen(true)
                    }
                })
                .catch(e => console.log(e))

            return
        }

        // sign in
        let data = {
            mail_address: mail,
            password: password
        }

        fetch(host + '/sign/in', {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(data)
        })
            .then(res => {
                return res.json()
            }).then(res => {
                console.log(res)
                if (res.code == 0) {
                    console.log("sign in success")
                    document.cookie = 'token=' + res.token
                    sessionStorage.setItem("header", mail)
                    navigate('/')
                }
                if (res.code == 20) {
                    console.log("un authorized")
                    setMsg(res.msg)
                    setOpen(true)
                }
            })
    }

    function signup() {
        setIsSignup(true)
    }

    useEffect(() => {
        //getBooks()
    }, [])

    const [drawerFlg, setDrawerFlg] = useState(false)
    const toggleDrawer = () => setDrawerFlg(!drawerFlg)

    const [detailFlg, setDetailFlg] = useState(false)
    const toggleDetail = () => setDetailFlg(!detailFlg)
    const [detailData, setDetailData] = useState({})



    const [showPassword, setShowPassword] = React.useState(false);

    const handleClickShowPassword = () => setShowPassword((show) => !show);

    const handleMouseDownPassword = (event) => {
        event.preventDefault();
    };


    return (
        <Grid>
            <Header host={host} ff={toggleDrawer} isProfile={false} />
            <Snackbar open={open} autoHideDuration={6000} onClose={handleClose}>
                <Alert onClose={handleClose} severity="error" sx={{width: '100%'}}>
                    {msg}
                </Alert>
            </Snackbar>
            <Grid>
                <Typography variant="h4" component="h2">
                    Sign in
                </Typography>
                <Divider />

                <Box
                    component="form"
                    sx={{'& > :not(style)': {m: 1, width: '25ch'}, }}
                    noValidate
                    autoComplete="off"
                >
                    <TextField label="mail address" variant="standard" value={mail} onChange={e => setMail(e.target.value)} />
                </Box>
                <Box
                    component="form"
                    sx={{'& > :not(style)': {m: 1, width: '25ch'}, }}
                    noValidate
                    autoComplete="off"
                    display={isSignup ? "block" : "none"}
                >
                    <TextField label="user name" variant="standard" value={username} onChange={e => setUsername(e.target.value)} />
                </Box>
                {/**
                <Box
                    component="form"
                    sx={{'& > :not(style)': {m: 1, width: '25ch'}, }}
                    noValidate
                    autoComplete="off"
                >
                    <TextField label="password" variant="standard" type='password' value={password} onChange={e => setPassword(e.target.value)} />
                    <InputAdornment position="end">
                        <IconButton
                            aria-label="toggle password visibility"
                            onClick={handleClickShowPassword}
                            onMouseDown={handleMouseDownPassword}
                            edge="end"
                        >
                        </IconButton>
                    </InputAdornment>
                </Box>
                */}
                <FormControl sx={{m: 1, width: '25ch'}} variant="standard">
                    <InputLabel htmlFor="standard-adornment-password">Password</InputLabel>
                    <Input
                        id="standard-adornment-password"
                        type={showPassword ? 'text' : 'password'}
                        value={password} onChange={e => setPassword(e.target.value)}
                        endAdornment={
                            <InputAdornment position="end">
                                <IconButton
                                    aria-label="toggle password visibility"
                                    onClick={handleClickShowPassword}
                                    onMouseDown={handleMouseDownPassword}
                                >
                                    {showPassword ? <VisibilityOff /> : <Visibility />}
                                </IconButton>
                            </InputAdornment>
                        }
                    />
                </FormControl>
                <br />
                <Button variant="contained" onClick={signin}>{isSignup ? "Sign up" : "Sing in"}</Button>
                <Divider />
                <Divider />
                <Box
                    display={isSignup ? "none" : "block"}
                >
                    <Button variant="contained" onClick={signup}>or create account</Button>
                </Box>

            </Grid>
            <Box>
            </Box>
        </Grid>
    )
}

export default Sign

