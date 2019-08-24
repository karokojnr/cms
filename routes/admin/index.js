const express = require('express');
const router = express.Router();
const Post = require('../../models/Post');
const Category = require('../../models/Category');
const Comment = require('../../models/Comments');
const faker = require('faker');
const { userAuthenticated } = require('../../helpers/authentication');


router.all('/*', userAuthenticated, (req,res,next) => {
    req.app.locals.layout = 'admin';
    next();
});

router.get('/', (req,res) => {
    const promises = [
        Post.countDocuments().exec(),
        Category.countDocuments().exec(),
        Comment.countDocuments().exec(),
    ];
    Promise.all(promises).then(([postCount, categoryCount, commentCount])=>{
        res.render('admin/index',{postCount: postCount, categoryCount: categoryCount, commentCount: commentCount});
    });
    //! One method of querrying for the graph
    // Post.countDocuments({})
    // .then(postCount=>{
    //     res.render('admin/index',{postCount: postCount});
    // });
});
router.post('/generate-fake-posts', (req,res) => {
    for(let i = 0 ; i <= req.body.amount; i++){
        let post = new Post();
        post.title = faker.name.title();
        post.status = 'public';
        post.allowComments = faker.random.boolean();
        post.body = faker.lorem.sentence();
        post.slug = faker.name.title();

        post.save().then(savedPost=>{});
    }
    res.redirect('/admin/posts');
});
module.exports = router;