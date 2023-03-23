let deleteBtn = document.getElementById('delete')
let saveBtn = document.getElementById('save')
let form = document.querySelector('.counter')
let formInputs = document.querySelectorAll('input')
let tbody = document.getElementById('tbody')

let id = 0

// Table Row Events
function tableTrEvent(ele) {
    let tableTr = document.querySelectorAll('tr')
    console.log(ele.id)
    tableTr.forEach((e) => {
        e.classList = ''
    })
    ele.classList += 'bg-primary'

    form.reset()
    for (var i = 0; i < 9; i++) {
        formInputs.forEach((input) => {
            try {
                if (input.id === ele.children[i].classList.toString()) {
                    input.value = parseInt(ele.children[i].innerText)
                };
            } catch (error) { }

        });
    };
    document.getElementById('utr').innerText = ele.id
}


// Handel Form Submit
form.onsubmit = (e) => {
    document.querySelector('.load').classList.remove('hidden')
    e.preventDefault()
    let data = {}

    formInputs.forEach((e) => {
        data[e.id] = e.value
    })
    if (document.getElementById('utr').innerText != '') {
        updateTableRow(document.getElementById('utr').innerText, data)
    } else {
        console.log(document.getElementById('utr').innerText, data)
        sendData(data)
    }
    form.reset()

}

deleteBtn.onclick = () => {
    form.reset()
}


// Handel Sending Form Data
async function sendData(data) {
    const request = await fetch('/data/', {
        method: 'POST',
        headers: {
            'content-type': 'application/json',
            'X-CSRFToken': csrftoken
        },
        body: JSON.stringify(data)
    });
    const response = await request.json()
    let subTotal = countTotal(response)

    tbody.innerHTML += `
        <tr id="${id}" onclick="tableTrEvent(this)">
            <td class="brick-height">${response['brick-height']}</td>
            <td class="brick-length">${response['brick-length']}</td>
            <td class="wall-height">${response['wall-height']}</td>
            <td class="wall-length">${response['wall-length']}</td>
            <td class="amount-of-sand">${response['amount-of-sand']}</td>
            <td class="amount-of-cement">${response['amount-of-cement']}</td>
            <td class="amount-of-brick">${response['amount-of-brick']}</td>
            <td class="amount-of-water">${response['amount-of-water']}</td>
            <td class="sub-total">${subTotal}</td>
        </tr>`
    id += 1

    let total = document.getElementById('total')
    total.innerHTML = `<span>${parseInt(total.innerText) + response['total']}</span>`
    document.querySelector('.load').classList.add('hidden')
}

async function updateTableRow(id, data) {
    const request = await fetch('/data/', {
        method: 'POST',
        headers: {
            'content-type': 'application/json',
            'X-CSRFToken': csrftoken
        },
        body: JSON.stringify(data)
    });
    const response = await request.json()
    let subTotal = countTotal(response)

    document.getElementById(`${id}`).innerHTML = `
        <td class="brick-height">${response['brick-height']}</td>
        <td class="brick-length">${response['brick-length']}</td>
        <td class="wall-height">${response['wall-height']}</td>
        <td class="wall-length">${response['wall-length']}</td>
        <td class="amount-of-sand">${response['amount-of-sand']}</td>
        <td class="amount-of-cement">${response['amount-of-cement']}</td>
        <td class="amount-of-brick">${response['amount-of-brick']}</td>
        <td class="amount-of-water">${response['amount-of-water']}</td>
        <td class"sub-total>${subTotal}</td>`

    document.getElementById(`${id}`).classList = ''
    document.getElementById('utr').innerText = ''

    let total = document.getElementById('total')
    total.innerHTML = `<span>${parseInt(total.innerText) + response['total']}</span>`
    document.querySelector('.load').classList.add('hidden')
}

function countTotal(response) {
    let count = 0
    count += parseInt(response['brick-height'])
    count += parseInt(response['brick-length'])
    count += parseInt(response['wall-height'])
    count += parseInt(response['wall-length'])
    count += parseInt(response['amount-of-sand'])
    count += parseInt(response['amount-of-cement'])
    count += parseInt(response['amount-of-brick'])
    count += parseInt(response['amount-of-water'])

    return count
}
