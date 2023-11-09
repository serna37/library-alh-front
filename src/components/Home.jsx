import React, {useEffect, useState} from 'react'
import {useNavigate} from 'react-router-dom'
//import {useCookies} from 'react-cookie'
import {Avatar, Box, Button, Grid, Paper, TextField, Typography, Snackbar, IconButton, Alert} from "@mui/material"
import CloseIcon from '@mui/icons-material/Close'
import {teal} from "@mui/material/colors"
import LockOutlinedIcon from "@mui/icons-material/LockOutlined"
import InfiniteScroll from "react-infinite-scroll-component";
import BookCard from './BookCard'
import Header from './Header'
import {Ajax} from '../util/Ajax'
import Skeleton from '@mui/material/Skeleton';
import CircularProgress from '@mui/material/CircularProgress';

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


  const [list, setList] = useState([])

  function getBooks(no = 24) {
    // TODO fetch
    let lll = [...Array(no)].map((_, i) => i + 1);
    setTimeout(() => {
      setList([...list, ...lll])
    }, 1000);
  }

  useEffect(() => {
    getBooks()
  }, [])

  return (
    <Grid>
      <Header />
      {/** TODO 本一覧を取得*/}
      <Box>
        <InfiniteScroll
          dataLength={list.length} //現在のデータの長さ
          next={() => getBooks(12)} // スクロール位置を監視してコールバック（次のデータを読み込ませる）
          hasMore={true} // さらにスクロールするかどうか（ある一定数のデータ数に達したらfalseを返すことで無限スクロールを回避）
          loader={<CircularProgress />} // ローディング中のコンポーネント
          height={700}
        >
          <Grid container spacing={{xs: 2, sm: 2, md: 2}} columns={{xs: 2, sm: 4, md: 6}}>
            {list.map((v, index) => (
              <Grid item xs={1} sm={1} md={1} key={index}>
                <BookCard
                  // TODO 値受け取り
                  title="title"
                  date="2020202"
                  publisher="iwa"
                  author="test"
                  encImg="aaaaaaaaaaaa"
                ></BookCard>
              </Grid>
            ))}
          </Grid>
        </InfiniteScroll>
      </Box>
    </Grid>
  )
}

export default Home

