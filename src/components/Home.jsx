import React, {useEffect, useState} from 'react'
import axios from 'axios'
import {calling} from '../util/Axios.js'
import {useNavigate} from 'react-router-dom'
import {FixedSizeList} from 'react-window';
import ListItem from '@mui/material/ListItem';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemText from '@mui/material/ListItemText';
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
    const [level, setLevel] = useState("error")

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
    const [rentalState, setRentalState] = useState([])
    const toggleProfile = () => {
        if (!profileOpenFlg) {
            calling('/user/profile').then(res => {
                console.log("profile get")
                console.log(res.data)
                setProfileData(res.data.data)
                setProfileName(res.data.data[0].user_name)
                setProfileMail(res.data.data[0].mail_address)
            }).catch(e => console.log(e))

            calling('/user/rentalstate').then(res => {
                console.log('get rental state')
                console.log(res.data)
                setRentalState(res.data.data)
            }).catch(e => console.log(e))
        }
        setProfileOpenFlg(!profileOpenFlg)
    }
    function renderProf(props) {
        const {index, style} = props;
        return (
            <ListItem style={style} key={index} component="div" disablePadding>
                <ListItemButton>
                    <ListItemText primary={`${profileData[index].book_name} (${profileData[index].author_name}): ${profileData[index].action}: ${profileData[index].num}`} />
                </ListItemButton>
            </ListItem>
        );
    }
    function renderRental(props) {
        const {index, style} = props;
        return (
            <ListItem style={style} key={index} component="div" disablePadding>
                <ListItemButton>
                    <ListItemText primary={`${rentalState[index].book_name} (${rentalState[index].author_name}): ${rentalState[index].rent_num}`} />
                </ListItemButton>
            </ListItem>
        );
    }
    function renderComments(props) {
        const {index, style} = props;
        return (
            <ListItem style={style} key={index} component="div" disablePadding>
                <ListItemButton>
                    <ListItemText primary={`${commentList[index].user_name}「"${commentList[index].comments}"」`} />
                </ListItemButton>
            </ListItem>
        );
    }

    const [detailFlg, setDetailFlg] = useState(false)
    const toggleDetail = () => setDetailFlg(!detailFlg)
    const [detailData, setDetailData] = useState({})
    const [remain, setRemain] = useState(0)
    const [canRental, setCanRental] = useState(false)
    const [canReturn, setCanReturn] = useState(false)
    const [commentList, setCommentList] = useState([])
    const detailOpen = idx => {
        let data = list[idx]
        setDetailData(data)
        setCanRental(false)
        setCanReturn(false)
        calling('/book/detail', {'book_id': data.id})
            .then(res => {
                console.log(res)
                setCommentList(res.data.comments)
                let num = res.data.num
                setRemain(num)
                let token = document.cookie.split(";").map(v => v.trim()).filter(v => v.startsWith("token="))
                token = token.length === 0 ? "" : token[0].split("=")[1]
                let authed = token != ""
                setCanRental(authed && num != 0)
                let you_rental = res.data.you_rental
                setCanReturn(you_rental === 'yes')

                // open detail view
                setDetailFlg(true)
            }).catch(e => console.log(e))
    }

    function book_rental() {
        calling('/action/rental', {'book_id': detailData.id, 'num': 1})
            .then(res => {
                console.log("rental")
                setLevel("info")
                setMsg("Rental!!")
                setOpen(true)
                if (remain - 1 == 0) {
                    setCanRental(false)
                }
                setRemain(remain - 1)
            }).catch(e => {
                console.log(e)
                setMsg("need sign in")
                setLevel("error")
                setOpen(true)
            })
    }
    function book_return() {
        calling('/action/return', {'book_id': detailData.id, 'num': 1})
            .then(res => {
                setRemain(~~remain + 1)
                setCanReturn(false)
                setCanRental(false)
                console.log("return")
                setLevel("info")
                setMsg("Return. Thanks")
                setOpen(true)
            }).catch(e => {
                console.log(e)
                setMsg("need sign in")
                setLevel("error")
                setOpen(true)
            })
    }

    const [inputComment, setInputComment] = useState("")
    function sendComment() {
        if (inputComment == '') {
            setLevel("error")
            setMsg("input something")
            setOpen(true)
            return
        }
        calling('/action/comment', {'book_id': detailData.id, 'comment': inputComment})
            .then(res => {
                console.log("add comment")
                setLevel("info")
                setMsg("Send comment. Thanks")
                setOpen(true)
                setCommentList([...commentList, {'comments': inputComment, 'user_name': res.data.user_name}])
                setInputComment("")
            }).catch(e => {
                console.log(e)
                setMsg("need sign in")
                setLevel("error")
                setOpen(true)
            })
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
                    <Snackbar open={open} autoHideDuration={3000} onClose={handleClose}>
                        <Alert onClose={handleClose} severity={level} sx={{width: '100%'}}>
                            {msg}
                        </Alert>
                    </Snackbar>
                    <Typography variant="h4" component="h2">
                        detail view
                    </Typography>
                    <Divider />
                    <Box sx={{display: 'flex', flexDirection: 'row'}}>
                        <BookCard
                            idx={detailData.id}
                            func={() => {}}
                            title={detailData.book_name}
                            date={detailData.published_at}
                            publisher={detailData.publisher_name}
                            author={detailData.author_name}
                            encImg={detailData.book_img}
                            pubImg={detailData.publisher_img}
                            attrs={detailData.attr}
                        ></BookCard>
                        <Box sx={{display: 'flex', flexDirection: 'column', margin: 2}}>
                            <Box sx={{margin: 1}}>
                                Stock: {remain}
                            </Box>
                            <Divider />
                            <Box sx={{margin: 1}}>
                                <Button variant="contained" disabled={!canRental} onClick={book_rental}>
                                    Rental
                                </Button>
                            </Box>
                            <Divider />
                            <Box sx={{margin: 1}}>
                                <Button variant="contained" disabled={!canReturn} onClick={book_return}>
                                    Return
                                </Button>
                            </Box>
                            <Divider />
                            <Divider />
                            <Divider />
                            <Box sx={{margin: 1, width: 100}}>
                                <Typography variant="h4" component="h2">
                                    Commetns
                                </Typography>
                                <Divider />
                                {commentList.length == 0 ? "no data" : ""}
                                <Box sx={{width: '100%', height: 200, maxWidth: 360, bgcolor: 'background.paper'}} >
                                    <FixedSizeList
                                        height={200}
                                        width={360}
                                        itemSize={46}
                                        itemCount={commentList.length}
                                        overscanCount={5}
                                    >
                                        {renderComments}
                                    </FixedSizeList>
                                </Box>
                            </Box>
                            <Box sx={{margin: 1, width: 500}}>
                                <Typography variant="h4" component="h4">
                                    Add Your Commetns
                                </Typography>
                                <Divider />
                                <Box
                                    component="form"
                                    sx={{'& > :not(style)': {m: 1, width: '25ch'}, }}
                                    noValidate
                                    autoComplete="off"
                                >
                                    <TextField label="commets" variant="outlined" value={inputComment} onChange={e => setInputComment(e.target.value)} />
                                </Box>
                                <Button variant="contained" onClick={sendComment}>add comment</Button>
                            </Box>
                        </Box>
                    </Box>
                </Grid>
            </Drawer >
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
                        <TextField label="name" variant="standard" value={profileName} />
                    </Box>
                    <Box sx={{'& > :not(style)': {m: 1, width: '25ch'}, }} >
                        <TextField label="mail" variant="standard" value={profileMail} />
                    </Box>
                    <Divider />
                    <Typography variant="h4" component="h2">
                        Rental Status
                    </Typography>
                    {rentalState.filter(v => v.book_name != null).length == 0 ? "no data" : ""}
                    <Box sx={{width: '100%', height: 400, maxWidth: 360, bgcolor: 'background.paper'}} >
                        <FixedSizeList
                            height={400}
                            width={360}
                            itemSize={46}
                            itemCount={rentalState.filter(v => v.book_name != null).length}
                            overscanCount={5}
                        >
                            {renderRental}
                        </FixedSizeList>
                    </Box>
                    <Divider />
                    <Typography variant="h4" component="h2">
                        Action History
                    </Typography>
                    <Divider />
                    {profileData.filter(v => v.book_name != null).length == 0 ? "no data" : ""}
                    <Box sx={{width: '100%', height: 400, maxWidth: 360, bgcolor: 'background.paper'}} >
                        <FixedSizeList
                            height={400}
                            width={360}
                            itemSize={46}
                            itemCount={profileData.filter(v => v.book_name != null).length}
                            overscanCount={5}
                        >
                            {renderProf}
                        </FixedSizeList>
                    </Box>
                </Grid>
            </Drawer>
        </Grid >
    )
}

export default Home

