let test =  async ()=>{
    const apiUrl = "https://65e95cf84bb72f0a9c513fd7.mockapi.io/StudentData";
    let response =  await fetch(apiUrl);
    // console.log(response);
    let data = await response.json();
    console.log(data);

    
}
test();

// async function updateId () {
//     const apiUrl = "https://65e95cf84bb72f0a9c513fd7.mockapi.io/StudentData/1";

//     const newdata = {
//         Studentid: "2"
//     }
//     // console.log(JSON.stringify(newdata));
//     const requestOptions={
//         method : 'PUT',
//         headers : {
//             'Content-Type' : 'application/json'
//         },
//         body : JSON.stringify(newdata)
//     }
//     console.log("🚀 ~ updateId ~ requestOptions.body", requestOptions.body)
//     try{
//         const response = await fetch(apiUrl,requestOptions);
        
//         if(!response.ok){
//             throw new Error(`HTTP error! status: ${response.statusText}`);
//         }
//         console.log(`HTTP error! status: ${response.statusText}`);
//         const data = await response.json();
//         console.log("posted data : ",data);
//     }
//     catch(error){
//         console.log("Error: ",error);
//     }
// }
// updateId ();