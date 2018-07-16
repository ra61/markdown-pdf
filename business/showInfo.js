
module.exports = function (info) {

    this.html(info).fadeIn(2)
    setTimeout(() => {
        this.fadeOut(2)
    }, 2000);

};