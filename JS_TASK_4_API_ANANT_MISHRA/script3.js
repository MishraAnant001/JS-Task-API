$(document).ready(function () {
    let table = new DataTable('#student-table');

    const showAlert = (message, className) => {
        let div = $('<div>', { "class": `alert alert-${className}` });
        div.text(`${message}!`).prependTo(".mainform")
        setTimeout(() => {
            div.remove();
        }, 1500);
    }


    const showAlertnew = (message, className) => {
        let div = $('<div>', { "class": `alert alert-${className}` });
        div.text(`${message}!`).prependTo(".mainform")
        setTimeout(() => {
            div.remove();
        }, 5000);
    }
    const showAlerthomepage = (message, className) => {
        let div = $('<div>', { "class": `alert alert-${className}` });
        div.addClass("mt-4 mx-2");
        $("#header").before(div.text(`${message}!`))
        setTimeout(() => {
            div.remove();
        }, 1500);
    }
    // showAlerthomepage("Record deleted successfully","danger");

    let TotalData = [];
    async function loadData() {
        const apiUrl = "https://65e95cf84bb72f0a9c513fd7.mockapi.io/StudentData";
        try {
            const response = await fetch(apiUrl);

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.statusText}`);
            }
            const data = await response.json();
            // console.log("🚀 ~ loadData ~ data:", data)
            data.forEach((student) => {
                // console.log(student);
                let s = {
                    Studentid: student.Studentid
                }
                // console.log(s);
                TotalData.push(s);
                // console.log(student);
                table.row.add([`<i class="bi bi-table"></i>`, student.FirstName, student.LastName, student.DateOfBirth, student.Email, student.Address, student.GraduationYear, `<td> <a href="#" class="btn btn-warning btn-sm "><i class="bi bi-pencil-square edit"  data-bs-toggle="modal" data-bs-target="#exampleModal" ></i></a>
                <a href="#" class="btn btn-danger ms-2 btn-sm "><i class="bi bi-trash delete"></i></a></td>`]).draw(true);
            });
            console.log("TotalData", TotalData);

            const format = async (index, studentID) => {
                console.log("Showing details of student with id:", studentID);
                const apiUrl = "https://65e95cf84bb72f0a9c513fd7.mockapi.io/StudentData/" + studentID;
                try {
                    const response = await fetch(apiUrl);
                    // console.log(response);
                    if (!response.ok) {
                        throw new Error(`HTTP error! status: ${response.statusText}`);
                    } else {
                        const data = await response.json();
                        // console.log("🚀 ~ showEducationDetails ~ data:", data)

                        studentEducationData = data.Education;
                        // console.log("🚀 ~ showEducationDetails ~ studentEducationData:", studentEducationData);
                        // console.log("posted data : ",data);
                        // count++;
                        let newtable = $('<table >', { "id": `table${index}`, "class": "inside-table my-2 mx-0" });
                        let thead = $('<thead><tr><th>Degree/board</th><th>School/College</th><th>Start Date</th><th>Passout Year</th><th>Percentage</th><th>Backlog</th></tr></thead>');
                        newtable.append(thead);
                        let tbody = $("<tbody></tbody>", { "id": `tbody${index}`, "class": "inside-table-tbody" });
                        $(studentEducationData).each(function (index, item) {
                            // console.log(item);
                            let tr = $(`<tr class="table-tr"><td>${item.degree}</td><td>${item.school}</td><td>${item.startDate}</td><td>${item.endYear}</td><td>${item.percentage}</td><td>${item.back}</td></tr>`);
                            tbody.append(tr);
                        })
                        newtable.append(tbody);
                        return newtable;
                    }

                }
                catch (error) {
                    console.log("Error: ", error);
                }
            }

            $(".bi-table").off('click').on('click', async function showTable() {
                let tr = $(this).closest('tr');
                let row = table.row(tr);

                if (row.child.isShown()) {
                    row.child.hide();
                } else {
                    // setTimeout(() => {
                    let student = TotalData[row.index()];
                    let res = await format(row.index(), student.Studentid);
                    row.child(res).show();
                    // }, 1500);
                }
            });


            $('#student-table').off('click', '.delete').on('click', '.delete', async function (event) {
                let row = $(this).closest("tr");
                let index = row.index();
                let newindex = table.row($(this).parents('tr')).index();
                if (confirm("Do you want to delete this record?")) {
                    table
                        .row($(this).parents('tr'))
                        .remove()
                        .draw();
                    let student = TotalData[newindex];
                    TotalData.splice(newindex, 1);
                    clearFields();
                    clearTable();
                    TotalData = [];
                    if (index == 0) {
                        
                        $('.rowdata').remove();
                    }
                    event.stopPropagation();
                    await deleteData(student.Studentid);
                    await loadData();
                    showAlerthomepage("Record deleted successfully","success");
                }
            });


            $('#student-table').off('click', '.edit').on('click', '.edit', function () {
                selectedRow = $(this).closest("tr");
                $('.rowdata').remove();
                let newindex = table.row(selectedRow).index();
                console.log("🚀 ~ newindex:", newindex)
                $("#fname").val(selectedRow.children().eq(1).text());
                $("#lname").val(selectedRow.children().eq(2).text());
                $("#dob").val(selectedRow.children().eq(3).text());
                $("#email").val(selectedRow.children().eq(4).text());
                $("#address").val(selectedRow.children().eq(5).text());
                $("#gradyear").val(selectedRow.children().eq(6).text());
                let student = TotalData[newindex];
                showEducationDetails(student.Studentid);
            });

        }
        catch (error) {
            console.log("Error: ", error);
        }

    }
    loadData();
    // console.log(TotalData);


    function clearTable() {
        table.clear().draw();
    }

    let selectedRow = null;


    const clearFields = () => {
        $("#fname").val("")
        $("#lname").val("")
        $("#dob").val("")
        $("#email").val("")
        $("#address").val("")
        $("#gradyear").val("")
    }


    $(".fa-plus-circle").click(function () {
        let $tr = $("<tr>", { "class": "rowdata" })
        $tr.append(`<td><input type="text" name="" ></td>`);
        $tr.append(`<td><input type="text" name=""></td>`);
        $tr.append(`<td><input type="month" name=""></td>`);
        $tr.append(`<td><input type="month" name=""></td>`);
        $tr.append(`<td><input type="number" name=""></td>`);
        $tr.append(`<td><input type="number" name=""></td>`);
        $tr.append(`<td><i class="fa fa-minus-circle" style="font-size:36px"></i></td>`);
        $("#myTable tbody").append($tr);
        $('.fa-minus-circle').on('click', function () {
            $(this).closest('tr').remove();
        })
    })

    validfname = true;
    validlname = true;
    validdob = true;
    validemail = true;


    $("#fname").blur(function () {
        let regex = /^[a-zA-Z]*$/;
        let str = $("#fname").val();
        let div = $('<div>', { "class": `text-danger` });
        div.text("First Name should contain characters only");
        if (!regex.test(str)) {
            validfname = false;
            $("#fname").after(div);
            setTimeout(() => {
                div.remove();
            }, 3000);
        } else {
            validfname = true;
        }
    });


    $("#lname").blur(function () {
        let regex = /^[a-zA-Z]*$/;
        let str = $("#lname").val();
        let div = $('<div>', { "class": `text-danger` });
        div.text("Last Name should contain characters only");
        if (!regex.test(str)) {
            validlname = false;
            $("#lname").after(div);
            setTimeout(() => {
                div.remove();
            }, 3000);
        } else {
            validlname = true;
        }
    });


    $("#email").blur(function () {
        var regex = /^[a-z0-9]+(\.)?[a-z0-9]+(\.)?[a-z0-9]+@[a-z]+\.[a-z]{2,3}(\.[a-z]{2,3}$)?$/;
        let str = $("#email").val();
        let div = $('<div>', { "class": `text-danger` });
        div.text("Please enter a valid Email ID");
        if (!regex.test(str)) {
            validemail = false;
            $("#email").after(div);
            setTimeout(() => {
                div.remove();
            }, 3000);
        } else {
            validemail = true;
        }
    });


    $("#dob").blur(function () {
        var today = new Date();
        let current_year = today.getFullYear();
        let user_year = new Date($("#dob").val()).getFullYear();
        let div = $('<div>', { "class": `text-danger` });
        div.text("Your age must be greater than 18 years");
        if (current_year - user_year < 18) {
            $("#dob").after(div);
            setTimeout(() => {
                div.remove();
            }, 3000);
            validdob = false;
        } else {
            validdob = true;
        }
    });


    let educationData = [];


    let validateEducation = () => {
        let n = $('.rowdata').length;
        // console.log("🚀 ~ validateEducation ~ n:", n)
        let arr = new Array(n).fill(false)
        // console.log("🚀 ~ validateEducation ~ arr:", arr)
        let flag = true;
        $('.rowdata').each(function (index, element) {
            let degree = $(element).children().eq(0).children().val();
            let school = $(element).children().eq(1).children().val();
            let startdate = $(element).children().eq(2).children().val();
            // console.log("🚀 ~ startdate:", startdate)
            let passoutyear = $(element).children().eq(3).children().val();
            let Percentage = $(element).children().eq(4).children().val();
            let back = $(element).children().eq(5).children().val();

            if (degree == "" || school == "" || startdate == "" || passoutyear == "" || Percentage == "" || back == "") {
                showAlertnew(`Please fill all fields of Education Section Row ${index + 1}!`, "danger");
                flag = false;
                return false;
            }
            else if (startdate > passoutyear) {
                showAlertnew(`please enter valid start date and passout year in Education Section Row ${index + 1}!`, "danger");
                flag = false;
                return false;
            }
            else if (Percentage < 33 || Percentage > 100) {
                showAlertnew(`please enter valid percentage in Education Section Row ${index + 1}!`, "danger");
                flag = false;
                return false;
            }
            else if (back > 10 || back < 0) {
                showAlertnew(`please enter valid backlogs in Education Section Row ${index + 1}!`, "danger");
                flag = false;
                return false;
            }
            else {
                if (arr[index] == false) {
                    // console.log("writing values at ", index);
                    // e = new Education(degree, school, startdate, passoutyear, Percentage, back);
                    // educationData.push(e)
                    arr[index] = true;
                }
            }
        });
        let finalflag = true;
        // console.log(arr);
        arr.forEach((value) => {
            if (value == false) {
                finalflag = false;
            }
        })
        if (finalflag == true && n > 0) {
            $('.rowdata').each(function (index, element) {
                let degree = $(element).children().eq(0).children().val();
                let school = $(element).children().eq(1).children().val();
                let startdate = $(element).children().eq(2).children().val();
                let passoutyear = $(element).children().eq(3).children().val();
                let Percentage = $(element).children().eq(4).children().val();
                let back = $(element).children().eq(5).children().val();
                // console.log("writing values at ", index);
                e = new Education(degree, school, startdate, passoutyear, Percentage, back);
                educationData.push(e)
            });
        }

        return flag;
    }


    $('#adddata').click(() => {
        clearFields();
        $('.rowdata').remove();
    });

    // let count=1;

    async function updateData(studentID, fname, lname, dob, email, address, gradyear, educationData) {
        console.log("Updating details of student with id:", studentID);
        const apiUrl = "https://65e95cf84bb72f0a9c513fd7.mockapi.io/StudentData/" + studentID;
        const newdata = {
            Studentid: studentID,
            FirstName: fname,
            LastName: lname,
            DateOfBirth: dob,
            Email: email,
            Address: address,
            GraduationYear: gradyear,
            Education: educationData
        }

        const requestOptions = {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(newdata)
        }
        try {
            const response = await fetch(apiUrl, requestOptions);

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.statusText}`);
            }
            const data = await response.json();
            // console.log("posted data : ", data);
            console.log("TotalData", TotalData);
            // count++;
        }
        catch (error) {
            console.log("Error: ", error);
        }

    }


    async function postData(fname, lname, dob, email, address, gradyear, educationData) {
        const apiUrl = "https://65e95cf84bb72f0a9c513fd7.mockapi.io/StudentData";

        const newdata = {
            FirstName: fname,
            LastName: lname,
            DateOfBirth: dob,
            Email: email,
            Address: address,
            GraduationYear: gradyear,
            Education: educationData
        }

        const requestOptions = {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(newdata)
        }
        try {
            const response = await fetch(apiUrl, requestOptions);

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.statusText}`);
            }
            const data = await response.json();
            // console.log("posted data : ", data);
            // let s = {
            //     Studentid: data.Studentid
            // }
            // // console.log(s);
            // TotalData.push(s);
            console.log("TotalData", TotalData);
            // count++;

        }
        catch (error) {
            console.log("Error: ", error);
        }

    }

    async function deleteData(studentID) {
        console.log("Deleting details of student with id:", studentID);
        const apiUrl = "https://65e95cf84bb72f0a9c513fd7.mockapi.io/StudentData/" + studentID;
        try {
            const response = await fetch(apiUrl, { method: 'DELETE' });
            console.log(response);
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.statusText}`);
            }
            const data = await response.json();
            // console.log("posted data : ", data);
            console.log("TotalData", TotalData);
            // count++;
        }
        catch (error) {
            console.log("Error: ", error);
        }
    }


    async function showEducationDetails(studentID) {
        const apiUrl = "https://65e95cf84bb72f0a9c513fd7.mockapi.io/StudentData/" + studentID;
        try {
            const response = await fetch(apiUrl);
            console.log(response);
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.statusText}`);
            } else {
                const data = await response.json();
                console.log("🚀 ~ showEducationDetails ~ data:", data)

                studentEducationData = data.Education;
                console.log("🚀 ~ showEducationDetails ~ studentEducationData:", studentEducationData);
                // console.log("posted data : ",data);
                // count++;
                let n = studentEducationData.length;
                console.log("🚀 ~ n:", n)
                for (let i = 0; i < n; i++) {
                    let $tr = $("<tr>", { "class": "rowdata" })
                    $tr.append(`<td><input type="text" name=""  value ="${studentEducationData[i].degree}"></td>`);
                    $tr.append(`<td><input type="text" name="" value ="${studentEducationData[i].school}"></td>`);
                    $tr.append(`<td><input type="month" name="" value ="${studentEducationData[i].startDate}"></td>`);
                    $tr.append(`<td><input type="month" name="" value ="${studentEducationData[i].endYear}"></td>`);
                    $tr.append(`<td><input type="number" name="" value ="${studentEducationData[i].percentage}"></td>`);
                    $tr.append(`<td><input type="number" name="" value ="${studentEducationData[i].back}"></td>`);
                    $tr.append(`<td><i class="fa fa-minus-circle" style="font-size:36px"></i></td>`);
                    $("#myTable tbody").append($tr);
                    $('.fa-minus-circle').on('click', function () {
                        // let index = $(this).closest('tr').index()
                        // console.log("🚀 ~ index:", index)
                        // data.splice(index,1);
                        $(this).closest('tr').remove();
                    });
                };
            }

        }
        catch (error) {
            console.log("Error: ", error);
        }

    }


    $("#submitbtn").on({
        "click": async function submitdata() {
            let fname = $("#fname").val();
            let lname = $("#lname").val();
            let dob = $("#dob").val();
            let email = $("#email").val();
            let address = $("#address").val();
            let gradyear = $("#gradyear").val();

            if (fname == "" || dob == "" || email == "" || address == "" || gradyear == "") {
                showAlert("Please fill in all fields ! ", "danger");
            }
            else if (validfname == false) {
                showAlert("Please fill valid First name ! ", "danger");
            } else if (validemail == false) {
                showAlert("Please fill valid Email id !", "danger");
            } else if (validlname == false) {
                showAlert("Please fill valid Last Name !", "danger");
            } else if (validdob == false) {
                showAlert("Please fill valid Date of birth !", "danger")
            }
            else {
                if (selectedRow == null) {
                    // console.log("new data");
                    let x = validateEducation();
                    if (x == false) {
                        return;
                    }
                    else {
                        // s = new Student(fname, lname, dob, email, address, gradyear, educationData);
                        table.row.add([`<i class="bi bi-table"></i>`, fname, lname, dob, email, address, gradyear, `<td> <a href="#" class="btn btn-warning btn-sm "><i class="bi bi-pencil-square edit"  data-bs-toggle="modal" data-bs-target="#exampleModal" ></i></a>
                        <a href="#" class="btn btn-danger ms-2 btn-sm "><i class="bi bi-trash delete"></i></a></td>`]).draw(true);
                        setTimeout(() => {
                            $("#exampleModal").modal("hide");
                        }, 1500);
                        showAlert("Data added Successfully", "success");
                        clearFields();
                        $('.rowdata').remove();
                        clearTable();
                        TotalData = [];
                        await postData(fname, lname, dob, email, address, gradyear, educationData);
                        await loadData();
                        educationData = []
                    }
                }
                else {
                    let x = validateEducation();
                    console.log("update data");
                    if (x == false) {
                        return;
                    }
                    else {
                        let newindex = table.row(selectedRow).index();
                        newData = [`<i class="bi bi-table"></i>`, fname, lname, dob, email, address, gradyear, `<td> <a href="#" class="btn btn-warning btn-sm "><i class="bi bi-pencil-square edit"  data-bs-toggle="modal" data-bs-target="#exampleModal" ></i></a>
                            <a href="#" class="btn btn-danger ms-2 btn-sm "><i class="bi bi-trash delete"></i></a></td>`]
                        console.log("🚀 ~ submitdata ~ newData:", newData)
                        let index = selectedRow.index();
                        console.log("🚀 ~ submitdata ~ index:", index)
                        let student = TotalData[newindex];
                        console.log(student.Studentid);
                        updateData(student.Studentid, fname, lname, dob, email, address, gradyear, educationData);
                        // console.log("hi");
                        // console.log("🚀 ~ submitdata ~ table.row(index):", table.row(index))
                        // console.log("🚀 ~ submitdata ~ table.row(index).text():", table.row(index).text())
                        // console.log("🚀 ~ submitdata ~ table.row(index).data():", table.row(index).data())
                        // console.log(table.row(index).text());
                        // console.log(table.row(index).html());
                        table.row(newindex).data(newData).draw(true);
                        console.log("hello");
                        selectedRow = null;
                        // let data = allData[index].educationdata;
                        // console.log(data[0].degree.val());
                        setTimeout(() => {
                            $("#exampleModal").modal("hide");
                        }, 1500);
                        showAlert("Data updated Successfully", "info");
                        // console.log(allData);
                        clearFields();
                        educationData = []

                    }
                }
            }


            const format = async (index, studentID) => {
                console.log("Showing details of student with id:", studentID);
                const apiUrl = "https://65e95cf84bb72f0a9c513fd7.mockapi.io/StudentData/" + studentID;
                try {
                    const response = await fetch(apiUrl);
                    // console.log(response);
                    if (!response.ok) {
                        throw new Error(`HTTP error! status: ${response.statusText}`);
                    } else {
                        const data = await response.json();
                        // console.log("🚀 ~ showEducationDetails ~ data:", data)

                        studentEducationData = data.Education;
                        // console.log("🚀 ~ showEducationDetails ~ studentEducationData:", studentEducationData);
                        // console.log("posted data : ",data);
                        // count++;
                        let newtable = $('<table >', { "id": `table${index}`, "class": "inside-table my-2 mx-0" });
                        let thead = $('<thead><tr><th>Degree/board</th><th>School/College</th><th>Start Date</th><th>Passout Year</th><th>Percentage</th><th>Backlog</th></tr></thead>');
                        newtable.append(thead);
                        let tbody = $("<tbody></tbody>", { "id": `tbody${index}`, "class": "inside-table-tbody" });
                        $(studentEducationData).each(function (index, item) {
                            // console.log(item);
                            let tr = $(`<tr class="table-tr"><td>${item.degree}</td><td>${item.school}</td><td>${item.startDate}</td><td>${item.endYear}</td><td>${item.percentage}</td><td>${item.back}</td></tr>`);
                            tbody.append(tr);
                        })
                        newtable.append(tbody);
                        return newtable;
                    }

                }
                catch (error) {
                    console.log("Error: ", error);
                }

            }

            $(".bi-table").off('click').on('click', async function showTable() {
                let tr = $(this).closest('tr');
                let row = table.row(tr);

                if (row.child.isShown()) {
                    row.child.hide();
                } else {
                    // setTimeout(() => {
                    let student = TotalData[row.index()];
                    console.log("🚀 ~ //setTimeout ~ row.index():", row.index())
                    let res = await format(row.index(), student.Studentid);
                    row.child(res).show();
                    // }, 1500);
                }
            });


            $('#student-table').off('click', '.delete').on('click', '.delete', async function (event) {
                let row = $(this).closest("tr");
                let index = row.index();
                let newindex = table.row($(this).parents('tr')).index();
                if (confirm("Do you want to delete this record?")) {
                    table
                        .row($(this).parents('tr'))
                        .remove()
                        .draw();
                    let student = TotalData[newindex];
                    TotalData.splice(newindex, 1);
                    clearFields();
                    clearTable();
                    TotalData = [];
                    if (index == 0) {
                        
                        $('.rowdata').remove();
                    }
                    event.stopPropagation();
                    await deleteData(student.Studentid);
                    await loadData();
                    showAlerthomepage("Record deleted successfully","success");
                }
            });


            $('#student-table').off('click', '.edit').on('click', '.edit', function () {
                selectedRow = $(this).closest("tr");
                $('.rowdata').remove();
                let newindex = table.row(selectedRow).index();
                console.log("🚀 ~ newindex:", newindex)
                $("#fname").val(selectedRow.children().eq(1).text());
                $("#lname").val(selectedRow.children().eq(2).text());
                $("#dob").val(selectedRow.children().eq(3).text());
                $("#email").val(selectedRow.children().eq(4).text());
                $("#address").val(selectedRow.children().eq(5).text());
                $("#gradyear").val(selectedRow.children().eq(6).text());
                let student = TotalData[newindex];
                showEducationDetails(student.Studentid);
            });


        }
    })


    // class Student {
    //     constructor(fname, lname, dob, email, address, gradyear, educationdata) {
    //         this.fname = fname;
    //         this.lname = lname;
    //         this.dob = dob;
    //         this.email = email;
    //         this.address = address;
    //         this.gradyear = gradyear;
    //         this.educationdata = educationdata;
    //     }
    // }


    class Education {
        constructor(degree, school, startdate, passoutyear, Percentage, back) {
            this.degree = degree;
            this.school = school;
            this.startDate = startdate;
            this.endYear = passoutyear;
            this.percentage = Percentage;
            this.back = back;
        }
    }
})


