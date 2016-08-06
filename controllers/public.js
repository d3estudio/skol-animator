module.exports = {
    index: (req, res) => {
        res.render('index.html');
    },
    mobile: (req, res) => {
        res.render('mobile.html');
    },
    snake: (req, res) => {
        res.render('snake.html');
    },
    prototype: (req, res) => {
        res.render('prototype.html');
    }
};
