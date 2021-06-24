const user_route = require('./app/modules/user/routes/user.route');
const post_route = require('./app/modules/post/routes/post.route');

module.exports = [
    {
        path: '/api/v1/user',
        handler: user_route
    },
    {
        path: '/api/v1/post',
        handler: post_route
    }
]