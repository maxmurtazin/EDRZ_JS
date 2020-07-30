setInterval(function() {
    console.log('D0:'+ analogRead(A5));
    console.log('C3:'+ analogRead(A4));
    console.log('C1:'+ analogRead(A0));
    console.log('D1:'+ analogRead(A1));
    console.log('C2:'+ analogRead(A2));
    console.log('D2:'+ analogRead(A3));
}, 3000);