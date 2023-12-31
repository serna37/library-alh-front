import React, {useEffect, useState} from 'react'
import axios from 'axios'
import {calling} from '../util/Axios.js'
import {useNavigate} from 'react-router-dom'
import Drawer from '@mui/material/Drawer';
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
import {AdapterDayjs} from '@mui/x-date-pickers/AdapterDayjs';
import {LocalizationProvider} from '@mui/x-date-pickers/LocalizationProvider';
import {DatePicker} from '@mui/x-date-pickers/DatePicker';
import Divider from '@mui/material/Divider';
import CircularProgress from '@mui/material/CircularProgress';

const Home = ({host}) => {
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
    const [bookName, setBookName] = useState('')
    const [authorName, setAuthorName] = useState('')
    const [publisherName, setPublisherName] = useState('')
    const [publishedFrom, setPublishedFrom] = useState('')
    const [publishedTo, setPublishedTo] = useState('')

    function getBooks(pageNo) {
        let from = publishedFrom == '' ? '' : new Date(publishedFrom).toLocaleDateString()
        let to = publishedTo == '' ? '' : new Date(publishedTo).toLocaleDateString()
        if (from != '') {
            from = from.split('/')
            from = from[0] + '-' + from[1].padStart(2, '0') + '-' + from[2].padStart(2, '0')
        }
        if (to != '') {
            to = to.split('/')
            to = to[0] + '-' + to[1].padStart(2, '0') + '-' + to[2].padStart(2, '0')
        }
        calling('/book/search', {
            book_name: bookName,
            author_name: authorName,
            publisher_name: publisherName,
            published_from: from,
            published_to: to,
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

    function clearResult() {
        setList([])
    }

    function search() {
        clearResult()
        setHasNext(true)
        //getBooks()
    }

    useEffect(() => {
        getBooks()
    }, [])

    const [drawerFlg, setDrawerFlg] = useState(false)
    const toggleDrawer = () => setDrawerFlg(!drawerFlg)

    const [profileOpenFlg, setProfileOpenFlg] = useState(false)
    const [profileName, setProfileName] = useState("")
    const [profileMail, setProfileMail] = useState("")
    const [profileData, setProfileData] = useState([])
    const toggleProfile = () => {
        if (!profileOpenFlg) {
            calling('/user/profile').then(res => {
                console.log("profile get")
                console.log(res.data)
                setProfileData(res.data.data)
                setProfileName(res.data.data[0].user_name)
                setProfileMail(res.data.data[0].mail_address)
            }).catch(e => console.log(e))
        }
        setProfileOpenFlg(!profileOpenFlg)
    }

    const [detailFlg, setDetailFlg] = useState(false)
    const toggleDetail = () => setDetailFlg(!detailFlg)
    const [detailData, setDetailData] = useState({})
    const detailOpen = idx => {
        setDetailFlg(true)
        let data = list[idx]
        setDetailData(data)
    }

    return (
        <Grid>
            <Header host={host} ff={toggleDrawer} isProfile={false} profile={toggleProfile} />
            <Drawer
                anchor={'left'}
                open={drawerFlg}
                onClose={toggleDrawer}
            >
                <Grid>
                    <Typography variant="h4" component="h2">
                        Fuzzy Search
                    </Typography>
                    <Divider />

                    <Box
                        component="form"
                        sx={{'& > :not(style)': {m: 1, width: '25ch'}, }}
                        noValidate
                        autoComplete="off"
                    >
                        <TextField label="book name" variant="standard" value={bookName} onChange={e => setBookName(e.target.value)} />
                    </Box>
                    <Box
                        component="form"
                        sx={{'& > :not(style)': {m: 1, width: '25ch'}, }}
                        noValidate
                        autoComplete="off"
                    >
                        <TextField label="author name" variant="standard" value={authorName} onChange={e => setAuthorName(e.target.value)} />
                    </Box>
                    <Box
                        component="form"
                        sx={{'& > :not(style)': {m: 1, width: '25ch'}, }}
                        noValidate
                        autoComplete="off"
                    >
                        <TextField label="publisher name" variant="standard" value={publisherName} onChange={e => setPublisherName(e.target.value)} />
                    </Box>
                    <Divider />
                    <Box
                        component="form"
                        sx={{'& > :not(style)': {m: 1, width: '25ch'}, }}
                        noValidate
                        autoComplete="off"
                    >
                        <LocalizationProvider dateAdapter={AdapterDayjs}>
                            <DatePicker label="published from" value={publishedFrom} onChange={e => setPublishedFrom(e)} />
                        </LocalizationProvider>
                    </Box>
                    <Box
                        component="form"
                        sx={{'& > :not(style)': {m: 1, width: '25ch'}, }}
                        noValidate
                        autoComplete="off"
                    >
                        <LocalizationProvider dateAdapter={AdapterDayjs}>
                            <DatePicker label="published to" value={publishedTo} onChange={e => setPublishedTo(e)} />
                        </LocalizationProvider>
                    </Box>
                    <Button variant="contained" onClick={search}>Search</Button>
                </Grid>
            </Drawer>
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
                                    idx={index}
                                    func={detailOpen}
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
            <Drawer
                anchor={'bottom'}
                open={detailFlg}
                onClose={toggleDetail}
            >
                <Grid>
                    <Typography variant="h4" component="h2">
                        detail view
                    </Typography>
                    <Divider />
                    <BookCard
                        idx={-1}
                        func={() => {}}
                        title={detailData.book_name}
                        date={detailData.published_at}
                        publisher={detailData.publisher_name}
                        author={detailData.author_name}
                        encImg={detailData.book_img}
                        pubImg={detailData.publisher_img}
                        attrs={detailData.attr}
                    ></BookCard>

                </Grid>
            </Drawer>
            <Drawer
                anchor={'right'}
                open={profileOpenFlg}
                onClose={toggleProfile}
            >
                <Grid>
                    <Typography variant="h4" component="h2">
                        Profile
                    </Typography>
                    <Divider />
                    <Box sx={{'& > :not(style)': {m: 1, width: '25ch'}, }} >
                        <TextField label="mail" variant="standard" value={profileName} />
                    </Box>
                    <Box sx={{'& > :not(style)': {m: 1, width: '25ch'}, }} >
                        <TextField label="mail" variant="standard" value={profileMail} />
                    </Box>
                </Grid>
            </Drawer>
        </Grid>
    )
}

export default Home

