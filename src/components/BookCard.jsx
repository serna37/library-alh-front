import React, {useState} from 'react'
import Card from '@mui/material/Card';
import CardHeader from '@mui/material/CardHeader';
import CardMedia from '@mui/material/CardMedia';
import CardContent from '@mui/material/CardContent';
import CardActions from '@mui/material/CardActions';
import Avatar from '@mui/material/Avatar';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';
import {red} from '@mui/material/colors';
import FavoriteIcon from '@mui/icons-material/Favorite';

export default function BookCard({title, date, publisher, author, encImg}) {
    const [_title] = useState(title)
    const [_date] = useState(date)
    const [_publisher] = useState(publisher)
    const [_author] = useState(author)
    const [_encImg] = useState(encImg)
    return (
        <Card sx={{maxWidth: 345}}>
            <CardHeader
                avatar={
                    <Avatar sx={{bgcolor: red[500]}} aria-label="book">
                        {_publisher}
                    </Avatar>
                }
                title={_title}
                subheader={_date}
            />
            <CardMedia
                component="img"
                height="194"
                src={`data:image/png;base64, ${_encImg}`}
                alt="book image"
            />
            <CardContent>
                <Typography variant="body2" color="text.secondary">
                    {_author}
                </Typography>
            </CardContent>

            <CardActions disableSpacing>
                {/**  TODO add function */}
                <IconButton aria-label="add to favorites">
                    <FavoriteIcon />
                </IconButton>
            </CardActions>
        </Card>
    );
}
