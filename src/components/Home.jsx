import React, {useState} from 'react'
import {useNavigate} from 'react-router-dom'
//import {useCookies} from 'react-cookie'
import {Avatar, Box, Button, Grid, Paper, TextField, Typography, Snackbar, IconButton, Alert} from "@mui/material"
import CloseIcon from '@mui/icons-material/Close'
import {teal} from "@mui/material/colors"
import LockOutlinedIcon from "@mui/icons-material/LockOutlined"
import BookCard from './BookCard'
import Header from './Header'
import {Ajax} from '../util/Ajax'


const Home = () => {
  const navigate = useNavigate()
      // ページ遷移サンプル
      //navigate('/notes')

  const [loginid, setLoginid] = useState("")
  const [password, setPassword] = useState("")
  const [username, setUsername] = useState("")
  const [open, setOpen] = useState(false)
  const [showUsername, setShowUsername] = useState("none")
  const [showSignupBtn, setshowSignupBtn] = useState("block")
  const [msg, setMsg] = useState("")

  //const [_, setCookie] = useCookies(["authtoken"])

  function Signin() {
    Ajax.POST("/usr/signin", {
      loginid: loginid,
      password: password
    }, (data) => {
      if (data.status) {
        setOpen(true)
        setMsg(data.message)
        return
      }
      const Session = {
        userid: data.userid,
        username: data.username
      }
      window.sessionStorage.setItem("session", JSON.stringify(Session))
      //setCookie("authtoken", data.cookie, {path: "/"})
      //setCookie("authtoken", data.cookie, {path: "/test/notes"})
      //setCookie("authtoken", data.cookie, {domain: "neras-sta.com", path: "/"})

    }, (e) => {
      setOpen(true)
      setMsg(e.message)
    })
    return
  }


  const handleClose = (_, reason) => {
    if (reason === 'clickaway') {
      return;
    }
    setOpen(false);
  }

  const action = (
    <React.Fragment>
      <Button color="secondary" size="small" onClick={handleClose}>
      </Button>
      <IconButton
        size="small"
        aria-label="close"
        color="inherit"
        onClick={handleClose}
      >
        <CloseIcon fontSize="small" />
      </IconButton>
    </React.Fragment>
  );

  return (
    <Grid>
      <Header />
      {/** TODO 本一覧を取得*/}
      <BookCard
        title="title"
        date="2020202"
        publisher="iwa"
        author="test"
        encImg="aaaaaaaaaaaa"
      ></BookCard>
    </Grid>
  )
}

export default Home

