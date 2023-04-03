let deleteBtn = document.getElementById('delete')
let form = document.querySelector('.counter')
let formInputs = document.querySelectorAll('input')
let tbody = document.getElementById('tbody')
let bricksData = document.querySelector('select')
let exportBtn = document.getElementById('export')

let commodityData = {}
exportBtn.onsubmit = (e) => {
    e.preventDefault()
    let processData = JSON.parse(localStorage.getItem('process-data'))
    downloadCsv(processData)
}

async function downloadCsv(data) {
    const request = await fetch('/create-csv/', {
        method: 'POST',
        headers: {
            'content-type': 'application/json',
            'X-CSRFToken': csrftoken
        },
        body: JSON.stringify(data)
    });
    const response = await request
    if (response.status == 200) {
        tbody.innerHTML = ''
        localStorage.removeItem('process-data')
        let total = document.getElementById('total')
        total.innerHTML = `<span>0</span>`

        location.href = '/create-csv/'
    }
}


const brickTypes = [
    [0.50, 0.20, 0.20],
    [0.50, 0.20, 0.15],
    [0.50, 0.20, 0.10],
    [0.40, 0.20, 0.20],
    [0.40, 0.20, 0.15],
    [0.40, 0.20, 0.10],
    [0.25, 0.13, 0.07],
    [0.25, 0.13, 0.05],
    [0.25, 0.13, 0.18],
    [0.25, 0.07, 0.13],
    [0.25, 0.18, 0.07],
    [0.25, 0.05, 0.13],
    [0.25, 0.18, 0.13],
    [0.20, 0.05, 0.10],
    [0.20, 0.02, 0.10],
    [0.10, 0.05, 0.10],
    [0.10, 0.02, 0.10],
    [0.60, 0.20, 0.20],
    [0.60, 0.20, 0.15],
    [0.60, 0.20, 0.10],
]

bricksData.onchange = handelBricksData
function handelBricksData() {
    brickDataValue = brickTypes[bricksData.value]
    commodityData['brick-length'] = brickDataValue[0]
    commodityData['brick-height'] = brickDataValue[1]
    commodityData['brick-width'] = brickDataValue[2]
}

// Table Row Events
function tableRowEvent(ele) {
    let tableTr = document.querySelectorAll('tr')
    tableTr.forEach((e) => {
        e.classList = ''
    })
    ele.classList += 'bg-primary'

    form.reset()
    commodityData['id'] = ele.id.slice(4)

    let wallHeight = document.getElementById('wall-height')
    let wallLength = document.getElementById('wall-length')
    wallHeight.value = 0
    wallLength.value = 0
}


// Handel Form Submit
form.onsubmit = (e) => {
    document.querySelector('.load').classList.remove('hidden')
    e.preventDefault()

    let wallHeight = document.getElementById('wall-height')
    let wallLength = document.getElementById('wall-length')
    let sand = document.getElementById('sand-price')
    let cement = document.getElementById('cement-price')
    let brick = document.getElementById('brick-price')
    let water = document.getElementById('water-price')
    handelBricksData()

    commodityData['wall-height'] = parseFloat(wallHeight.value)
    commodityData['wall-length'] = parseFloat(wallLength.value)
    commodityData['sand-price'] = parseFloat(sand.value)
    commodityData['cement-price'] = parseFloat(cement.value)
    commodityData['brick-price'] = parseFloat(brick.value)
    commodityData['water-price'] = parseFloat(water.value)
    commodityData['batter-thickness'] = 0.015
    // commodityData['batter'] = ((commodityData['wall-length'] + commodityData['wall-height']) * commodityData['brick-width'] * commodityData['batter-thickness']) / 1.1
    sendData(commodityData)

    form.reset()
    commodityData = {}
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
    let processData = JSON.parse(localStorage.getItem('process-data'))

    //////
    if (response['id']) {
        let tableRow = document.getElementById(`row-${response['id']}`)
        tableRow.innerHTML = `
            <td>${response['id']}</td>
            <td>${response['sand-price']}</td>
            <td>${response['sand-amount']}</td>
            <td>${response['cement-price']}</td>
            <td>${response['cement-amount']}</td>
            <td>${response['brick-price']}</td>
            <td>${response['brick-amount']}</td>
            <td>${response['water-price']}</td>
            <td>${response['water-amount']}</td>
            <td class="sub-total">${response['total']}</td>`
        tableRow.classList = ''
        processData[parseInt(response['id'])] = response

    } else {
        if (processData == null) {
            localStorage.setItem('process-data', JSON.stringify([{ 'total': 0 }]))
            processData = JSON.parse(localStorage.getItem('process-data'))
        }
        response['id'] = processData.length

        tbody.innerHTML += `
        <tr id="row-${response['id']}" onclick="tableRowEvent(this)">
            <td>${response['id']}</td>
            <td>${response['sand-price']}</td>
            <td>${response['sand-amount']}</td>
            <td>${response['cement-price']}</td>
            <td>${response['cement-amount']}</td>
            <td>${response['brick-price']}</td>
            <td>${response['brick-amount']}</td>
            <td>${response['water-price']}</td>
            <td>${response['water-amount']}</td>
            <td class="sub-total">${response['total']}</td>
        </tr>`
        processData.push(response)
    }
    /////
    processData[0]['total'] = 0
    processData.slice(1).forEach((record) => {
        processData[0]['total'] += record['total']
    })
    localStorage.setItem('process-data', JSON.stringify(processData))
    let total = document.getElementById('total')
    total.innerHTML = `<span>${processData[0]['total'].toFixed(2)}</span>`
    document.querySelector('.load').classList.add('hidden')
}


document.onload = uploadTableData()
function uploadTableData() {
    let processData = JSON.parse(localStorage.getItem('process-data'))
    let total = document.getElementById('total')

    total.innerHTML = `<span>${processData[0]['total'].toFixed(2)}</span>`
    processData = processData.slice(1)

    processData.forEach(function (value, index) {
        tbody.innerHTML += `
        <tr id="row-${value['id']}" onclick="tableRowEvent(this)">
            <td>${value['id']}</td>
            <td>${value['sand-price']}</td>
            <td>${value['sand-amount']}</td>
            <td>${value['cement-price']}</td>
            <td>${value['cement-amount']}</td>
            <td>${value['brick-price']}</td>
            <td>${value['brick-amount']}</td>
            <td>${value['water-price']}</td>
            <td>${value['water-amount']}</td>
            <td class="sub-total">${value['total']}</td>
        </tr>`
    })
}