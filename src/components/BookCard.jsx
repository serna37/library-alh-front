import React, {useState} from 'react'
import Card from '@mui/material/Card';
import {CardActionArea} from '@mui/material';
import CardHeader from '@mui/material/CardHeader';
import CardMedia from '@mui/material/CardMedia';
import CardContent from '@mui/material/CardContent';
import CardActions from '@mui/material/CardActions';
import Avatar from '@mui/material/Avatar';
import Typography from '@mui/material/Typography';
import Chip from '@mui/material/Chip';
import Stack from '@mui/material/Stack';
import Divider from '@mui/material/Divider';
//import FavoriteIcon from '@mui/icons-material/Favorite';

export default function BookCard({idx, func, title, date, publisher, author, encImg, pubImg, attrs}) {
    const [_idx] = useState(idx)
    //const [_func] = useState(func)
    const [_title] = useState(title)
    const [_date] = useState(date)
    const [_publisher] = useState(publisher)
    const [_author] = useState(author)
    const [_encImg] = useState(encImg)
    const [_pubImg] = useState(pubImg)
    const [_attrs] = useState(attrs)

    const handleClick = () => {
        // noop
    };

    return (
        <Card sx={{maxWidth: 345}}>
            <CardHeader
                avatar={
                    <Avatar alt="publisher" src={`data:image/png;base64, ${_pubImg}`} />
                }
                title={_title}
            />
            <CardActionArea onClick={() => {
                console.log(func)
                func(_idx)
                //console.log(_func)
                //console.log(_func(_idx))
            }}>
                <CardMedia
                    component="img"
                    height="350"
                    src={`data:image/png;base64, ${_encImg}`}
                    alt="book image"
                />
            </CardActionArea>
            <CardContent>
                <Typography variant="body2" color="text.secondary">
                    Author: {_author}<br />
                    <Divider />
                    Publisher: {_publisher}<br />
                    PublishedAt:<br />{_date}<br />
                    <Divider /><br />
                </Typography>
                <Stack direction="row" spacing={1} useFlexGap flexWrap="wrap">
                    {/**
                    <IconButton aria-label="add to favorites">
                        <FavoriteIcon />
                    </IconButton>
                    */}
                    {_attrs.split(",").map((v, _) => (
                        <Chip label={v} variant="outlined" onClick={handleClick} />
                    ))}
                </Stack>
            </CardContent>

            <CardActions disableSpacing>
            </CardActions>
        </Card>
    );
}
