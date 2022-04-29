
const a = async (l) => {
    l.push(1);
    l.push(2);
}

var x= [];

var _x =  a(x);
x.forEach((t)=>{
    console.log(t);
})