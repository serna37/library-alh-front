import React, {useEffect, useState} from 'react'
import axios from 'axios'
import {useNavigate} from 'react-router-dom'
//import {useCookies} from 'react-cookie'
import {Avatar, Box, Button, Grid, Paper, TextField, Typography, Snackbar, IconButton, Alert} from "@mui/material"
import CloseIcon from '@mui/icons-material/Close'
import {teal} from "@mui/material/colors"
import LockOutlinedIcon from "@mui/icons-material/LockOutlined"
import InfiniteScroll from "react-infinite-scroller"
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
    const [hasNext, setHasNext] = useState(true)

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

    function getBooks(pageNo) {
        //axios.post('https://neras-sta.com/mk6/signin', {
        axios.post('http://localhost:8282/book/search', {
            offset: list.length
        })
            .then(res => {
                console.log(res)
                setList([...list, ...res.data.data])
                if (res.data.data.length == 0) {
                    setHasNext(false)
                }
            })
            .catch(e => console.log(e))
        //let lll = [...Array(no)].map((_, i) => i + 1);
        //setTimeout(() => {
        //setList([...list, ...lll])
        //}, 1000);
    }

    useEffect(() => {
        getBooks()
    }, [])

    return (
        <Grid>
            <Header />
            <Box>
                <InfiniteScroll
                    dataLength={list.length} //現在のデータの長さ
                    loadMore={getBooks} // スクロール位置を監視してコールバック（次のデータを読み込ませる）
                    hasMore={hasNext} // さらにスクロールするかどうか（ある一定数のデータ数に達したらfalseを返すことで無限スクロールを回避）
                    loader={<CircularProgress />} // ローディング中のコンポーネント
                >
                    <Grid container spacing={{xs: 2, sm: 2, md: 2}} columns={{xs: 2, sm: 2, md: 4}}>
                        {list.map((v, index) => (
                            <Grid item xs={1} sm={1} md={1} key={v.id}>
                                <BookCard
                                    title={v.book_name}
                                    date={v.published_at}
                                    publisher={v.publisher_name}
                                    author={v.author_name}
                                    encImg={v.book_img}
                                    pubImg={v.publisher_img}
                                    attrs={v.attr}
                                ></BookCard>
                            </Grid>
                        ))}
                    </Grid>
                </InfiniteScroll>
            </Box>
            {/** TODO 検索条件 */}
        </Grid>
    )
}

export default Home

