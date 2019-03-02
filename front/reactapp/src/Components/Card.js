import React from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import classnames from 'classnames';
import Card from '@material-ui/core/Card';
import CardHeader from '@material-ui/core/CardHeader';
import CardMedia from '@material-ui/core/CardMedia';
import CardContent from '@material-ui/core/CardContent';
import CardActions from '@material-ui/core/CardActions';
import Collapse from '@material-ui/core/Collapse';
import Avatar from '@material-ui/core/Avatar';
import IconButton from '@material-ui/core/IconButton';
import Typography from '@material-ui/core/Typography';
import red from '@material-ui/core/colors/red';
import FavoriteIcon from '@material-ui/icons/Favorite';
import ShareIcon from '@material-ui/icons/Share';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import MoreVertIcon from '@material-ui/icons/MoreVert';
import Menu from '@material-ui/core/Menu';
import MenuItem from '@material-ui/core/MenuItem';

const options = [
  'Relais Chateau link',
];

const styles = theme => ({
  card: {
    maxWidth: 900,
  },
  media: {
    height: 0,
    paddingTop: '56.25%', // 16:9
  },
  actions: {
    display: 'flex',
  },
  expand: {
    transform: 'rotate(0deg)',
    marginLeft: 'auto',
    transition: theme.transitions.create('transform', {
      duration: theme.transitions.duration.shortest,
    }),
  },
  expandOpen: {
    transform: 'rotate(180deg)',
  },
  avatar: {
    backgroundColor: red[500],
  },
});

class RecipeReviewCard extends React.Component {
  state = { expanded: false };

  handleExpandClick = () => {
    this.setState(state => ({ expanded: !state.expanded }));
  };


  render() {
    const { classes } = this.props;

    return (
      <Card className={classes.card}>
        <CardHeader
          avatar={
            <Avatar aria-label="Recipe" className={classes.avatar}>
              {this.props.item.name[0]}
            </Avatar>
          }
          action={

            <IconButton>
              <MoreVertIcon />
            </IconButton>
            
          }
          title= {this.props.item.name}
          subheader={this.props.item.city}
        />
        <CardMedia
          className={classes.media}
          image={this.props.item.image}
          title="Hotel image"
        />
        <CardContent>
          <Typography component="p">
            {this.props.item.citation}
          </Typography>
        </CardContent>
        <CardActions className={classes.actions} disableActionSpacing>
          <IconButton
            className={classnames(classes.expand, {
              [classes.expandOpen]: this.state.expanded,
            })}
            onClick={this.handleExpandClick}
            aria-expanded={this.state.expanded}
            aria-label="Show more"
          >
            <ExpandMoreIcon />
          </IconButton>
        </CardActions>
        <Collapse in={this.state.expanded} timeout="auto" unmountOnExit>
          <CardContent>
            <Typography paragraph>Description:</Typography>
            <Typography paragraph>
              {this.props.item.desc}
            </Typography>
            <Typography paragraph>
              Restaurants:
            </Typography>
            <Typography paragraph>
                <ul>
                    {this.props.item.rest.map((resto) => {
                      if(resto.name != null && resto.star > 1){
                        return (
                          <li>
                              {resto.name} | {resto.star} étoiles
                          </li>
                      )
                      }
                      if(resto.name != null && resto.star === null){
                        return(
                          <li>
                            {resto.name} | Non reconnu par le site Michelin
                          </li>
                        )
                      }
                      if(resto.name != null && resto.star <= 1 && resto.star >= 0){
                        return (
                          <li>
                              {resto.name} | {resto.star} étoile
                          </li>
                      )
                      }
                      else{
                        return (
                          <p></p>
                      )
                      }
                        
                    })}
                </ul>
            </Typography>
          </CardContent>
        </Collapse>
      </Card>
    );
  }
}

RecipeReviewCard.propTypes = {
  classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(RecipeReviewCard);