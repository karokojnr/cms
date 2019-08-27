const express = require('express');
const router = express.Router();
const Post = require('../../models/Post');
const Category = require('../../models/Category');
const { isEmpty, uploadDir } = require('../../helpers/upload-helper');
const fs = require('fs');
const { userAuthenticated } = require('../../helpers/authentication');
const cloudinary = require('cloudinary');

app.use(fileUpload({
    useTempFiles: true
}));

cloudinary.config({
    cloud_name : 'karokojnr',
    api_key: '346784416385434',
    api_secret: 'oinDoqFA3NRMY66lPMV-M5NOCgQ'
});
router.all('/*', userAuthenticated, (req,res,next) => {
    req.app.locals.layout = 'admin';
    next();
});

router.get('/', (req,res) => {
    Post.find({})
    .populate('category')
    .then(postss =>{
        res.render('admin/posts',{posts : postss});
    }).catch(err => {
        return err;
    });

});

router.get('/create', (req,res) => {
    Category.find({}).then(categories=>{
        res.render('admin/posts/create',{categories:categories});

    });
});
router.post('/create', (req,res) => {
    let errors = [];
    if (!req.body.title){
        errors.push({message : 'please add a title'});
    }
    if (!req.body.status){
        errors.push({message : 'please add a status'});
    }
    if (!req.body.body){
        errors.push({message : 'please add a description'});
    }
    if (errors.length > 0){
        res.render('admin/posts/create', {
            errors: errors
        })
    }else{

    let filename = '';

    if(!isEmpty(req.files)){

    let file = req.files.file;
    filename = Date.now() + '-' + file.name;
    cloudinary.uploader.upload(file.tempFilePath, (err,result)=>{
        res.send({
            success: true,
            result
        });
    });

    //error -> ./public/uploads
    // file.mv('./public/uploads/' + filename,(err) => {
    //     if (err) throw err;
    // });
    // }
    let allowComments =true;
    if (req.body.allowComments){
        allowComments = true;
    }else{
        allowComments = false;
    }
    const newPost = new Post({
        user:req.user.id,
        title: req.body.title,
        status: req.body.status,
        allowComments: allowComments,
        body: req.body.body,
        category: req.body.category,
        file: filename
    });
    newPost.save()
        .then(savedPost => {
        console.log(savedPost);
        req.flash('success_message',`${savedPost.title} was created successfully`);

        res.redirect('/admin/posts');
    }).catch(err => {
        console.log(err);
    });
    }
}
});
router.get('/edit/:id', (req,res) => {
    //res.send(req.params.id);
    Post.findOne({_id : req.params.id})
    .then(post =>{
        Category.find({}).then(categories=>{
            res.render('admin/posts/edit',{post : post,categories:categories});
        });
    }).catch(err => {
        return err;
    });
});
router.put('/edit/:id',(req,res) =>{
    Post.findOne({_id : req.params.id})
    .then(post =>{
    let allowComments =true;
    if (req.body.allowComments){
        allowComments = true;
    }else{
        allowComments = false;
    }
        post.user = req.user.id;
        post.title = req.body.title;
        post.status = req.body.status;
        post.allowComments = allowComments;
        post.body = req.body.body;
        post.category = req.body.category;

        if(!isEmpty){

            let file = req.files.file;
            filename = Date.now() + '-' + file.name;
            post.file = filename;
            file.mv('./public/uploads' + filename,(err) => {
                if (err) throw err;
            });
        }

        post.save().then(updatedPost => {
            req.flash('success_message',`${updatedPost.title} was updated successfully`);
            res.redirect('/admin/posts/my-posts')

        });

        // res.render('admin/posts/edit',{post : post});
    }).catch(err => {
        return err;
    });
});
router.delete('/:id', (req,res)=>{
        Post.findOne({_id: req.params.id})
        .populate('comments')
        .then(post => {
            fs.unlink(uploadDir + post.file, (err)=>{
                if(post.comments.length < 1){
                    post.comments.forEach(comment=>{
                        comment.remove();
                    });
                }
                post.remove()
                .then(postRemoved=>{
                    req.flash('success_message',`${post.title} was deleted successfully`);
                    res.redirect('/admin/posts/my-posts');
                });

            });
            //res.redirect('/admin/posts');
        }).catch(err =>{
            console.log(err);
        });
});
router.get('/my-posts',(req,res)=>{
    Post.find({user: req.user.id})
    // !Fetch posts by specific user
    .populate('category')
    .then(postss =>{
        res.render('admin/posts/my-posts',{posts : postss});
    }).catch(err => {
        return err;
    });
});
module.exports = router;