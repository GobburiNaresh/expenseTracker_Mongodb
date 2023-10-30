function forgotpassword(e) {
    e.preventDefault();
    const email = e.target.email.value

    const userDetails = {
        email: email,

    }
    console.log(userDetails)

    axios.post('http://localhost:3000/password/forgotpassword',userDetails).then(response => {
        if(response.status === 200){
            document.body.innerHTML += '<div style="color:red;">Mail Successfuly sent <div>'
        } else {
            throw new Error('Something went wrong!!!')
        }
    }).catch(err => {
        document.body.innerHTML += `<div style="color:red;">${err} <div>`;
    })
}

