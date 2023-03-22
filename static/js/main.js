console.log("safaff")
let deleteBtn = document.getElementById('delete')
let saveBtn = document.getElementById('save')
let form = document.querySelector('.counter')
form.onsubmit = (e) => {
    e.preventDefault()
    console.log(e.target.value)
}