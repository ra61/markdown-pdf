
module.exports = function(){

    let path = this.val();

    if (path){
        return {success: true, path: this[0].files[0].path}
    } else {
        return { success: false, info: '请选择' + this.attr("title")}
    }
    
}