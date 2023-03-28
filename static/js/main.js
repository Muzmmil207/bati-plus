let deleteBtn = document.getElementById('delete')
let saveBtn = document.getElementById('save')
let form = document.querySelector('.counter')
let formInputs = document.querySelectorAll('input')
let tbody = document.getElementById('tbody')
let bricksData = document.querySelector('select')
let wallHeight = document.getElementById('wall-height')
let wallLength = document.getElementById('wall-length')
let sand = document.getElementById('sand-amount')
let cement = document.getElementById('cement-amount')
let brick = document.getElementById('brick-amount')
let water = document.getElementById('water-amount')

let processData = localStorage.getItem('process-data') ? JSON.parse(localStorage.getItem('process-data')) : []
let commodityData = {}
let id = 0

bricksData.onchange = handelBricksData
wallHeight.onchange = dataHandler
wallLength.onchange = dataHandler
function handelBricksData() {
    brickDataValue = bricksData.value.split('*').map(function (e) {
        return parseFloat(e)
    })
    commodityData['brick-length'] = brickDataValue[0]
    commodityData['brick-height'] = brickDataValue[1]
    commodityData['brick-width'] = brickDataValue[2]
    console.log(typeof commodityData['brick-length'])
}
handelBricksData()

function dataHandler() {
    commodityData[this.id] = parseFloat(this.value)
    if (typeof commodityData['brick-length'] === "number") {
        if (typeof commodityData['wall-height'] === "number" && typeof commodityData['wall-length'] === "number") {
            commodityData['brick-amount']
                = parseInt(
                    (commodityData['wall-height'] * commodityData['wall-length']) /
                    (commodityData['brick-length'] * commodityData['brick-height']))
            console.log(commodityData['brick-amount'])
        }
        console.log('====================')
        console.log(commodityData)
        commodityData['bricks-amount']
    }
}


// Table Row Events
function tableRowEvent(ele) {
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
                    input.value = parseFloat(ele.children[i].innerText)
                };
            } catch (error) { }

        });
    };
    document.getElementById('utr').innerText = ele.id
}

function addTableRow(data) {
    tbody.innerHTML += `
        <tr id="${data['id']}" onclick="tableRowEvent(this)">
            <td class="brick-height">${data['brick-height']}</td>
            <td class="brick-length">${data['brick-length']}</td>
            <td class="wall-height">${data['wall-height']}</td>
            <td class="wall-length">${data['wall-length']}</td>
            <td class="sand-amount">${data['sand-amount']}</td>
            <td class="cement-amount">${data['cement-amount']}</td>
            <td class="brick-amount">${data['brick-amount']}</td>
            <td class="water-amount">${data['water-amount']}</td>
            <td class="sub-total">${subTotal}</td>
        </tr>`
}


// Handel Form Submit
form.onsubmit = (e) => {
    document.querySelector('.load').classList.remove('hidden')
    e.preventDefault()
    setTimeout(() => {
        if (document.getElementById('utr').innerText != '') {
            updateTableRow(document.getElementById('utr').innerText, commodityData)
            console.log(document.getElementById('utr').innerText, commodityData)
        } else {
            commodityData['id'] = id
            sendData(commodityData)
        }
        form.reset()
        processData += commodityData
        localStorage.setItem('process-data', JSON.stringify(processData))
        commodityData = {}
    }, 1000)
}

deleteBtn.onclick = () => {
    form.reset()
}


// Handel Sending Form Data
async function sendData(data) {
    const request = await fetch('/commodity/', {
        method: 'POST',
        headers: {
            'content-type': 'application/json',
            'X-CSRFToken': csrftoken
        },
        body: JSON.stringify(data)
    });
    const response = await request.json()
    let subTotal = countTotal(response)

    addTableRow(data)
    id += 1

    let total = document.getElementById('total')
    total.innerHTML = `<span>${parseFloat(total.innerText) + response['total']}</span>`
    document.querySelector('.load').classList.add('hidden')
}

async function updateTableRow(id, data) {
    const request = await fetch('/commodity/', {
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
        <td class="sand-amount">${response['sand-amount']}</td>
        <td class="cement-amount">${response['cement-amount']}</td>
        <td class="brick-amount">${response['brick-amount']}</td>
        <td class="water-amount">${response['water-amount']}</td>
        <td class"sub-total">${subTotal}</td>`

    document.getElementById(`${id}`).classList = ''
    document.getElementById('utr').innerText = ''

    let total = document.getElementById('total')
    total.innerHTML = `<span>${parseFloat(total.innerText) + response['total']}</span>`
    document.querySelector('.load').classList.add('hidden')
}

function countTotal(response) {
    let count = 0
    count += parseFloat(response['brick-height'])
    count += parseFloat(response['brick-length'])
    count += parseFloat(response['wall-height'])
    count += parseFloat(response['wall-length'])
    count += parseFloat(response['sand-amount'])
    count += parseFloat(response['cement-amount'])
    count += parseFloat(response['brick-amount'])
    count += parseFloat(response['water-amount'])

    return count
}
